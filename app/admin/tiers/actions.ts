"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin";
import db from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma";

const tierModes = new Set(["basic", "recital"]);
const tierStatuses = new Set(["draft", "published", "archived"]);

export async function searchTierCharts(query: string, tierListId: number) {
    await requireAdmin();
    const keyword = query.trim();
    if (!keyword || !Number.isInteger(tierListId)) return [];

    const charts = await db.musicChart.findMany({
        where: {
            tierEntries: { none: { tierListId } },
            music: {
                OR: [
                    { title: { contains: keyword } },
                    { artist: { contains: keyword } },
                    { index: { contains: keyword } },
                ],
            },
        },
        select: {
            id: true,
            difficulty: true,
            level: true,
            music: {
                select: {
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
        title: chart.music.title,
        artist: chart.music.artist,
        jacket: chart.music.background,
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
        value > 14
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
        value > 14
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

export async function moveTierEntry(formData: FormData) {
    await requireAdmin();
    const id = Number(formData.get("id"));
    const targetBandId = Number(formData.get("tierBandId"));
    if (!Number.isInteger(id) || !Number.isInteger(targetBandId)) return;

    const entry = await db.tierEntry.findUnique({ where: { id } });
    if (!entry || entry.tierBandId === targetBandId) return;
    const targetBand = await db.tierBand.findFirst({
        where: { id: targetBandId, tierListId: entry.tierListId },
        select: { value: true },
    });
    if (!targetBand) return;

    await db.$transaction(async (transaction) => {
        const lastEntry = await transaction.tierEntry.findFirst({
            where: { tierBandId: targetBandId },
            select: { position: true },
            orderBy: { position: "desc" },
        });
        await transaction.tierEntry.update({
            where: { id },
            data: {
                tierBandId: targetBandId,
                position: (lastEntry?.position ?? 0) + 1,
            },
        });
        await normalizeEntryPositions(transaction, entry.tierBandId);
        await transaction.tierPlacementHistory.create({
            data: {
                tierListId: entry.tierListId,
                chartId: entry.chartId,
                bandValue: targetBand.value,
            },
        });
    });
    revalidateTierList(entry.tierListId);
}

export async function moveTierEntryOrder(formData: FormData) {
    await requireAdmin();
    const id = Number(formData.get("id"));
    const direction = String(formData.get("direction"));
    if (!Number.isInteger(id) || !["up", "down"].includes(direction)) return;

    const entry = await db.tierEntry.findUnique({ where: { id } });
    if (!entry) return;
    const neighbor = await db.tierEntry.findFirst({
        where: {
            tierBandId: entry.tierBandId,
            position:
                direction === "up"
                    ? { lt: entry.position }
                    : { gt: entry.position },
        },
        orderBy: { position: direction === "up" ? "desc" : "asc" },
    });
    if (!neighbor) return;

    await db.$transaction([
        db.tierEntry.update({
            where: { id: entry.id },
            data: { position: -1 },
        }),
        db.tierEntry.update({
            where: { id: neighbor.id },
            data: { position: entry.position },
        }),
        db.tierEntry.update({
            where: { id: entry.id },
            data: { position: neighbor.position },
        }),
    ]);
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
