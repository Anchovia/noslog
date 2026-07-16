import db from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cacheTags";
import { unstable_cache } from "next/cache";

// 모든 탭에서 공통으로 사용하는 악곡과 채보 정보만 캐시함
export const getCachedMusicDetail = unstable_cache(
    async (index: string, difficulty: string) => {
        const [music, chart] = await Promise.all([
            db.music.findUnique({
                where: { index },
                select: {
                    index: true,
                    background: true,
                    title: true,
                    artist: true,
                    category_short: true,
                    charts: {
                        select: { difficulty: true, level: true },
                    },
                },
            }),
            db.musicChart.findUnique({
                where: {
                    music_idx_difficulty: {
                        music_idx: index,
                        difficulty,
                    },
                },
                select: {
                    id: true,
                    level: true,
                    level_constant: true,
                    bpm_min: true,
                    bpm_max: true,
                    note_count: true,
                    duration_seconds: true,
                    released_at: true,
                    unlock_condition: true,
                    play_video_url: true,
                    chart_preview_url: true,
                },
            }),
        ]);

        return {
            music,
            chart: chart
                ? {
                      ...chart,
                      released_at: chart.released_at?.toISOString() ?? null,
                  }
                : null,
        };
    },
    ["music-detail"],
    {
        revalidate: 3600,
        tags: [CACHE_TAGS.musicCatalog, CACHE_TAGS.musicDetails],
    }
);

// 상세 탭에서 사용하는 공개 투표 집계와 점수 분포를 캐시함
export const getCachedChartDetailStats = unstable_cache(
    async (chartId: number) => {
        const [evaluation, scores] = await Promise.all([
            db.chartEvaluation.aggregate({
                where: { chart_id: chartId },
                _count: { _all: true },
                _avg: {
                    perceived_constant: true,
                    stairs: true,
                    chord: true,
                    trill: true,
                    glissando: true,
                    repetition: true,
                },
            }),
            db.playData.findMany({
                where: { chart_id: chartId, score: { gt: 0 } },
                select: { score: true, fc_type: true },
            }),
        ]);

        return { evaluation, scores };
    },
    ["music-detail-stats"],
    {
        revalidate: 300,
        tags: [CACHE_TAGS.chartEvaluations, CACHE_TAGS.chartRankings],
    }
);

// 랭킹 탭의 공개 순위 데이터만 페이지 단위로 캐시함
export const getCachedChartRanking = unstable_cache(
    async (chartId: number, page: number, pageSize: number) => {
        const where = { chart_id: chartId, score: { gt: 0 } } as const;
        const [rows, totalCount] = await Promise.all([
            db.playData.findMany({
                where,
                select: {
                    rank: true,
                    score: true,
                    fc_type: true,
                    user_id: true,
                    user: {
                        select: { username: true, id: true, avatar: true },
                    },
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: [{ score: "desc" }, { user_id: "asc" }],
            }),
            db.playData.count({ where }),
        ]);

        return { rows, totalCount };
    },
    ["music-detail-ranking"],
    {
        revalidate: 300,
        tags: [CACHE_TAGS.chartRankings],
    }
);

// 서열 및 투표 탭의 공개 데이터는 사용자별 상태와 분리해 캐시함
export const getCachedChartTier = unstable_cache(
    async (chartId: number) => {
        const [evaluation, distribution, placement, opinions, opinionCount] =
            await Promise.all([
                db.chartEvaluation.aggregate({
                    where: { chart_id: chartId },
                    _count: { _all: true },
                    _avg: { perceived_constant: true },
                }),
                db.chartEvaluation.groupBy({
                    by: ["perceived_constant"],
                    where: { chart_id: chartId },
                    _count: { _all: true },
                    orderBy: { perceived_constant: "asc" },
                }),
                db.tierEntry.findFirst({
                    where: {
                        chartId,
                        tierList: { status: "published" },
                    },
                    select: {
                        updatedAt: true,
                        tierBand: { select: { value: true } },
                        tierList: {
                            select: {
                                history: {
                                    where: {
                                        chartId,
                                        bandValue: { not: null },
                                    },
                                    select: {
                                        id: true,
                                        bandValue: true,
                                        effectiveAt: true,
                                    },
                                    orderBy: { effectiveAt: "asc" },
                                },
                            },
                        },
                    },
                    orderBy: { tierList: { updatedAt: "desc" } },
                }),
                db.chartEvaluation.findMany({
                    where: { chart_id: chartId, comment: { not: null } },
                    select: {
                        id: true,
                        perceived_constant: true,
                        comment: true,
                        updated_at: true,
                        user: { select: { id: true, username: true } },
                        reactions: {
                            select: { user_id: true, value: true },
                        },
                    },
                    orderBy: { updated_at: "desc" },
                    take: 20,
                }),
                db.chartEvaluation.count({
                    where: { chart_id: chartId, comment: { not: null } },
                }),
            ]);

        return {
            evaluation,
            distribution,
            placement: placement
                ? {
                      updatedAt: placement.updatedAt.toISOString(),
                      currentConstant: placement.tierBand.value,
                      history: placement.tierList.history.map((item) => ({
                          id: item.id,
                          value: item.bandValue!,
                          effectiveAt: item.effectiveAt.toISOString(),
                      })),
                  }
                : null,
            opinions: opinions.map((opinion) => ({
                ...opinion,
                updated_at: opinion.updated_at.toISOString(),
            })),
            opinionCount,
        };
    },
    ["music-detail-tier"],
    {
        revalidate: 300,
        tags: [CACHE_TAGS.chartEvaluations, CACHE_TAGS.tierLists],
    }
);

export function getUserChartRecord(userId: number, chartId: number) {
    return db.playData.findFirst({
        where: { user_id: userId, chart_id: chartId, score: { gt: 0 } },
        select: {
            user_id: true,
            user: {
                select: { id: true, username: true, avatar: true },
            },
            rank: true,
            fc_type: true,
            grade_basic: true,
            grade_recital: true,
            level: true,
            score: true,
            max_combo: true,
            play_count: true,
            fullcombo_count: true,
            pianistic_count: true,
            besttime: true,
        },
    });
}

export async function getRecentUserChartPlays(userId: number, chartId: number) {
    const plays = await db.chartPlayHistory.findMany({
        where: { user_id: userId, chart_id: chartId },
        select: {
            id: true,
            score: true,
            rank: true,
            source_play_time: true,
        },
        orderBy: [{ source_play_time: "desc" }, { id: "desc" }],
        take: 4,
    });

    return plays.reverse().map((play) => ({
        id: play.id,
        score: play.score,
        rank: play.rank,
        play_time: play.source_play_time,
    }));
}
