import "server-only";

import type { Prisma } from "@prisma/client";

import { requireAdmin } from "@/lib/admin";
import db from "@/lib/db";

/** 관리자 서열표 목록 — 구간 · 채보 수(2026-10-16 D8 — 화면에서 옮김) */
export async function listAdminTierLists() {
    await requireAdmin();
    return db.tierList.findMany({
        include: {
            _count: { select: { bands: true, entries: true } },
        },
        orderBy: [{ mode: "asc" }, { goal: "asc" }, { updatedAt: "desc" }],
    });
}

/** 편집할 서열표 — 구간과 구간별 채보 수 */
export async function getAdminTierList(tierListId: number) {
    await requireAdmin();
    return db.tierList.findUnique({
        where: { id: tierListId },
        include: {
            bands: {
                orderBy: { position: "asc" },
                include: { _count: { select: { entries: true } } },
            },
        },
    });
}

/** 서열표 편집 화면의 채보 한 쪽(곡 이름 · 난이도 순) */
export async function listAdminTierEntries(
    tierListId: number,
    chartWhere: Prisma.MusicChartWhereInput,
    page: number,
    pageSize: number
) {
    await requireAdmin();
    return db.tierEntry.findMany({
        where: { tierListId, chart: chartWhere },
        select: {
            id: true,
            tierBandId: true,
            chart: {
                select: {
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
            },
        },
        orderBy: [
            { chart: { music: { title: "asc" } } },
            { chart: { difficulty: "asc" } },
        ],
        skip: (page - 1) * pageSize,
        take: pageSize,
    });
}

/** 서열표 편집 화면 필터에 맞는 채보 수 */
export async function countAdminTierEntries(
    tierListId: number,
    chartWhere: Prisma.MusicChartWhereInput
) {
    await requireAdmin();
    return db.tierEntry.count({
        where: { tierListId, chart: chartWhere },
    });
}

/** 보관 서열표(목표 없는 옛 표) — 구간 · 채보 전부 */
export async function getLegacyTierListWithEntries(tierListId: number) {
    await requireAdmin();
    return db.tierList.findUnique({
        where: { id: tierListId },
        include: {
            bands: {
                include: {
                    entries: {
                        include: {
                            chart: {
                                include: {
                                    music: {
                                        select: {
                                            index: true,
                                            title: true,
                                            artist: true,
                                            background: true,
                                        },
                                    },
                                },
                            },
                        },
                        orderBy: { position: "asc" },
                    },
                },
                orderBy: { position: "asc" },
            },
        },
    });
}
