import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";

import { PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cache-policy";
import { CACHE_TAGS, getChartRankingTag } from "@/lib/cache-tags";
import db from "@/lib/db";
import {
    buildPeerScoreComparison,
    PEER_STORED_GRADE_RANGE,
} from "@/lib/music/peer-score-comparison";
import { selectScoreImprovements } from "@/lib/music/score-trend";
import {
    formatKstPlayTime,
    legacyBesttime,
    STATS_GRADE_SELECT,
    withStatsGrades,
} from "@/lib/player-stats";
import { recentPlayTimestamp } from "@/lib/services/user/recent-record-merge";
import { parseChartDifficulty } from "@/lib/tiers";

// 모든 탭에서 공통으로 사용하는 악곡과 채보 정보만 캐시함
export const getCachedMusicDetail = unstable_cache(
    async (index: string, difficulty: string) => {
        // 난이도는 enum — 모르는 난이도면 채보 없음(2026-10-16 D4-C 2차)
        const chartDifficulty = parseChartDifficulty(difficulty);
        const [music, chart] = await Promise.all([
            db.music.findUnique({
                where: { index },
                select: {
                    index: true,
                    background: true,
                    title: true,
                    titleKana: true,
                    artist: true,
                    categoryShort: true,
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
                            levelConstant: true,
                        },
                    },
                },
            }),
            chartDifficulty === undefined
                ? null
                : db.musicChart.findUnique({
                      where: {
                          musicIdx_difficulty: {
                              musicIdx: index,
                              difficulty: chartDifficulty,
                          },
                      },
                      select: {
                          id: true,
                          level: true,
                          levelConstant: true,
                          bpmMin: true,
                          bpmMax: true,
                          noteCount: true,
                          durationSeconds: true,
                          releasedAt: true,
                          unlockCondition: true,
                          playVideoUrl: true,
                          chartPreviewUrl: true,
                          pattern: {
                              select: {
                                  publishedRevision: true,
                              },
                          },
                          // 출처가 있는 칸(2026-10-01 E2) — 출처가 없는 값은 「확인 전」 으로 흐리게 보여 준다
                          fieldSources: { select: { field: true } },
                      },
                  }),
        ]);

        return {
            music,
            // 응답의 채보 모양은 예전 이름 그대로(2026-10-16 D1-B — Prisma 이름만 camelCase)
            chart: chart
                ? {
                      id: chart.id,
                      level: chart.level,
                      level_constant: chart.levelConstant,
                      bpm_min: chart.bpmMin,
                      bpm_max: chart.bpmMax,
                      note_count: chart.noteCount,
                      duration_seconds: chart.durationSeconds,
                      unlock_condition: chart.unlockCondition,
                      play_video_url: chart.playVideoUrl,
                      chart_preview_url: chart.chartPreviewUrl,
                      has_published_pattern:
                          chart.pattern?.publishedRevision !== null &&
                          chart.pattern?.publishedRevision !== undefined,
                      sourced_fields: [
                          ...new Set(
                              chart.fieldSources.map((row) => row.field)
                          ),
                      ],
                      released_at: chart.releasedAt?.toISOString() ?? null,
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

// 상세 탭에서 사용하는 점수 분포를 캐시함
// 점수 분포(점수 자 위 점)도 점수 비공개 플레이어를 뺀다 — 비공개인 본인이 볼 때만 자기 점수를 넣는다
const queryChartDetailStats = async (chartId: number, includeUserId = 0) => {
    const scores = await db.playData.findMany({
        where: {
            chartId: chartId,
            score: { gt: 0 },
            user: {
                OR: [{ hidePlayScores: false }, { id: includeUserId }],
            },
        },
        select: { score: true, fcType: true },
    });

    return { scores };
};

// 채보별 태그로 동기화가 바뀐 채보만 비운다(chart-ranking.ts 와 같은 방식)
export function getCachedChartDetailStats(chartId: number, includeUserId = 0) {
    return unstable_cache(queryChartDetailStats, ["music-detail-stats-v3"], {
        revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
        tags: [CACHE_TAGS.chartRankings, getChartRankingTag(chartId)],
    })(chartId, includeUserId);
}

export async function getUserChartRecord(userId: number, chartId: number) {
    const record = await db.playData.findFirst({
        where: { userId: userId, chartId: chartId, score: { gt: 0 } },
        select: {
            userId: true,
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                    // 사람 Grd 는 player_stats 에서(2026-10-16 DB 재설계 P4) — 화면에는 예전 이름으로
                    stats: { select: STATS_GRADE_SELECT },
                    hidePlayScores: true,
                },
            },
            rank: true,
            fcType: true,
            gradeBasic: true,
            gradeRecital: true,
            level: true,
            score: true,
            maxCombo: true,
            playCount: true,
            clearCount: true,
            fullcomboCount: true,
            pianisticCount: true,
            judgeSjust: true,
            judgeJust: true,
            judgeGood: true,
            judgeMiss: true,
            judgeNear: true,
            noteRateStandard: true,
            noteRateTenuto: true,
            noteRateGlissando: true,
            noteRateTrill: true,
            bestAt: true,
        },
    });
    if (!record) return record;
    // 응답 모양은 예전 이름 그대로(2026-10-16 D1-B) · besttime 글자는 best_at 에서(P5-1)
    const { stats, hidePlayScores, ...user } = record.user;
    return {
        user_id: record.userId,
        user: {
            ...user,
            hide_play_scores: hidePlayScores,
            ...withStatsGrades({ stats }),
        },
        rank: record.rank,
        fc_type: record.fcType,
        grade_basic: record.gradeBasic,
        grade_recital: record.gradeRecital,
        level: record.level,
        score: record.score,
        max_combo: record.maxCombo,
        play_count: record.playCount,
        clear_count: record.clearCount,
        fullcombo_count: record.fullcomboCount,
        pianistic_count: record.pianisticCount,
        judge_sjust: record.judgeSjust,
        judge_just: record.judgeJust,
        judge_good: record.judgeGood,
        judge_miss: record.judgeMiss,
        judge_near: record.judgeNear,
        note_rate_standard: record.noteRateStandard,
        note_rate_tenuto: record.noteRateTenuto,
        note_rate_glissando: record.noteRateGlissando,
        note_rate_trill: record.noteRateTrill,
        besttime: legacyBesttime(record.bestAt),
    };
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
                await db.playerStats.findUnique({
                    where: { userId },
                    select: { gradeBasic: true },
                })
            )?.gradeBasic ?? null;
    if (gradeBasic === null) return null;

    const records = await db.playData.findMany({
        where: {
            chartId: chartId,
            userId: { not: userId },
            playCount: { gt: 0 },
            score: { gt: 0 },
            // 점수 비공개 플레이어는 비교 평균에도 넣지 않는다(비교 대상 1명이면 그 사람 점수가 그대로 보인다)
            user: {
                hidePlayScores: false,
                stats: {
                    gradeBasic: {
                        gte: Math.max(0, gradeBasic - PEER_STORED_GRADE_RANGE),
                        lte: gradeBasic + PEER_STORED_GRADE_RANGE,
                    },
                },
            },
        },
        select: {
            score: true,
            judgeSjust: true,
            judgeJust: true,
            judgeGood: true,
            judgeMiss: true,
            judgeNear: true,
            noteRateStandard: true,
            noteRateTenuto: true,
            noteRateGlissando: true,
            noteRateTrill: true,
        },
    });

    // 비교 결과는 응답 이름(judge_sjust 등) 그대로 — Prisma 이름을 옮겨 넣는다(2026-10-16 D1-B)
    return buildPeerScoreComparison(
        records.map((record) => ({
            score: record.score,
            judge_sjust: record.judgeSjust,
            judge_just: record.judgeJust,
            judge_good: record.judgeGood,
            judge_miss: record.judgeMiss,
            judge_near: record.judgeNear,
            note_rate_standard: record.noteRateStandard,
            note_rate_tenuto: record.noteRateTenuto,
            note_rate_glissando: record.noteRateGlissando,
            note_rate_trill: record.noteRateTrill,
        }))
    );
}

// 기록 탭의 최근 4판 · 판정 추이 30판 · 점수 추이가 같은 최근 플레이를 쓴다 — 한 요청에서 한 번만 읽는다(2026-10-16 D8 · Q4)
const loadChartPlayHistory = cache(async (userId: number, chartId: number) =>
    db.chartPlayHistory.findMany({
        where: { userId, chartId },
        select: {
            id: true,
            score: true,
            bestScore: true,
            maxCombo: true,
            rank: true,
            gradeBasic: true,
            classBasic: true,
            fastCount: true,
            slowCount: true,
            judgeSjust: true,
            judgeJust: true,
            judgeGood: true,
            judgeMiss: true,
            judgeNear: true,
            playedAt: true,
        },
        orderBy: [{ playedAt: "desc" }, { id: "desc" }],
    })
);

export async function getRecentUserChartPlays(userId: number, chartId: number) {
    const plays = (await loadChartPlayHistory(userId, chartId)).slice(0, 4);

    return plays.reverse().map((play) => ({
        id: play.id,
        score: play.score,
        best_score: play.bestScore,
        max_combo: play.maxCombo,
        rank: play.rank,
        grade_basic: play.gradeBasic,
        class_basic: play.classBasic,
        fast_count: play.fastCount,
        slow_count: play.slowCount,
        judge_sjust: play.judgeSjust,
        judge_just: play.judgeJust,
        judge_good: play.judgeGood,
        judge_miss: play.judgeMiss,
        judge_near: play.judgeNear,
        play_time: formatKstPlayTime(play.playedAt),
    }));
}

export async function getUserChartPerformanceTrend(
    userId: number,
    chartId: number
) {
    const plays = (await loadChartPlayHistory(userId, chartId)).slice(0, 30);

    return plays.reverse().map((play) => ({
        id: play.id,
        score: play.score,
        best_score: play.bestScore,
        fast_count: play.fastCount,
        slow_count: play.slowCount,
        judge_sjust: play.judgeSjust,
        judge_just: play.judgeJust,
        judge_good: play.judgeGood,
        judge_miss: play.judgeMiss,
        judge_near: play.judgeNear,
        play_time: formatKstPlayTime(play.playedAt),
    }));
}

export async function getUserChartScoreTrend(
    userId: number,
    chartId: number,
    currentRecord: { score: number; rank: string; besttime: string } | null
) {
    const [snapshots, history] = await Promise.all([
        db.chartRecordSnapshot.findMany({
            where: { userId: userId, chartId: chartId, score: { gt: 0 } },
            select: {
                id: true,
                score: true,
                rank: true,
                bestAt: true,
                createdAt: true,
            },
            orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        }),
        loadChartPlayHistory(userId, chartId).then((plays) =>
            plays.filter((play) => play.score > 0)
        ),
    ]);
    const records = [
        ...snapshots.map((snapshot) => ({
            id: snapshot.id,
            score: snapshot.score,
            rank: snapshot.rank,
            // 옛 besttime 과 같은 글자(시각이 없던 줄은 옛 자리표시 그대로)
            play_time: legacyBesttime(snapshot.bestAt),
        })),
        ...history.map((play) => ({
            // Distinct IDs across the two tables and the current best record.
            id: -play.id - 1,
            score: play.score,
            rank: play.rank,
            play_time: formatKstPlayTime(play.playedAt),
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
