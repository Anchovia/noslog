import type { Prisma } from "@prisma/client";
import { revalidatePath, updateTag } from "next/cache";

import {
    tierBandCreateInputFromFormData,
    tierBandCreateSchema,
    tierBandDeleteSchema,
    tierBandUpdateInputFromFormData,
    tierBandUpdateSchema,
    tierBoardLayoutSchema,
    tierChartSearchSchema,
    tierEntryAddInputFromFormData,
    tierEntryAddSchema,
    tierEntryDeleteSchema,
    tierEntryMoveInputFromFormData,
    tierEntryMoveSchema,
    tierIdInputFromFormData,
    tierListDeleteSchema,
    tierListSaveInputFromFormData,
    tierListSaveSchema,
    type TierEntryPlacement,
    type TierListFormFieldName,
    type TierListSaveValues,
} from "@/features/tiers/schemas/tierAdminSchema";
import type { ActionFieldErrors, ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";
import { getJacketUrl } from "@/lib/tiers";

type TierListActionResult = ActionResult<{ id: number }, TierListFormFieldName>;
type TierMutationActionResult = ActionResult;

function tierListData(input: TierListSaveValues) {
    return {
        slug: input.slug,
        title: input.title,
        mode: input.mode,
        goal: input.goal,
        description: input.description || null,
        status: input.status,
    };
}

function tierListFieldErrors(
    issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>
) {
    const fieldErrors: ActionFieldErrors<TierListFormFieldName> = {};

    for (const issue of issues) {
        const field = issue.path[0];
        if (field === "id" || typeof field !== "string") continue;
        const fieldName = field as TierListFormFieldName;
        fieldErrors[fieldName] ??= [];
        fieldErrors[fieldName]?.push(issue.message);
    }

    return fieldErrors;
}

function invalidTierListResult(
    issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>
): TierListActionResult {
    const fieldErrors = tierListFieldErrors(issues);
    return {
        success: false,
        message: issues[0]?.message ?? "서열표 입력을 확인해주세요.",
        ...(Object.keys(fieldErrors).length > 0 ? { fieldErrors } : {}),
    };
}

function invalidMutationResult(
    issues: ReadonlyArray<{ message: string }>
): TierMutationActionResult {
    return {
        success: false,
        message: issues[0]?.message ?? "서열표 요청을 확인해주세요.",
    };
}

function logTierActionError(error: unknown, event: string) {
    logServerError(error, {
        event,
        routePath: "/admin/tiers",
        routeType: "action",
    });
}

function revalidateTierList(id: number) {
    updateTag(CACHE_TAGS.tierLists);
    updateTag(CACHE_TAGS.userRankings);
    revalidatePath("/admin");
    revalidatePath("/admin/tiers");
    revalidatePath(`/admin/tiers/${id}`);
    revalidatePath("/tiers");
    revalidatePath(`/tiers/${id}`);
}

function revalidateTierListIndex() {
    updateTag(CACHE_TAGS.tierLists);
    updateTag(CACHE_TAGS.userRankings);
    revalidatePath("/admin");
    revalidatePath("/admin/tiers");
    revalidatePath("/tiers");
}

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

export async function createTierList(
    formData: FormData
): Promise<TierListActionResult> {
    await requireAdmin();
    const result = tierListSaveSchema.safeParse(
        tierListSaveInputFromFormData(formData)
    );
    if (!result.success) return invalidTierListResult(result.error.issues);
    const input = result.data;

    try {
        const duplicate = await db.tierList.findFirst({
            where: {
                OR: [
                    { slug: input.slug },
                    ...(input.status === "published"
                        ? [
                              {
                                  mode: input.mode,
                                  goal: input.goal,
                                  status: "published",
                              },
                          ]
                        : []),
                ],
            },
            select: { slug: true },
        });
        if (duplicate) {
            const slugDuplicate = duplicate.slug === input.slug;
            const message = slugDuplicate
                ? "이미 사용 중인 식별자입니다."
                : "같은 모드와 목표의 공개 서열표가 이미 있습니다.";
            const field = slugDuplicate ? "slug" : "status";
            return {
                success: false,
                message,
                fieldErrors: { [field]: [message] },
            };
        }

        const tierList = await db.tierList.create({
            data: tierListData(input),
        });
        revalidateTierList(tierList.id);
        return {
            success: true,
            message: "서열표를 생성했습니다.",
            id: tierList.id,
        };
    } catch (error) {
        logTierActionError(error, "admin.tier-list.create.failed");
        return { success: false, message: "서열표를 생성하지 못했습니다." };
    }
}

export async function updateTierList(
    formData: FormData
): Promise<TierListActionResult> {
    await requireAdmin();
    const result = tierListSaveSchema.safeParse(
        tierListSaveInputFromFormData(formData)
    );
    if (!result.success) return invalidTierListResult(result.error.issues);
    const input = result.data;
    if (input.id === undefined) {
        return { success: false, message: "잘못된 서열표입니다." };
    }

    try {
        const duplicate = await db.tierList.findFirst({
            where: {
                NOT: { id: input.id },
                OR: [
                    { slug: input.slug },
                    ...(input.status === "published"
                        ? [
                              {
                                  mode: input.mode,
                                  goal: input.goal,
                                  status: "published",
                              },
                          ]
                        : []),
                ],
            },
            select: { slug: true },
        });
        if (duplicate) {
            const slugDuplicate = duplicate.slug === input.slug;
            const message = slugDuplicate
                ? "이미 사용 중인 식별자입니다."
                : "같은 모드와 목표의 공개 서열표가 이미 있습니다.";
            const field = slugDuplicate ? "slug" : "status";
            return {
                success: false,
                message,
                fieldErrors: { [field]: [message] },
            };
        }

        await db.tierList.update({
            where: { id: input.id },
            data: tierListData(input),
        });
        revalidateTierList(input.id);
        return {
            success: true,
            message: "서열표 정보를 저장했습니다.",
            id: input.id,
        };
    } catch (error) {
        logTierActionError(error, "admin.tier-list.update.failed");
        return { success: false, message: "서열표를 저장하지 못했습니다." };
    }
}

export async function deleteTierList(
    formData: FormData
): Promise<TierMutationActionResult> {
    await requireAdmin();
    const result = tierListDeleteSchema.safeParse(
        tierIdInputFromFormData(formData)
    );
    if (!result.success) return invalidMutationResult(result.error.issues);

    try {
        await db.tierList.delete({ where: { id: result.data.id } });
        revalidateTierListIndex();
        return { success: true, message: "보관 서열표를 삭제했습니다." };
    } catch (error) {
        logTierActionError(error, "admin.tier-list.delete.failed");
        return { success: false, message: "서열표를 삭제하지 못했습니다." };
    }
}

export async function addTierBand(
    formData: FormData
): Promise<TierMutationActionResult> {
    await requireAdmin();
    const result = tierBandCreateSchema.safeParse(
        tierBandCreateInputFromFormData(formData)
    );
    if (!result.success) return invalidMutationResult(result.error.issues);
    const { tierListId, value } = result.data;

    try {
        const bands = await db.tierBand.findMany({
            where: { tierListId },
            select: { id: true, value: true },
            orderBy: { value: "desc" },
        });
        if (bands.some((band) => band.value === value)) {
            return {
                success: false,
                message: "같은 서열 상수 구간이 이미 있습니다.",
            };
        }

        const insertionIndex = bands.findIndex((band) => band.value < value);
        const position =
            insertionIndex === -1 ? bands.length + 1 : insertionIndex + 1;
        const operations: Prisma.PrismaPromise<unknown>[] = [
            ...bands.map((band) =>
                db.tierBand.update({
                    where: { id: band.id },
                    data: { position: -band.id },
                })
            ),
            db.tierBand.create({
                data: { tierListId, value, position },
            }),
            ...bands.map((band, index) =>
                db.tierBand.update({
                    where: { id: band.id },
                    data: {
                        position: index + 1 + (index >= position - 1 ? 1 : 0),
                    },
                })
            ),
        ];

        await db.$transaction(operations);
        revalidateTierList(tierListId);
        return { success: true, message: "서열 상수 구간을 추가했습니다." };
    } catch (error) {
        logTierActionError(error, "admin.tier-band.create.failed");
        return { success: false, message: "구간을 추가하지 못했습니다." };
    }
}

export async function updateTierBand(
    formData: FormData
): Promise<TierMutationActionResult> {
    await requireAdmin();
    const result = tierBandUpdateSchema.safeParse(
        tierBandUpdateInputFromFormData(formData)
    );
    if (!result.success) return invalidMutationResult(result.error.issues);
    const { id, value } = result.data;

    try {
        const band = await db.tierBand.findUnique({
            where: { id },
            select: {
                value: true,
                tierListId: true,
                entries: { select: { chartId: true } },
            },
        });
        if (!band) {
            return { success: false, message: "서열 상수 구간이 없습니다." };
        }
        if (band.value === value) {
            return { success: true, message: "변경 사항이 없습니다." };
        }

        const bands = await db.tierBand.findMany({
            where: { tierListId: band.tierListId },
            select: { id: true, value: true },
        });
        if (bands.some((item) => item.id !== id && item.value === value)) {
            return {
                success: false,
                message: "같은 서열 상수 구간이 이미 있습니다.",
            };
        }

        const sortedBands = bands
            .map((item) => (item.id === id ? { ...item, value } : item))
            .sort((left, right) => right.value - left.value);
        const operations: Prisma.PrismaPromise<unknown>[] = [
            ...bands.map((item) =>
                db.tierBand.update({
                    where: { id: item.id },
                    data: { position: -item.id },
                })
            ),
            ...sortedBands.map((item, index) =>
                db.tierBand.update({
                    where: { id: item.id },
                    data: {
                        position: index + 1,
                        ...(item.id === id ? { value } : {}),
                    },
                })
            ),
            ...(band.entries.length > 0
                ? [
                      db.tierPlacementHistory.createMany({
                          data: band.entries.map((entry) => ({
                              tierListId: band.tierListId,
                              chartId: entry.chartId,
                              bandValue: value,
                          })),
                      }),
                  ]
                : []),
        ];

        await db.$transaction(operations);
        revalidateTierList(band.tierListId);
        return { success: true, message: "서열 상수 구간을 저장했습니다." };
    } catch (error) {
        logTierActionError(error, "admin.tier-band.update.failed");
        return { success: false, message: "구간을 저장하지 못했습니다." };
    }
}

export async function deleteTierBand(
    formData: FormData
): Promise<TierMutationActionResult> {
    await requireAdmin();
    const result = tierBandDeleteSchema.safeParse(
        tierIdInputFromFormData(formData)
    );
    if (!result.success) return invalidMutationResult(result.error.issues);
    const { id } = result.data;

    try {
        const band = await db.tierBand.findUnique({
            where: { id },
            select: {
                tierListId: true,
                entries: { select: { chartId: true } },
            },
        });
        if (!band) {
            return { success: false, message: "서열 상수 구간이 없습니다." };
        }

        const remainingBands = await db.tierBand.findMany({
            where: { tierListId: band.tierListId, NOT: { id } },
            select: { id: true },
            orderBy: { value: "desc" },
        });
        const operations: Prisma.PrismaPromise<unknown>[] = [
            ...remainingBands.map((item) =>
                db.tierBand.update({
                    where: { id: item.id },
                    data: { position: -item.id },
                })
            ),
            ...(band.entries.length > 0
                ? [
                      db.tierPlacementHistory.createMany({
                          data: band.entries.map((entry) => ({
                              tierListId: band.tierListId,
                              chartId: entry.chartId,
                              bandValue: null,
                          })),
                      }),
                  ]
                : []),
            db.tierBand.delete({ where: { id } }),
            ...remainingBands.map((item, index) =>
                db.tierBand.update({
                    where: { id: item.id },
                    data: { position: index + 1 },
                })
            ),
        ];

        await db.$transaction(operations);
        revalidateTierList(band.tierListId);
        return { success: true, message: "서열 상수 구간을 삭제했습니다." };
    } catch (error) {
        logTierActionError(error, "admin.tier-band.delete.failed");
        return { success: false, message: "구간을 삭제하지 못했습니다." };
    }
}

export async function addTierEntry(
    formData: FormData
): Promise<TierMutationActionResult> {
    await requireAdmin();
    const result = tierEntryAddSchema.safeParse(
        tierEntryAddInputFromFormData(formData)
    );
    if (!result.success) return invalidMutationResult(result.error.issues);
    const { tierListId, tierBandId, chartId } = result.data;

    try {
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
        ]);
        revalidateTierList(tierListId);
        return { success: true, message: "채보를 구간에 추가했습니다." };
    } catch (error) {
        logTierActionError(error, "admin.tier-entry.create.failed");
        return { success: false, message: "채보를 추가하지 못했습니다." };
    }
}

export async function applyTierBoardLayout(
    tierListId: number,
    placements: TierEntryPlacement[]
): Promise<TierMutationActionResult> {
    await requireAdmin();
    const result = tierBoardLayoutSchema.safeParse({ tierListId, placements });
    if (!result.success) return invalidMutationResult(result.error.issues);
    const input = result.data;

    try {
        const [bands, entries] = await Promise.all([
            db.tierBand.findMany({
                where: { tierListId: input.tierListId },
                select: { id: true, value: true },
            }),
            db.tierEntry.findMany({
                where: { tierListId: input.tierListId },
                select: {
                    id: true,
                    chartId: true,
                    tierBandId: true,
                    position: true,
                },
            }),
        ]);
        const bandIds = new Set(bands.map((band) => band.id));
        const entriesById = new Map(entries.map((entry) => [entry.id, entry]));
        const placementIds = new Set(
            input.placements.map((placement) => placement.id)
        );
        if (
            placementIds.size !== input.placements.length ||
            placementIds.size !== entriesById.size ||
            input.placements.some(
                (placement) =>
                    !entriesById.has(placement.id) ||
                    !bandIds.has(placement.tierBandId)
            )
        ) {
            return {
                success: false,
                message: "현재 서열표와 배치 정보가 일치하지 않습니다.",
            };
        }

        const positionsByBand = new Map<number, number[]>();
        for (const placement of input.placements) {
            const positions = positionsByBand.get(placement.tierBandId) ?? [];
            positions.push(placement.position);
            positionsByBand.set(placement.tierBandId, positions);
        }
        if (
            [...positionsByBand.values()].some((positions) =>
                positions
                    .sort((left, right) => left - right)
                    .some((position, index) => position !== index + 1)
            )
        ) {
            return {
                success: false,
                message: "구간 안의 채보 순서를 확인해주세요.",
            };
        }

        const changedPlacements = input.placements.filter((placement) => {
            const entry = entriesById.get(placement.id);
            return (
                entry?.tierBandId !== placement.tierBandId ||
                entry.position !== placement.position
            );
        });
        if (changedPlacements.length === 0) {
            return { success: true, message: "변경 사항이 없습니다." };
        }

        const bandValues = new Map(bands.map((band) => [band.id, band.value]));
        const operations: Prisma.PrismaPromise<unknown>[] = [
            ...changedPlacements.map((placement) =>
                db.tierEntry.update({
                    where: { id: placement.id },
                    data: { position: -placement.id },
                })
            ),
            ...changedPlacements.map((placement) =>
                db.tierEntry.update({
                    where: { id: placement.id },
                    data: {
                        tierBandId: placement.tierBandId,
                        position: placement.position,
                    },
                })
            ),
            ...changedPlacements.flatMap((placement) => {
                const entry = entriesById.get(placement.id);
                if (!entry || entry.tierBandId === placement.tierBandId) {
                    return [];
                }

                return [
                    db.tierPlacementHistory.create({
                        data: {
                            tierListId: input.tierListId,
                            chartId: entry.chartId,
                            bandValue:
                                bandValues.get(placement.tierBandId) ?? null,
                        },
                    }),
                ];
            }),
        ];

        await db.$transaction(operations);
        revalidateTierList(input.tierListId);
        return { success: true, message: "서열표 배치를 적용했습니다." };
    } catch (error) {
        logTierActionError(error, "admin.tier-board.update.failed");
        return { success: false, message: "배치를 적용하지 못했습니다." };
    }
}

export async function deleteTierEntry(
    formData: FormData
): Promise<TierMutationActionResult> {
    await requireAdmin();
    const result = tierEntryDeleteSchema.safeParse(
        tierIdInputFromFormData(formData)
    );
    if (!result.success) return invalidMutationResult(result.error.issues);
    const { id } = result.data;

    try {
        const entry = await db.tierEntry.findUnique({ where: { id } });
        if (!entry) {
            return { success: false, message: "서열표 채보가 없습니다." };
        }

        const remainingEntries = await db.tierEntry.findMany({
            where: { tierBandId: entry.tierBandId, NOT: { id } },
            select: { id: true },
            orderBy: { position: "asc" },
        });
        const operations: Prisma.PrismaPromise<unknown>[] = [
            ...remainingEntries.map((item) =>
                db.tierEntry.update({
                    where: { id: item.id },
                    data: { position: -item.id },
                })
            ),
            db.tierEntry.delete({ where: { id } }),
            ...remainingEntries.map((item, index) =>
                db.tierEntry.update({
                    where: { id: item.id },
                    data: { position: index + 1 },
                })
            ),
            db.tierPlacementHistory.create({
                data: {
                    tierListId: entry.tierListId,
                    chartId: entry.chartId,
                    bandValue: null,
                },
            }),
        ];

        await db.$transaction(operations);
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
    if (!result.success) return invalidMutationResult(result.error.issues);
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
            ...sourceEntries.map((item) =>
                db.tierEntry.update({
                    where: { id: item.id },
                    data: { position: -item.id },
                })
            ),
            db.tierEntry.update({
                where: { id: entry.id },
                data: { position: -entry.id },
            }),
            ...sourceEntries.map((item, index) =>
                db.tierEntry.update({
                    where: { id: item.id },
                    data: { position: index + 1 },
                })
            ),
            db.tierEntry.update({
                where: { id: entry.id },
                data: {
                    tierBandId: targetBand.id,
                    position: (targetLastEntry?.position ?? 0) + 1,
                },
            }),
            db.tierPlacementHistory.create({
                data: {
                    tierListId: entry.tierListId,
                    chartId: entry.chartId,
                    bandValue: targetBand.value,
                },
            }),
        ]);
        revalidateTierList(entry.tierListId);
        return { success: true, message: "채보의 서열 상수를 저장했습니다." };
    } catch (error) {
        logTierActionError(error, "admin.tier-entry.move.failed");
        return { success: false, message: "채보를 이동하지 못했습니다." };
    }
}
