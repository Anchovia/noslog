import "server-only";

import type { Prisma } from "@prisma/client";

import {
    tierChartSearchSchema,
    tierEntryAddInputFromFormData,
    tierEntryAddSchema,
    tierEntryDeleteSchema,
    tierEntryMoveInputFromFormData,
    tierEntryMoveSchema,
    tierIdInputFromFormData,
} from "@/features/tiers/schemas/tier-admin-schema";
import {
    ARCHIVED_TIER_LIST,
    invalidTierMutation,
    isEditableTierList,
    logTierActionError,
    parkPositions,
    placePositions,
    revalidateTierList,
    type TierMutationActionResult,
    touchTierList,
} from "@/features/tiers/server/tier-admin-shared";
import { requireAdmin } from "@/lib/admin";
import db from "@/lib/db";
import { getJacketUrl } from "@/lib/music/jackets";

export async function searchTierCharts(query: string, tierListId: number) {
    await requireAdmin();
    const result = tierChartSearchSchema.safeParse({ query, tierListId });
    if (!result.success || !result.data.query) return [];
    const input = result.data;

    const charts = await db.musicChart.findMany({
        where: {
            tierEntries: { none: { tierListId: input.tierListId } },
            music: {
                OR: [
                    {
                        title: {
                            contains: input.query,
                            mode: "insensitive",
                        },
                    },
                    {
                        artist: {
                            contains: input.query,
                            mode: "insensitive",
                        },
                    },
                    {
                        index: {
                            contains: input.query,
                            mode: "insensitive",
                        },
                    },
                ],
            },
        },
        select: {
            id: true,
            difficulty: true,
            level: true,
            music: {
                select: {
                    index: true,
                    title: true,
                    artist: true,
                    background: true,
                },
            },
        },
        orderBy: { music: { title: "asc" } },
        take: 20,
    });

    return charts.map((chart) => ({
        id: chart.id,
        musicIndex: chart.music.index,
        title: chart.music.title,
        artist: chart.music.artist,
        jacket: getJacketUrl(chart.music.index, chart.music.background),
        difficulty: chart.difficulty,
        level: chart.level,
    }));
}

export async function addTierEntry(
    formData: FormData
): Promise<TierMutationActionResult> {
    await requireAdmin();
    const result = tierEntryAddSchema.safeParse(
        tierEntryAddInputFromFormData(formData)
    );
    if (!result.success) return invalidTierMutation(result.error);
    const { tierListId, tierBandId, chartId } = result.data;

    try {
        if (!(await isEditableTierList(tierListId))) return ARCHIVED_TIER_LIST;
        const [band, chart, duplicate] = await Promise.all([
            db.tierBand.findFirst({
                where: { id: tierBandId, tierListId },
                select: { value: true },
            }),
            db.musicChart.findUnique({
                where: { id: chartId },
                select: { id: true },
            }),
            db.tierEntry.count({ where: { tierListId, chartId } }),
        ]);
        if (!band) {
            return { success: false, message: "선택한 구간이 없습니다." };
        }
        if (!chart) {
            return { success: false, message: "선택한 채보가 없습니다." };
        }
        if (duplicate) {
            return {
                success: false,
                message: "이미 서열표에 포함된 채보입니다.",
            };
        }

        const lastEntry = await db.tierEntry.findFirst({
            where: { tierBandId },
            select: { position: true },
            orderBy: { position: "desc" },
        });
        await db.$transaction([
            db.tierEntry.create({
                data: {
                    tierListId,
                    tierBandId,
                    chartId,
                    position: (lastEntry?.position ?? 0) + 1,
                },
            }),
            db.tierPlacementHistory.create({
                data: { tierListId, chartId, bandValue: band.value },
            }),
            touchTierList(tierListId),
        ]);
        revalidateTierList(tierListId);
        return { success: true, message: "채보를 구간에 추가했습니다." };
    } catch (error) {
        logTierActionError(error, "admin.tier-entry.create.failed");
        return { success: false, message: "채보를 추가하지 못했습니다." };
    }
}

export async function deleteTierEntry(
    formData: FormData
): Promise<TierMutationActionResult> {
    await requireAdmin();
    const result = tierEntryDeleteSchema.safeParse(
        tierIdInputFromFormData(formData)
    );
    if (!result.success) return invalidTierMutation(result.error);
    const { id } = result.data;

    try {
        const entry = await db.tierEntry.findUnique({ where: { id } });
        if (!entry) {
            return { success: false, message: "서열표 채보가 없습니다." };
        }
        if (!(await isEditableTierList(entry.tierListId)))
            return ARCHIVED_TIER_LIST;

        const remainingEntries = await db.tierEntry.findMany({
            where: { tierBandId: entry.tierBandId, NOT: { id } },
            select: { id: true },
            orderBy: { position: "asc" },
        });
        const operations: Prisma.PrismaPromise<unknown>[] = [
            ...parkPositions(
                "TierEntry",
                remainingEntries.map((item) => item.id)
            ),
            db.tierEntry.delete({ where: { id } }),
            ...placePositions(
                "TierEntry",
                remainingEntries.map((item, index) => ({
                    id: item.id,
                    position: index + 1,
                }))
            ),
            db.tierPlacementHistory.create({
                data: {
                    tierListId: entry.tierListId,
                    chartId: entry.chartId,
                    bandValue: null,
                },
            }),
        ];

        await db.$transaction([...operations, touchTierList(entry.tierListId)]);
        revalidateTierList(entry.tierListId);
        return { success: true, message: "채보를 서열표에서 제거했습니다." };
    } catch (error) {
        logTierActionError(error, "admin.tier-entry.delete.failed");
        return { success: false, message: "채보를 제거하지 못했습니다." };
    }
}

export async function moveTierEntryToBand(
    formData: FormData
): Promise<TierMutationActionResult> {
    await requireAdmin();
    const result = tierEntryMoveSchema.safeParse(
        tierEntryMoveInputFromFormData(formData)
    );
    if (!result.success) return invalidTierMutation(result.error);
    const { entryId, tierBandId } = result.data;

    try {
        const [entry, targetBand] = await Promise.all([
            db.tierEntry.findUnique({ where: { id: entryId } }),
            db.tierBand.findUnique({
                where: { id: tierBandId },
                select: { id: true, tierListId: true, value: true },
            }),
        ]);
        if (!entry || !targetBand) {
            return {
                success: false,
                message: "채보 또는 이동할 구간을 찾을 수 없습니다.",
            };
        }
        if (!(await isEditableTierList(entry.tierListId)))
            return ARCHIVED_TIER_LIST;
        if (entry.tierListId !== targetBand.tierListId) {
            return {
                success: false,
                message: "다른 서열표의 구간으로 이동할 수 없습니다.",
            };
        }
        if (entry.tierBandId === targetBand.id) {
            return { success: true, message: "변경 사항이 없습니다." };
        }

        const [sourceEntries, targetLastEntry] = await Promise.all([
            db.tierEntry.findMany({
                where: { tierBandId: entry.tierBandId, NOT: { id: entry.id } },
                select: { id: true },
                orderBy: { position: "asc" },
            }),
            db.tierEntry.findFirst({
                where: { tierBandId: targetBand.id },
                select: { position: true },
                orderBy: { position: "desc" },
            }),
        ]);

        await db.$transaction([
            ...parkPositions("TierEntry", [
                ...sourceEntries.map((item) => item.id),
                entry.id,
            ]),
            ...placePositions("TierEntry", [
                ...sourceEntries.map((item, index) => ({
                    id: item.id,
                    position: index + 1,
                })),
                {
                    id: entry.id,
                    position: (targetLastEntry?.position ?? 0) + 1,
                    tierBandId: targetBand.id,
                },
            ]),
            db.tierPlacementHistory.create({
                data: {
                    tierListId: entry.tierListId,
                    chartId: entry.chartId,
                    bandValue: targetBand.value,
                },
            }),
            touchTierList(entry.tierListId),
        ]);
        revalidateTierList(entry.tierListId);
        return { success: true, message: "채보의 서열 상수를 저장했습니다." };
    } catch (error) {
        logTierActionError(error, "admin.tier-entry.move.failed");
        return { success: false, message: "채보를 이동하지 못했습니다." };
    }
}
