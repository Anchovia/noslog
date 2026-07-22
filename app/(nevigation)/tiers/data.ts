import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import type { PublicTierBandPayload } from "@/lib/tiers";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

export type PublicTierMode = "all" | "basic" | "recital";

// 공개 서열표 목록을 모드별로 캐시함
export const getCachedTierLists = unstable_cache(
    async (mode: PublicTierMode) => {
        const tierLists = await db.tierList.findMany({
            where: {
                status: "published",
                ...(mode === "all" ? {} : { mode }),
            },
            select: {
                id: true,
                slug: true,
                title: true,
                mode: true,
                updatedAt: true,
                _count: { select: { entries: true } },
            },
            orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        });

        return tierLists.map((tierList) => ({
            id: tierList.id,
            slug: tierList.slug,
            title: tierList.title,
            mode: tierList.mode,
            totalCount: tierList._count.entries,
            updatedAt: tierList.updatedAt.toISOString(),
        }));
    },
    ["public-tier-lists", "official-v1"],
    {
        revalidate: 3600,
        tags: [CACHE_TAGS.tierLists],
    }
);

// 상세 첫 응답에는 구간 요약만 포함하고 실제 채보는 구간별로 불러옴
export const getCachedTierOverview = unstable_cache(
    async (slug: string) => {
        const tierList = await db.tierList.findFirst({
            where: { slug, status: "published" },
            select: {
                id: true,
                slug: true,
                title: true,
                mode: true,
                updatedAt: true,
                bands: {
                    orderBy: { position: "asc" },
                    select: {
                        id: true,
                        value: true,
                        position: true,
                        _count: { select: { entries: true } },
                    },
                },
            },
        });

        return tierList
            ? {
                  id: tierList.id,
                  slug: tierList.slug,
                  title: tierList.title,
                  mode: tierList.mode,
                  bands: tierList.bands.map((band) => ({
                      id: band.id,
                      value: band.value,
                      position: band.position,
                      totalCount: band._count.entries,
                  })),
                  updatedAt: tierList.updatedAt.toISOString(),
              }
            : null;
    },
    ["public-tier-overview", "official-v2"],
    {
        revalidate: 3600,
        tags: [CACHE_TAGS.tierLists],
    }
);

// 구간별 정적 채보 데이터는 공유 캐시하고 사용자 기록만 요청마다 결합함
export const getCachedTierBand = unstable_cache(
    async (slug: string, bandId: number) =>
        db.tierBand.findFirst({
            where: {
                id: bandId,
                tierList: { slug, status: "published" },
            },
            select: {
                id: true,
                value: true,
                position: true,
                entries: {
                    orderBy: { position: "asc" },
                    select: {
                        id: true,
                        chartId: true,
                        position: true,
                        chart: {
                            select: {
                                difficulty: true,
                                music: {
                                    select: {
                                        index: true,
                                        title: true,
                                        background: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }),
    ["public-tier-band", "official-v2"],
    {
        revalidate: 3600,
        tags: [CACHE_TAGS.tierLists],
    }
);

interface TierProgressRow {
    tier_list_id: number;
    pianist_count: bigint;
    fc_count: bigint;
    s_count: bigint;
    cleared_count: bigint;
}

// 목록 진행도는 모든 채보 ID를 앱으로 가져오지 않고 DB에서 바로 집계함
export async function getUserTierListProgress(
    userId: number,
    tierListIds: number[]
) {
    if (tierListIds.length === 0) return [];

    const rows = await db.$queryRaw<TierProgressRow[]>(Prisma.sql`
        SELECT
            te."tier_list_id",
            COUNT(*) FILTER (
                WHERE pd."score" > 0
                  AND (pd."fc_type" = 3 OR pd."score" >= 1000000)
            ) AS "pianist_count",
            COUNT(*) FILTER (
                WHERE pd."score" > 0
                  AND pd."fc_type" >= 2
                  AND pd."fc_type" <> 3
                  AND pd."score" < 1000000
            ) AS "fc_count",
            COUNT(*) FILTER (
                WHERE pd."score" >= 950000
                  AND pd."score" < 1000000
                  AND pd."fc_type" < 2
            ) AS "s_count",
            COUNT(*) FILTER (WHERE pd."score" > 0) AS "cleared_count"
        FROM "TierEntry" te
        LEFT JOIN "PlayData" pd
          ON pd."chart_id" = te."chart_id"
         AND pd."user_id" = ${userId}
        WHERE te."tier_list_id" IN (${Prisma.join(tierListIds)})
        GROUP BY te."tier_list_id"
    `);

    return rows.map((row) => ({
        tierListId: row.tier_list_id,
        pianistCount: Number(row.pianist_count),
        fcCount: Number(row.fc_count),
        sCount: Number(row.s_count),
        clearedCount: Number(row.cleared_count),
    }));
}

// 플레이 기록은 로그인 사용자마다 다르므로 공유 캐시를 사용하지 않음
export function getUserTierRecords(userId: number, chartIds: number[]) {
    if (chartIds.length === 0) return Promise.resolve([]);

    return db.playData.findMany({
        where: { user_id: userId, chart_id: { in: chartIds } },
        select: {
            chart_id: true,
            score: true,
            rank: true,
            fc_type: true,
        },
    });
}

export async function getTierBandForUser(
    slug: string,
    bandId: number,
    userId?: number
): Promise<PublicTierBandPayload | null> {
    const band = await getCachedTierBand(slug, bandId);
    if (!band) return null;

    const records = userId
        ? await getUserTierRecords(
              userId,
              band.entries.map((entry) => entry.chartId)
          )
        : [];
    const recordByChartId = new Map(
        records.flatMap((record) =>
            record.chart_id === null ? [] : [[record.chart_id, record] as const]
        )
    );

    return {
        ...band,
        entries: band.entries.map((entry) => ({
            ...entry,
            record: recordByChartId.get(entry.chartId) ?? null,
        })),
    };
}
