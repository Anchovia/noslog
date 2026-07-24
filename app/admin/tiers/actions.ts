"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import { getJacketUrl, MAX_TIER_VALUE } from "@/lib/tiers";
import type { Prisma } from "@prisma/client";
import type { TierEntryPlacement } from "@/components/admin/tierBoard/tierBoardTypes";

const tierModes = new Set(["basic", "recital"]);
const tierGoals = new Set(["s", "fc", "pianist"]);
const tierStatuses = new Set(["draft", "published", "archived"]);

export async function searchTierCharts(query: string, tierListId: number) {
    await requireAdmin();
    const keyword = query.trim().slice(0, 100);
    if (!keyword || !Number.isInteger(tierListId)) return [];

    const charts = await db.musicChart.findMany({
        where: {
            tierEntries: { none: { tierListId } },
            music: {
                OR: [
                    { title: { contains: keyword, mode: "insensitive" } },
                    { artist: { contains: keyword, mode: "insensitive" } },
                    { index: { contains: keyword, mode: "insensitive" } },
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

function tierListData(formData: FormData) {
    const modeValue = String(formData.get("mode") ?? "basic");
    const goalValue = String(formData.get("goal") ?? "s");
    const statusValue = String(formData.get("status") ?? "draft");

    return {
        slug: String(formData.get("slug") ?? "")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-"),
        title: String(formData.get("title") ?? "").trim(),
        mode: tierModes.has(modeValue) ? modeValue : "basic",
        goal: tierGoals.has(goalValue) ? goalValue : "s",
        description: String(formData.get("description") ?? "").trim() || null,
        status: tierStatuses.has(statusValue) ? statusValue : "draft",
    };
}

function revalidateTierList(id: number) {
    updateTag(CACHE_TAGS.tierLists);
    revalidatePath("/admin");
    revalidatePath("/admin/tiers");
    revalidatePath(`/admin/tiers/${id}`);
    revalidatePath("/tiers");
    revalidatePath(`/tiers/${id}`);
}

export async function createTierList(formData: FormData) {
    await requireAdmin();
    const data = tierListData(formData);
    if (!data.slug || !data.title) return;

    const duplicate = await db.tierList.count({
        where: {
            OR: [
                { slug: data.slug },
                ...(data.status === "published"
                    ? [
                          {
                              mode: data.mode,
                              goal: data.goal,
                              status: "published",
                          },
                      ]
                    : []),
            ],
        },
    });
    if (duplicate) return;

    const tierList = await db.tierList.create({ data });
    revalidateTierList(tierList.id);
    redirect(`/admin/tiers/${tierList.id}`);
}

export async function updateTierList(formData: FormData) {
    await requireAdmin();
    const id = Number(formData.get("id"));
    const data = tierListData(formData);
    if (!Number.isInteger(id) || !data.slug || !data.title) return;

    const duplicate = await db.tierList.count({
        where: {
            NOT: { id },
            OR: [
                { slug: data.slug },
                ...(data.status === "published"
                    ? [
                          {
                              mode: data.mode,
                              goal: data.goal,
                              status: "published",
                          },
                      ]
                    : []),
            ],
        },
    });
    if (duplicate) return;

    await db.tierList.update({ where: { id }, data });
    revalidateTierList(id);
}

export async function deleteTierList(formData: FormData) {
    await requireAdmin();
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id)) return;

    await db.tierList.delete({ where: { id } });
    updateTag(CACHE_TAGS.tierLists);
    revalidatePath("/admin");
    revalidatePath("/admin/tiers");
    revalidatePath("/tiers");
    redirect("/admin/tiers");
}

export async function addTierBand(formData: FormData) {
    await requireAdmin();
    const tierListId = Number(formData.get("tierListId"));
    const value = Number(formData.get("value"));
    if (
        !Number.isInteger(tierListId) ||
        !Number.isFinite(value) ||
        value < 1 ||
        value > MAX_TIER_VALUE
    )
        return;

    const bands = await db.tierBand.findMany({
        where: { tierListId },
        select: { id: true, value: true },
        orderBy: { value: "desc" },
    });
    if (bands.some((band) => band.value === value)) return;

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
            data: {
                tierListId,
                value,
                position,
            },
        }),
        ...bands.map((band, index) =>
            db.tierBand.update({
                where: { id: band.id },
                data: { position: index + 1 + (index >= position - 1 ? 1 : 0) },
            })
        ),
    ];

    await db.$transaction(operations);
    revalidateTierList(tierListId);
}

export async function updateTierBand(formData: FormData) {
    await requireAdmin();
    const id = Number(formData.get("id"));
    const value = Number(formData.get("value"));
    if (
        !Number.isInteger(id) ||
        !Number.isFinite(value) ||
        value < 1 ||
        value > MAX_TIER_VALUE
    )
        return;

    const band = await db.tierBand.findUnique({
        where: { id },
        select: {
            value: true,
            tierListId: true,
            entries: { select: { chartId: true } },
        },
    });
    if (!band || band.value === value) return;

    const bands = await db.tierBand.findMany({
        where: { tierListId: band.tierListId },
        select: { id: true, value: true },
    });
    if (bands.some((item) => item.id !== id && item.value === value)) return;

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
}

export async function deleteTierBand(formData: FormData) {
    await requireAdmin();
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id)) return;

    const band = await db.tierBand.findUnique({
        where: { id },
        select: {
            tierListId: true,
            entries: { select: { chartId: true } },
        },
    });
    if (!band) return;

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
}

export async function addTierEntry(formData: FormData) {
    await requireAdmin();
    const tierListId = Number(formData.get("tierListId"));
    const tierBandId = Number(formData.get("tierBandId"));
    const chartId = Number(formData.get("chartId"));
    if (![tierListId, tierBandId, chartId].every(Number.isInteger)) return;

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
    if (!band || !chart || duplicate) return;

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
}

// 드래그로 바뀐 전체 배치를 한 번에 검증하고 저장함
export async function applyTierBoardLayout(
    tierListId: number,
    placements: TierEntryPlacement[]
) {
    await requireAdmin();
    if (!Number.isInteger(tierListId) || !Array.isArray(placements)) return;

    const isValidPlacement = (placement: TierEntryPlacement) =>
        Number.isInteger(placement.id) &&
        Number.isInteger(placement.tierBandId) &&
        Number.isInteger(placement.position) &&
        placement.position > 0;
    if (!placements.every(isValidPlacement)) return;

    const [bands, entries] = await Promise.all([
        db.tierBand.findMany({
            where: { tierListId },
            select: { id: true, value: true },
        }),
        db.tierEntry.findMany({
            where: { tierListId },
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
    const placementIds = new Set(placements.map((placement) => placement.id));
    if (
        placementIds.size !== placements.length ||
        placementIds.size !== entriesById.size ||
        placements.some(
            (placement) =>
                !entriesById.has(placement.id) ||
                !bandIds.has(placement.tierBandId)
        )
    )
        return;

    const positionsByBand = new Map<number, number[]>();
    for (const placement of placements) {
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
    )
        return;

    const changedPlacements = placements.filter((placement) => {
        const entry = entriesById.get(placement.id);
        return (
            entry?.tierBandId !== placement.tierBandId ||
            entry.position !== placement.position
        );
    });
    if (changedPlacements.length === 0) return;

    const bandValues = new Map(bands.map((band) => [band.id, band.value]));
    const operations: Prisma.PrismaPromise<unknown>[] = [
        // 기존 양수 위치를 고유한 음수 값으로 옮겨 위치 제약 충돌을 피함
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
            if (!entry || entry.tierBandId === placement.tierBandId) return [];

            return [
                db.tierPlacementHistory.create({
                    data: {
                        tierListId,
                        chartId: entry.chartId,
                        bandValue: bandValues.get(placement.tierBandId) ?? null,
                    },
                }),
            ];
        }),
    ];

    await db.$transaction(operations);
    revalidateTierList(tierListId);
}

export async function deleteTierEntry(formData: FormData) {
    await requireAdmin();
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id)) return;

    const entry = await db.tierEntry.findUnique({ where: { id } });
    if (!entry) return;

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
}

// 통합 서열표에서는 검색한 채보 한 건의 목표별 상수를 직접 변경함
export async function moveTierEntryToBand(formData: FormData) {
    await requireAdmin();
    const entryId = Number(formData.get("entryId"));
    const targetBandId = Number(formData.get("tierBandId"));
    if (![entryId, targetBandId].every(Number.isInteger)) return;

    const [entry, targetBand] = await Promise.all([
        db.tierEntry.findUnique({ where: { id: entryId } }),
        db.tierBand.findUnique({
            where: { id: targetBandId },
            select: { id: true, tierListId: true, value: true },
        }),
    ]);
    if (
        !entry ||
        !targetBand ||
        entry.tierListId !== targetBand.tierListId ||
        entry.tierBandId === targetBand.id
    )
        return;

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
}
