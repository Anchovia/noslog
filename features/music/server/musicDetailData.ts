import "server-only";

import db from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cacheTags";
import { PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cachePolicy";
import {
    buildPeerScoreComparison,
    PEER_STORED_GRADE_RANGE,
} from "@/lib/music/peerScoreComparison";
import { selectScoreImprovements } from "@/lib/music/scoreTrend";
import { recentPlayTimestamp } from "@/lib/services/user/recentRecordMerge";
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
                        select: {
                            difficulty: true,
                            level: true,
                            level_constant: true,
                        },
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
// 점수 분포(점수 자 위 점)도 점수 비공개 플레이어를 뺀다 — 비공개인 본인이 볼 때만 자기 점수를 넣는다
export const getCachedChartDetailStats = unstable_cache(
    async (chartId: number, includeUserId = 0) => {
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
                where: {
                    chart_id: chartId,
                    score: { gt: 0 },
                    user: {
                        OR: [
                            { hide_play_scores: false },
                            { id: includeUserId },
                        ],
                    },
                },
                select: { score: true, fc_type: true },
            }),
        ]);

        return { evaluation, scores };
    },
    ["music-detail-stats"],
    {
        revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
        tags: [CACHE_TAGS.chartEvaluations, CACHE_TAGS.chartRankings],
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
                    hide_play_scores: true,
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
    /** undefined = 이 곡 기록이 없어 모름 — 유저 Grd 를 따로 읽는다 */
    gradeBasic: number | null | undefined
) {
    if (gradeBasic === undefined)
        gradeBasic =
            (
                await db.user.findUnique({
                    where: { id: userId },
                    select: { grade_basic: true },
                })
            )?.grade_basic ?? null;
    if (gradeBasic === null) return null;

    const records = await db.playData.findMany({
        where: {
            chart_id: chartId,
            user_id: { not: userId },
            play_count: { gt: 0 },
            score: { gt: 0 },
            // 점수 비공개 플레이어는 비교 평균에도 넣지 않는다(비교 대상 1명이면 그 사람 점수가 그대로 보인다)
            user: {
                hide_play_scores: false,
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
    const [snapshots, history] = await Promise.all([
        db.chartRecordSnapshot.findMany({
            where: { user_id: userId, chart_id: chartId, score: { gt: 0 } },
            select: {
                id: true,
                score: true,
                rank: true,
                besttime: true,
                created_at: true,
            },
            orderBy: [{ created_at: "asc" }, { id: "asc" }],
        }),
        db.chartPlayHistory.findMany({
            where: { user_id: userId, chart_id: chartId, score: { gt: 0 } },
            select: {
                id: true,
                score: true,
                rank: true,
                source_play_time: true,
            },
        }),
    ]);
    const records = [
        ...snapshots.map((snapshot) => ({
            id: snapshot.id,
            score: snapshot.score,
            rank: snapshot.rank,
            play_time:
                recentPlayTimestamp(snapshot.besttime) !== null
                    ? snapshot.besttime
                    : snapshot.created_at.toISOString(),
        })),
        ...history.map((play) => ({
            // Distinct IDs across the two tables and the current best record.
            id: -play.id - 1,
            score: play.score,
            rank: play.rank,
            play_time: play.source_play_time,
        })),
        ...(currentRecord?.score
            ? [
                  {
                      id: -1,
                      score: currentRecord.score,
                      rank: currentRecord.rank,
                      play_time: currentRecord.besttime,
                  },
              ]
            : []),
    ];
    const timestamp = (value: string) =>
        recentPlayTimestamp(value) ??
        (/Z$|[+-]\d{2}:\d{2}$/.test(value) ? Date.parse(value) : NaN);
    // Include intermediate improvements from the same recent-30 import, not
    // just its final snapshot. Never give an invalid date to the chart renderer.
    const ordered = records
        .filter((record) => Number.isFinite(timestamp(record.play_time)))
        .sort(
            (a, b) =>
                timestamp(a.play_time) - timestamp(b.play_time) ||
                a.score - b.score
        );
    return selectScoreImprovements(ordered);
}

// 해금 조건 이벤트 이름 번역(원문 일본어 → 언어별) — 90개 남짓이라 언어마다 통째로 캐시 (2026-09-18)
export const getCachedUnlockTranslations = unstable_cache(
    async (locale: string) => {
        const rows = await db.unlockConditionTranslation.findMany({
            where: { locale },
            select: { sourceText: true, text: true },
        });
        return Object.fromEntries(
            rows.map((row) => [row.sourceText, row.text])
        );
    },
    ["unlock-condition-translations-v1"],
    {
        revalidate: 3600,
        tags: [CACHE_TAGS.musicCatalog, CACHE_TAGS.musicDetails],
    }
);
