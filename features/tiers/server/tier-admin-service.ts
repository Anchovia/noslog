import { Prisma } from "@prisma/client";
import { revalidatePath, updateTag } from "next/cache";
import { after } from "next/server";
import type { ZodError } from "zod";

import { rebuildStalePlayerRatings } from "@/features/rankings/server/player-rating-service";
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
    type TierEntryPlacement,
    tierIdInputFromFormData,
    tierListDeleteSchema,
    type TierListFormFieldName,
    tierListSaveInputFromFormData,
    tierListSaveSchema,
    type TierListSaveValues,
} from "@/features/tiers/schemas/tier-admin-schema";
import type { ActionResult } from "@/lib/actions/result";
import { actionValidationFailure } from "@/lib/actions/validation";
import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cache-tags";
import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";
import { getJacketUrl } from "@/lib/tiers";

type TierListActionResult = ActionResult<{ id: number }, TierListFormFieldName>;
type TierMutationActionResult = ActionResult;

function invalidTierListInput(error: ZodError): TierListActionResult {
    return actionValidationFailure<TierListFormFieldName>(error, {
        message: "서열표 입력을 확인해주세요.",
        preferFirstIssue: true,
        omitFields: ["id"],
    });
}

function invalidTierMutation(error: ZodError): TierMutationActionResult {
    return actionValidationFailure(error, {
        message: "서열표 요청을 확인해주세요.",
        preferFirstIssue: true,
        fieldPath: false,
    });
}

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

function logTierActionError(error: unknown, event: string) {
    logServerError(error, {
        event,
        routePath: "/admin/tiers",
        routeType: "action",
    });
}

// 피아니스트 서열 상수가 바뀌었으면 저장해 둔 레이팅을 응답 뒤에 다시 센다(2026-10-15 L2-A2).
// 기준이 그대로면(초안 · 다른 목표 서열표) 한 줄 확인으로 끝난다
function rebuildRatingsAfterResponse() {
    after(() =>
        rebuildStalePlayerRatings().catch((error) =>
            logServerError(error, {
                event: "admin.tiers.player-ratings.rebuild",
                routePath: "/admin/tiers",
                routeType: "action",
            })
        )
    );
}

function revalidateTierList(id: number) {
    // 랭킹 레이팅 캐시도 tierLists 태그를 달고 있어 함께 비워진다(userRankings 따로 안 비움)
    updateTag(CACHE_TAGS.tierLists);
    rebuildRatingsAfterResponse();
    revalidatePath("/admin");
    revalidatePath("/admin/tiers");
    revalidatePath(`/admin/tiers/${id}`);
    revalidatePath("/tiers");
    revalidatePath(`/tiers/${id}`);
}

function revalidateTierListIndex() {
    // 랭킹 레이팅 캐시도 tierLists 태그를 달고 있어 함께 비워진다(userRankings 따로 안 비움)
    updateTag(CACHE_TAGS.tierLists);
    rebuildRatingsAfterResponse();
    revalidatePath("/admin");
    revalidatePath("/admin/tiers");
    revalidatePath("/tiers");
}

type TierPositionTable = "TierBand" | "TierEntry";

/*
 * 순번을 문장 두 개로 다시 매긴다(2026-10-16 DB 재설계 P4 Q5) — 예전에는 줄마다 UPDATE 를 두 번(2N) 보냈다.
 * 유일 키(목록 · 순번, 구간 · 순번)는 행마다 바로 검사되므로 한 문장으로 맞바꾸면 중간에 부딪힌다.
 * 그래서 예전처럼 먼저 모두 음수(-id)로 비킨 뒤 한 번에 제자리로 옮긴다. updated_at 은 Prisma 대신 직접 쓴다
 */
function parkPositions(table: TierPositionTable, ids: number[]) {
    if (ids.length === 0) return [];
    return [
        db.$executeRaw`UPDATE ${Prisma.raw(`"${table}"`)} SET "position" = -"id", "updated_at" = CURRENT_TIMESTAMP WHERE "id" IN (${Prisma.join(ids)})`,
    ];
}

function placePositions(
    table: TierPositionTable,
    rows: { id: number; position: number; tierBandId?: number }[]
) {
    if (rows.length === 0) return [];
    const values = Prisma.join(
        rows.map(
            (row) =>
                Prisma.sql`(${row.id}::int, ${row.position}::int, ${row.tierBandId ?? null}::int)`
        )
    );
    // TierEntry 는 다른 구간으로 옮길 때 구간도 함께 바꾼다
    const band =
        table === "TierEntry"
            ? Prisma.sql`, "tier_band_id" = COALESCE(v.band, t."tier_band_id")`
            : Prisma.empty;
    return [
        db.$executeRaw`UPDATE ${Prisma.raw(`"${table}"`)} AS t SET "position" = v.position, "updated_at" = CURRENT_TIMESTAMP${band} FROM (VALUES ${values}) AS v(id, position, band) WHERE t."id" = v.id`,
    ];
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
    if (!result.success) return invalidTierListInput(result.error);
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
                                  status: "published" as const,
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
    if (!result.success) return invalidTierListInput(result.error);
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
                                  status: "published" as const,
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
    if (!result.success) return invalidTierMutation(result.error);

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
    if (!result.success) return invalidTierMutation(result.error);
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
            ...parkPositions(
                "TierBand",
                bands.map((band) => band.id)
            ),
            db.tierBand.create({
                data: { tierListId, value, position },
            }),
            ...placePositions(
                "TierBand",
                bands.map((band, index) => ({
                    id: band.id,
                    position: index + 1 + (index >= position - 1 ? 1 : 0),
                }))
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
    if (!result.success) return invalidTierMutation(result.error);
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
            ...parkPositions(
                "TierBand",
                bands.map((item) => item.id)
            ),
            ...placePositions(
                "TierBand",
                sortedBands.map((item, index) => ({
                    id: item.id,
                    position: index + 1,
                }))
            ),
            db.tierBand.update({ where: { id }, data: { value } }),
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
    if (!result.success) return invalidTierMutation(result.error);
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
            ...parkPositions(
                "TierBand",
                remainingBands.map((item) => item.id)
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
            ...placePositions(
                "TierBand",
                remainingBands.map((item, index) => ({
                    id: item.id,
                    position: index + 1,
                }))
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
    if (!result.success) return invalidTierMutation(result.error);
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
    if (!result.success) return invalidTierMutation(result.error);
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
            ...parkPositions(
                "TierEntry",
                changedPlacements.map((placement) => placement.id)
            ),
            ...placePositions(
                "TierEntry",
                changedPlacements.map((placement) => ({
                    id: placement.id,
                    position: placement.position,
                    tierBandId: placement.tierBandId,
                }))
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
    if (!result.success) return invalidTierMutation(result.error);
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
        ]);
        revalidateTierList(entry.tierListId);
        return { success: true, message: "채보의 서열 상수를 저장했습니다." };
    } catch (error) {
        logTierActionError(error, "admin.tier-entry.move.failed");
        return { success: false, message: "채보를 이동하지 못했습니다." };
    }
}
