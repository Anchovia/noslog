"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import { getJacketUrl, MAX_TIER_VALUE } from "@/lib/tiers";
import type { Prisma } from "@prisma/client";

const tierModes = new Set(["basic", "recital"]);
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
    const statusValue = String(formData.get("status") ?? "draft");

    return {
        slug: String(formData.get("slug") ?? "")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-"),
        title: String(formData.get("title") ?? "").trim(),
        mode: tierModes.has(modeValue) ? modeValue : "basic",
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

async function normalizeEntryPositions(
    transaction: Prisma.TransactionClient,
    tierBandId: number
) {
    const entries = await transaction.tierEntry.findMany({
        where: { tierBandId },
        select: { id: true },
        orderBy: { position: "asc" },
    });

    for (const [index, entry] of entries.entries()) {
        await transaction.tierEntry.update({
            where: { id: entry.id },
            data: { position: index + 1 },
        });
    }
}

async function normalizeBandPositions(
    transaction: Prisma.TransactionClient,
    tierListId: number
) {
    const bands = await transaction.tierBand.findMany({
        where: { tierListId },
        select: { id: true },
        orderBy: { value: "desc" },
    });

    for (const [index, band] of bands.entries()) {
        await transaction.tierBand.update({
            where: { id: band.id },
            data: { position: -(index + 1) },
        });
    }
    for (const [index, band] of bands.entries()) {
        await transaction.tierBand.update({
            where: { id: band.id },
            data: { position: index + 1 },
        });
    }
}

export async function createTierList(formData: FormData) {
    await requireAdmin();
    const data = tierListData(formData);
    if (!data.slug || !data.title) return;

    const duplicate = await db.tierList.count({
        where: { slug: data.slug },
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
        where: { slug: data.slug, NOT: { id } },
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

    const lastBand = await db.tierBand.findFirst({
        where: { tierListId },
        select: { position: true },
        orderBy: { position: "desc" },
    });
    const duplicate = await db.tierBand.count({
        where: { tierListId, value },
    });
    if (duplicate) return;

    await db.$transaction(async (transaction) => {
        await transaction.tierBand.create({
            data: {
                tierListId,
                value,
                position: (lastBand?.position ?? 0) + 1,
            },
        });
        await normalizeBandPositions(transaction, tierListId);
    });
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

    const duplicate = await db.tierBand.count({
        where: { tierListId: band.tierListId, value, NOT: { id } },
    });
    if (duplicate) return;

    await db.$transaction(async (transaction) => {
        await transaction.tierBand.update({ where: { id }, data: { value } });
        if (band.entries.length > 0) {
            await transaction.tierPlacementHistory.createMany({
                data: band.entries.map((entry) => ({
                    tierListId: band.tierListId,
                    chartId: entry.chartId,
                    bandValue: value,
                })),
            });
        }
        await normalizeBandPositions(transaction, band.tierListId);
    });
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

    await db.$transaction(async (transaction) => {
        if (band.entries.length > 0) {
            await transaction.tierPlacementHistory.createMany({
                data: band.entries.map((entry) => ({
                    tierListId: band.tierListId,
                    chartId: entry.chartId,
                    bandValue: null,
                })),
            });
        }
        await transaction.tierBand.delete({ where: { id } });

        await normalizeBandPositions(transaction, band.tierListId);
    });
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

export async function moveTierEntryByDrop(
    entryId: number,
    targetBandId: number,
    targetIndex: number
) {
    await requireAdmin();
    if (
        !Number.isInteger(entryId) ||
        !Number.isInteger(targetBandId) ||
        !Number.isInteger(targetIndex)
    )
        return;

    const entry = await db.tierEntry.findUnique({ where: { id: entryId } });
    if (!entry) return;

    const targetBand = await db.tierBand.findFirst({
        where: { id: targetBandId, tierListId: entry.tierListId },
        select: { value: true },
    });
    if (!targetBand) return;

    const affectedBandIds = [...new Set([entry.tierBandId, targetBandId])];
    const affectedEntries = await db.tierEntry.findMany({
        where: { tierBandId: { in: affectedBandIds } },
        select: { id: true, tierBandId: true },
        orderBy: { position: "asc" },
    });
    const sourceIds = affectedEntries
        .filter(
            (item) =>
                item.tierBandId === entry.tierBandId && item.id !== entryId
        )
        .map((item) => item.id);
    const targetIds = affectedEntries
        .filter(
            (item) => item.tierBandId === targetBandId && item.id !== entryId
        )
        .map((item) => item.id);
    const insertAt = Math.max(0, Math.min(targetIndex, targetIds.length));
    targetIds.splice(insertAt, 0, entryId);

    const operations: Prisma.PrismaPromise<unknown>[] = affectedEntries.map(
        (item, index) =>
            db.tierEntry.update({
                where: { id: item.id },
                data: { position: -(index + 1) },
            })
    );

    if (entry.tierBandId !== targetBandId) {
        operations.push(
            ...sourceIds.map((id, index) =>
                db.tierEntry.update({
                    where: { id },
                    data: {
                        tierBandId: entry.tierBandId,
                        position: index + 1,
                    },
                })
            )
        );
    }

    operations.push(
        ...targetIds.map((id, index) =>
            db.tierEntry.update({
                where: { id },
                data: { tierBandId: targetBandId, position: index + 1 },
            })
        )
    );

    if (entry.tierBandId !== targetBandId) {
        operations.push(
            db.tierPlacementHistory.create({
                data: {
                    tierListId: entry.tierListId,
                    chartId: entry.chartId,
                    bandValue: targetBand.value,
                },
            })
        );
    }

    await db.$transaction(operations);

    revalidateTierList(entry.tierListId);
}

export async function deleteTierEntry(formData: FormData) {
    await requireAdmin();
    const id = Number(formData.get("id"));
    if (!Number.isInteger(id)) return;

    const entry = await db.tierEntry.findUnique({ where: { id } });
    if (!entry) return;

    await db.$transaction(async (transaction) => {
        await transaction.tierEntry.delete({ where: { id } });
        await normalizeEntryPositions(transaction, entry.tierBandId);
        await transaction.tierPlacementHistory.create({
            data: {
                tierListId: entry.tierListId,
                chartId: entry.chartId,
                bandValue: null,
            },
        });
    });
    revalidateTierList(entry.tierListId);
}
