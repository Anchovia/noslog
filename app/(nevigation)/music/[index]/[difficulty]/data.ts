import db from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cacheTags";
import {
    buildPeerScoreComparison,
    PEER_STORED_GRADE_RANGE,
} from "@/lib/music/peerScoreComparison";
import { selectScoreImprovements } from "@/lib/music/scoreTrend";
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
                    title_kana: true,
                    artist: true,
                    category_short: true,
                    translations: {
                        where: { status: "approved" },
                        select: {
                            locale: true,
                            title: true,
                            status: true,
                        },
                    },
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
                    pattern: {
                        select: {
                            publishedRevision: true,
                        },
                    },
                },
            }),
        ]);

        return {
            music,
            chart: chart
                ? {
                      ...chart,
                      has_published_pattern:
                          chart.pattern?.publishedRevision !== null &&
                          chart.pattern?.publishedRevision !== undefined,
                      pattern: undefined,
                      released_at: chart.released_at?.toISOString() ?? null,
                  }
                : null,
        };
    },
    ["music-detail-v2"],
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
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                    grade_basic: true,
                },
            },
            rank: true,
            fc_type: true,
            grade_basic: true,
            grade_recital: true,
            level: true,
            score: true,
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

export async function getUserChartPeerScoreComparison(
    userId: number,
    chartId: number,
    gradeBasic: number | null
) {
    if (gradeBasic === null) return null;

    const records = await db.playData.findMany({
        where: {
            chart_id: chartId,
            user_id: { not: userId },
            play_count: { gt: 0 },
            score: { gt: 0 },
            user: {
                grade_basic: {
                    gte: Math.max(0, gradeBasic - PEER_STORED_GRADE_RANGE),
                    lte: gradeBasic + PEER_STORED_GRADE_RANGE,
                },
            },
        },
        select: {
            score: true,
            judge_sjust: true,
            judge_just: true,
            judge_good: true,
            judge_miss: true,
            judge_near: true,
            note_rate_standard: true,
            note_rate_tenuto: true,
            note_rate_glissando: true,
            note_rate_trill: true,
        },
    });

    return buildPeerScoreComparison(records);
}

export async function getRecentUserChartPlays(userId: number, chartId: number) {
    const plays = await db.chartPlayHistory.findMany({
        where: { user_id: userId, chart_id: chartId },
        select: {
            id: true,
            score: true,
            best_score: true,
            max_combo: true,
            rank: true,
            grade_basic: true,
            class_basic: true,
            fast_count: true,
            slow_count: true,
            judge_sjust: true,
            judge_just: true,
            judge_good: true,
            judge_miss: true,
            judge_near: true,
            source_play_time: true,
        },
        orderBy: [{ source_play_time: "desc" }, { id: "desc" }],
        take: 4,
    });

    return plays.reverse().map((play) => ({
        id: play.id,
        score: play.score,
        best_score: play.best_score,
        max_combo: play.max_combo,
        rank: play.rank,
        grade_basic: play.grade_basic,
        class_basic: play.class_basic,
        fast_count: play.fast_count,
        slow_count: play.slow_count,
        judge_sjust: play.judge_sjust,
        judge_just: play.judge_just,
        judge_good: play.judge_good,
        judge_miss: play.judge_miss,
        judge_near: play.judge_near,
        play_time: play.source_play_time,
    }));
}

export async function getUserChartPerformanceTrend(
    userId: number,
    chartId: number
) {
    const plays = await db.chartPlayHistory.findMany({
        where: { user_id: userId, chart_id: chartId },
        select: {
            id: true,
            score: true,
            best_score: true,
            fast_count: true,
            slow_count: true,
            judge_sjust: true,
            judge_just: true,
            judge_good: true,
            judge_miss: true,
            judge_near: true,
            source_play_time: true,
        },
        orderBy: [{ source_play_time: "desc" }, { id: "desc" }],
        take: 30,
    });

    return plays.reverse().map((play) => ({
        id: play.id,
        score: play.score,
        best_score: play.best_score,
        fast_count: play.fast_count,
        slow_count: play.slow_count,
        judge_sjust: play.judge_sjust,
        judge_just: play.judge_just,
        judge_good: play.judge_good,
        judge_miss: play.judge_miss,
        judge_near: play.judge_near,
        play_time: play.source_play_time,
    }));
}

export async function getUserChartScoreTrend(
    userId: number,
    chartId: number,
    currentRecord: { score: number; rank: string; besttime: string } | null
) {
    const snapshots = await db.chartRecordSnapshot.findMany({
        where: { user_id: userId, chart_id: chartId, score: { gt: 0 } },
        select: {
            id: true,
            score: true,
            rank: true,
            created_at: true,
        },
        orderBy: [{ created_at: "asc" }, { id: "asc" }],
    });

    const records = snapshots.map((snapshot) => ({
        id: snapshot.id,
        score: snapshot.score,
        rank: snapshot.rank,
        play_time: snapshot.created_at.toISOString(),
    }));

    const improvements = selectScoreImprovements(records);

    // 현재 최고점은 동기화 시각 대신 BEMANI의 실제 달성 시각으로 표시함
    if (currentRecord?.score) {
        const currentBestIndex = improvements.findIndex(
            (record) => record.score === currentRecord.score
        );
        const currentBest = {
            id: -1,
            score: currentRecord.score,
            rank: currentRecord.rank,
            play_time: currentRecord.besttime,
        };

        if (currentBestIndex >= 0) {
            improvements[currentBestIndex] = currentBest;
        } else {
            improvements.push(currentBest);
        }
    }

    return improvements;
}
