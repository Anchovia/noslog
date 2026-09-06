import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import { getLocalizedMusicTitle } from "@/lib/i18n/musicTitle";
import type { Locale } from "@/lib/i18n/routing";
import {
    BASIC_RATING_TOP_COUNT,
    calculateBasicRatingTheoreticalMax,
} from "@/lib/tiers/basicRating";
import type {
    PublicTierBandPayload,
    TierDifficulty,
    TierGoal,
    TierMode,
} from "@/lib/tiers";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

function getTierChartWhere(
    difficulties: TierDifficulty[],
    levels: string[]
): Prisma.MusicChartWhereInput {
    const regularLevels = levels
        .filter((level) => /^\d+$/.test(level))
        .map(Number);
    const realLevels = levels
        .filter((level) => /^real-[1-3]$/.test(level))
        .map((level) => Number(level.slice(5)));
    const levelFilters: Prisma.MusicChartWhereInput[] = [];

    if (regularLevels.length > 0) {
        levelFilters.push({
            difficulty: { not: "Real" },
            level: { in: regularLevels },
        });
    }
    if (realLevels.length > 0) {
        levelFilters.push({ difficulty: "Real", level: { in: realLevels } });
    }

    return {
        ...(difficulties.length > 0
            ? { difficulty: { in: difficulties } }
            : {}),
        ...(levels.length > 0 ? { OR: levelFilters } : {}),
    };
}

// 현재 선택한 모드·목표·필터에 해당하는 공개 구간 요약만 캐시함
export const getCachedGoalTierOverview = unstable_cache(
    async (
        mode: TierMode,
        goal: TierGoal,
        difficulties: TierDifficulty[],
        levels: string[]
    ) => {
        const chartWhere = getTierChartWhere(difficulties, levels);
        const tierList = await db.tierList.findFirst({
            where: { mode, goal, status: "published" },
            select: {
                id: true,
                slug: true,
                title: true,
                mode: true,
                goal: true,
                description: true,
                updatedAt: true,
                bands: {
                    orderBy: { position: "asc" },
                    select: {
                        id: true,
                        value: true,
                        position: true,
                        _count: {
                            select: {
                                entries: { where: { chart: chartWhere } },
                            },
                        },
                    },
                },
            },
        });

        if (!tierList) return null;

        return {
            ...tierList,
            goal,
            bands: tierList.bands
                .map((band) => ({
                    id: band.id,
                    value: band.value,
                    position: band.position,
                    totalCount: band._count.entries,
                }))
                .filter((band) => band.totalCount > 0),
            updatedAt: tierList.updatedAt.toISOString(),
        };
    },
    ["public-goal-tier-overview", "v1"],
    {
        revalidate: 3600,
        tags: [CACHE_TAGS.tierLists],
    }
);

// 현재 공개 서열표를 기준으로 10,000점 정규화에 사용할 상위 70곡 이론값을 계산함
export const getCachedBasicTierWeightTheoreticalMax = unstable_cache(
    async (tierListId: number) => {
        const tierList = await db.tierList.findUnique({
            where: { id: tierListId },
            select: {
                mode: true,
                goal: true,
                status: true,
                entries: {
                    select: {
                        tierBand: { select: { value: true } },
                    },
                },
            },
        });

        if (
            !tierList ||
            tierList.mode !== "basic" ||
            tierList.status !== "published" ||
            tierList.entries.length < BASIC_RATING_TOP_COUNT
        ) {
            return null;
        }

        const theoreticalMax = calculateBasicRatingTheoreticalMax(
            tierList.entries.map((entry) => entry.tierBand.value)
        );

        return theoreticalMax > 0 ? theoreticalMax : null;
    },
    ["basic-tier-weight-theoretical-max", "v2"],
    {
        revalidate: 3600,
        tags: [CACHE_TAGS.tierLists],
    }
);

// 구간별 정적 채보 데이터는 필터 조합별로 공유 캐시함
export const getCachedTierBand = unstable_cache(
    async (
        slug: string,
        bandId: number,
        difficulties: TierDifficulty[] = [],
        levels: string[] = []
    ) => {
        const chartWhere = getTierChartWhere(difficulties, levels);

        return db.tierBand.findFirst({
            where: {
                id: bandId,
                tierList: { slug, status: "published", goal: { not: null } },
            },
            select: {
                id: true,
                value: true,
                position: true,
                entries: {
                    where: { chart: chartWhere },
                    orderBy: { position: "asc" },
                    select: {
                        id: true,
                        chartId: true,
                        position: true,
                        chart: {
                            select: {
                                difficulty: true,
                                level: true,
                                music: {
                                    select: {
                                        index: true,
                                        title: true,
                                        title_kana: true,
                                        background: true,
                                        translations: {
                                            where: {
                                                status: "approved",
                                                locale: { in: ["ko", "en"] },
                                            },
                                            select: {
                                                locale: true,
                                                title: true,
                                                status: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    },
    ["public-tier-band", "goal-v3"],
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

// 관리자나 보조 화면에서 사용할 수 있도록 기존 진행도 집계를 유지함
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

export function getUserTierRecords(userId: number, chartIds: number[]) {
    if (chartIds.length === 0) return Promise.resolve([]);

    return db.playData.findMany({
        where: { user_id: userId, chart_id: { in: chartIds } },
        select: {
            chart_id: true,
            score: true,
            rank: true,
            fc_type: true,
            max_combo: true,
            play_count: true,
            clear_count: true,
            fullcombo_count: true,
            pianistic_count: true,
            judge_sjust: true,
            judge_just: true,
            judge_good: true,
            judge_miss: true,
            judge_near: true,
            note_rate_standard: true,
            note_rate_tenuto: true,
            note_rate_glissando: true,
            note_rate_trill: true,
            besttime: true,
        },
    });
}

interface LatestTierPlayRow {
    chart_id: number;
    fast_count: number | null;
    slow_count: number | null;
    source_play_time: string;
}

export function getLatestUserTierPlays(userId: number, chartIds: number[]) {
    if (chartIds.length === 0) return Promise.resolve([]);

    return db.$queryRaw<LatestTierPlayRow[]>(Prisma.sql`
        SELECT DISTINCT ON ("chart_id")
            "chart_id",
            "fast_count",
            "slow_count",
            "source_play_time"
        FROM "ChartPlayHistory"
        WHERE "user_id" = ${userId}
          AND "chart_id" IN (${Prisma.join(chartIds)})
        ORDER BY "chart_id", "source_play_time" DESC, "id" DESC
    `);
}

export async function getTierBandForUser(
    slug: string,
    bandId: number,
    userId?: number,
    difficulties: TierDifficulty[] = [],
    levels: string[] = [],
    locale: Locale = "ko",
    showLocalizedTitle = true
): Promise<PublicTierBandPayload | null> {
    const band = await getCachedTierBand(slug, bandId, difficulties, levels);
    if (!band) return null;

    const chartIds = band.entries.map((entry) => entry.chartId);
    const [records, latestPlays] = userId
        ? await Promise.all([
              getUserTierRecords(userId, chartIds),
              getLatestUserTierPlays(userId, chartIds),
          ])
        : [[], []];
    const recordByChartId = new Map(
        records.flatMap((record) =>
            record.chart_id === null ? [] : [[record.chart_id, record] as const]
        )
    );
    const latestPlayByChartId = new Map(
        latestPlays.map((play) => [play.chart_id, play] as const)
    );

    return {
        ...band,
        entries: band.entries.map((entry) => ({
            ...entry,
            chart: {
                ...entry.chart,
                music: {
                    index: entry.chart.music.index,
                    title: entry.chart.music.title,
                    localizedTitle: getLocalizedMusicTitle(
                        entry.chart.music,
                        locale,
                        showLocalizedTitle
                    ),
                    background: entry.chart.music.background,
                },
            },
            record: recordByChartId.has(entry.chartId)
                ? {
                      ...recordByChartId.get(entry.chartId)!,
                      latestPlay:
                          latestPlayByChartId.get(entry.chartId) ?? null,
                  }
                : null,
        })),
    };
}
