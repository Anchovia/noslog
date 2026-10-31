import "server-only";

import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

import {
    ACHIEVEMENT_DEFINITIONS,
    ACHIEVEMENT_MUSIC_CATEGORIES,
    ACHIEVEMENT_SHOWCASE_SIZE,
    type AchievementChartRow,
    type AchievementMetrics,
    type AchievementRecords,
    type AchievementTier,
    chartAchievementMetrics,
    examGradeScore,
    getAchievementDefinition,
    newAchievementTiers,
    recipientKey,
    staleAchievementRows,
} from "@/features/achievements/achievement-definitions";
import {
    examAchievementGradeSelect,
    getBestExamGrade,
} from "@/features/exams/exam-grades";
import { PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cache-policy";
import { CACHE_TAGS } from "@/lib/cache-tags";
import db from "@/lib/db";

// S 이상 = 등급 S · P(1,000,000). 풀콤보 = fc_type 2 이상 또는 1,000,000(순위표 FC 표시와 같은 기준)
const S_RANKS = ["S", "P"];

interface PlayCounts {
    s_rank: number;
    score_990k: number;
    full_combo: number;
    pianist: number;
    real_s_rank: number;
}

/** 판정에 쓰는 값을 한 번에 모은다 — 동기화 뒤 · 업적 화면에서 같은 값을 쓴다 */
export async function collectAchievementMetrics(
    userId: number
): Promise<AchievementMetrics> {
    const categoryCodes = Object.values(ACHIEVEMENT_MUSIC_CATEGORIES);
    const sRank = Prisma.join(S_RANKS);
    const [
        [plays],
        categories,
        stats,
        exams,
        opinions,
        patternEvaluations,
        helpfulReceived,
        charts,
        [revived],
    ] = await Promise.all([
        db.$queryRaw<PlayCounts[]>`
            SELECT
                count(*) FILTER (WHERE play.rank IN (${sRank}))::int AS s_rank,
                count(*) FILTER (WHERE play.score >= 990000)::int AS score_990k,
                count(*) FILTER (WHERE play.fc_type >= 2 OR play.score >= 1000000)::int AS full_combo,
                count(*) FILTER (WHERE play.fc_type = 3 OR play.score >= 1000000)::int AS pianist,
                count(*) FILTER (WHERE chart.difficulty = 'Real' AND play.rank IN (${Prisma.join(S_RANKS)}))::int AS real_s_rank
            FROM play_data play
            -- 난이도는 채보에서(2026-10-16 P5-2 에서 PlayData 의 난이도 사본을 지웠다)
            JOIN music_charts chart ON chart.id = play.chart_id
            WHERE play.user_id = ${userId}`,
        db.$queryRaw<{ category: string; got: number; total: number }[]>`
            SELECT m.category_short AS category,
                count(DISTINCT m.index) FILTER (WHERE p.id IS NOT NULL)::int AS got,
                count(DISTINCT m.index)::int AS total
            FROM music m
            -- 곡은 채보 연결로(2026-10-16 P5-2 에서 PlayData 의 곡 사본을 지웠다)
            LEFT JOIN (play_data p JOIN music_charts c ON c.id = p.chart_id)
                ON c.music_idx = m.index AND p.user_id = ${userId}
                AND p.rank IN (${Prisma.join(S_RANKS)})
            WHERE m.category_short IN (${Prisma.join(categoryCodes)})
            GROUP BY m.category_short`,
        db.playerStats.findUnique({
            where: { userId },
            select: { gradeBasic: true },
        }),
        db.examAchievement.findMany({
            where: { userId },
            ...examAchievementGradeSelect,
        }),
        db.communityChartEvaluation.count({
            where: {
                userId,
                excluded: false,
                opinionHidden: false,
                opinion: { not: null },
            },
        }),
        db.communityChartEvaluation.count({
            where: {
                userId,
                excluded: false,
                OR: [
                    { stairs: { not: null } },
                    { repetition: { not: null } },
                    { polyrhythm: { not: null } },
                    { offset: { not: null } },
                    { chords: { not: null } },
                ],
            },
        }),
        db.communityOpinionHelpful.count({
            where: {
                userId: { not: userId },
                evaluation: { userId, excluded: false },
            },
        }),
        // 곡 묶음 · 한 곡 완주 · 레벨 사다리 — 모든 채보에 그 사람의 기록을 붙인다(기록 없는 채보도 「모든 난이도」 판정에 필요)
        db.$queryRaw<AchievementChartRow[]>`
            SELECT chart.music_idx AS "musicIndex",
                chart.difficulty::text AS difficulty,
                chart.level,
                coalesce(play.rank IN (${sRank}), false) AS "sRank",
                coalesce(play.fc_type >= 2 OR play.score >= 1000000, false) AS "fullCombo",
                coalesce(play.fc_type = 3 OR play.score >= 1000000, false) AS pianist
            FROM music_charts chart
            LEFT JOIN play_data play
                ON play.chart_id = chart.id AND play.user_id = ${userId}`,
        // 30일 넘게 다른 의견이 없던 채보(나온 지 30일 안 된 채보는 빼고)에 단 의견 중 남에게 「좋아요」 를 받은 것
        db.$queryRaw<{ revived: number }[]>`
            SELECT count(*)::int AS revived
            FROM community_chart_evaluations mine
            JOIN music_charts chart ON chart.id = mine.chart_id
            WHERE mine.user_id = ${userId}
                AND mine.excluded = false
                AND mine.opinion_hidden = false
                AND mine.opinion IS NOT NULL
                AND mine.opinion_created_at IS NOT NULL
                AND (chart.released_at IS NULL
                    OR chart.released_at <= mine.opinion_created_at - interval '30 days')
                AND NOT EXISTS (
                    SELECT 1 FROM community_chart_evaluations other
                    WHERE other.chart_id = mine.chart_id
                        AND other.id <> mine.id
                        AND other.excluded = false
                        AND other.opinion_hidden = false
                        AND other.opinion IS NOT NULL
                        AND other.opinion_created_at < mine.opinion_created_at
                        AND other.opinion_created_at > mine.opinion_created_at - interval '30 days')
                AND EXISTS (
                    SELECT 1 FROM community_opinion_helpful_votes vote
                    WHERE vote.evaluation_id = mine.id AND vote.user_id <> ${userId})`,
    ]);

    const category = (code: string) => {
        const row = categories.find((item) => item.category === code);
        return { value: row?.got ?? 0, total: row?.total ?? 0 };
    };

    return {
        sRankCharts: { value: plays?.s_rank ?? 0 },
        score990kCharts: { value: plays?.score_990k ?? 0 },
        fullComboCharts: { value: plays?.full_combo ?? 0 },
        pianistCharts: { value: plays?.pianist ?? 0 },
        realSRankCharts: { value: plays?.real_s_rank ?? 0 },
        // User.grade_basic 은 100 배 정수(화면은 /100)
        basicGrade: { value: Math.floor((stats?.gradeBasic ?? 0) / 100) },
        examBasic: {
            value: examGradeScore(getBestExamGrade(exams, "basic")),
        },
        examRecital: {
            value: examGradeScore(getBestExamGrade(exams, "recital")),
        },
        opinions: { value: opinions },
        helpfulReceived: { value: helpfulReceived },
        patternEvaluations: { value: patternEvaluations },
        categoryBM: category(ACHIEVEMENT_MUSIC_CATEGORIES.categoryBM),
        categoryOrg: category(ACHIEVEMENT_MUSIC_CATEGORIES.categoryOrg),
        categoryClJz: category(ACHIEVEMENT_MUSIC_CATEGORIES.categoryClJz),
        categoryVar: category(ACHIEVEMENT_MUSIC_CATEGORIES.categoryVar),
        ...chartAchievementMetrics(charts),
        revivedOpinions: { value: revived?.revived ?? 0 },
    };
}

export interface NewAchievement {
    key: string;
    tier: AchievementTier;
}

/**
 * 동기화 뒤 판정(N1) — 새로 닿은 단계만 더하고 돌려준다. 같은 단계는 한 번만(유일 키).
 * 날짜는 NosLog 가 확인한 때(2026-09-24 D-a).
 */
export async function evaluateUserAchievements(
    userId: number
): Promise<NewAchievement[]> {
    return (await judgeUserAchievements(userId, false)).added;
}

export interface AchievementJudgement {
    added: NewAchievement[];
    /** 뺀 단계 수 — prune 일 때만 */
    removed: number;
}

/**
 * 한 사람 판정. prune = 관리자 「기준에 못 미치는 단계도 빼기」(2026-09-25 R1) — 기준을 바꾼 뒤에만 켠다.
 * 빼는 것: 없어진 업적(예: 빙고) · 그 업적이 갖지 않은 등급 · 지금 값이 그 등급 기준에 못 미치는 단계.
 * 평소(동기화 · prune 꺼짐)는 얻은 단계를 빼지 않는다.
 */
export async function judgeUserAchievements(
    userId: number,
    prune: boolean
): Promise<AchievementJudgement> {
    const [metrics, earnedRows] = await Promise.all([
        collectAchievementMetrics(userId),
        db.userAchievement.findMany({
            where: { userId: userId },
            select: { id: true, key: true, tier: true },
        }),
    ]);
    let removed = 0;
    let kept = earnedRows;
    if (prune) {
        const stale = staleAchievementRows(earnedRows, metrics);
        if (stale.length) {
            const result = await db.userAchievement.deleteMany({
                where: { id: { in: stale.map((row) => row.id) } },
            });
            removed = result.count;
            const staleIds = new Set(stale.map((row) => row.id));
            kept = earnedRows.filter((row) => !staleIds.has(row.id));
        }
    }
    const earned = new Map<string, number>();
    for (const row of kept)
        earned.set(row.key, Math.max(earned.get(row.key) ?? 0, row.tier));
    const awarded: NewAchievement[] = ACHIEVEMENT_DEFINITIONS.flatMap(
        (definition) =>
            newAchievementTiers(
                definition,
                metrics[definition.metric],
                earned.get(definition.key) ?? 0
            ).map((tier) => ({ key: definition.key, tier }))
    );
    if (awarded.length)
        await db.userAchievement.createMany({
            data: awarded.map((item) => ({
                userId: userId,
                key: item.key,
                tier: item.tier,
            })),
            skipDuplicates: true,
        });
    return { added: awarded, removed };
}

/** 한 사람의 얻은 단계 · 건 업적 · 그 단계들의 달성 인원 — 프로필 캐시 · 업적 페이지가 같이 쓴다 */
export async function getAchievementRecords(
    userId: number
): Promise<AchievementRecords> {
    const [earned, pins] = await Promise.all([
        db.userAchievement.findMany({
            where: { userId: userId },
            select: { key: true, tier: true, achievedAt: true },
            orderBy: [{ achievedAt: "desc" }, { tier: "desc" }],
        }),
        db.userAchievementShowcase.findMany({
            where: { userId: userId },
            select: { key: true },
            orderBy: { position: "asc" },
        }),
    ]);
    const counts = earned.length
        ? await db.userAchievement.groupBy({
              by: ["key", "tier"],
              where: {
                  OR: earned.map((item) => ({
                      key: item.key,
                      tier: item.tier,
                  })),
              },
              _count: { _all: true },
          })
        : [];
    return {
        earned: earned
            .filter((item) => getAchievementDefinition(item.key))
            .map((item) => ({
                key: item.key,
                tier: item.tier,
                achievedAt: item.achievedAt.toISOString(),
            })),
        pins: pins.map((item) => item.key),
        recipients: Object.fromEntries(
            counts.map((row) => [
                recipientKey(row.key, row.tier),
                row._count._all,
            ])
        ),
    };
}

/**
 * 업적 페이지 — 정의별 달성 인원(얻지 않은 단계 포함, 상세 사다리용).
 * 모두에게 같아 새 업적 · 다시 판정 때 비워지는 userProfiles 태그로 캐시(2026-10-15 S7)
 */
export const getAchievementRecipientCounts = unstable_cache(
    async () => {
        const rows = await db.userAchievement.groupBy({
            by: ["key", "tier"],
            _count: { _all: true },
        });
        return Object.fromEntries(
            rows.map((row) => [
                recipientKey(row.key, row.tier),
                row._count._all,
            ])
        );
    },
    ["achievement-recipient-counts-v1"],
    {
        tags: [CACHE_TAGS.userProfiles],
        revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    }
);

export type AchievementShowcaseResult =
    | { status: "ok"; keys: string[] }
    | { status: "too-many" | "not-earned" | "unknown" };

/**
 * 프로필 머리에 걸 업적을 통째로 바꾼다(2026-09-25 D1 — 설정 「프로필」 탭에서 저장).
 * 얻은 업적만 · 겹치지 않게 · 최대 3칸, 빈 목록이면 머리는 다시 자동 진열.
 */
export async function setAchievementShowcase(
    userId: number,
    keys: readonly string[]
): Promise<AchievementShowcaseResult> {
    const unique = [...new Set(keys)];
    if (unique.length > ACHIEVEMENT_SHOWCASE_SIZE)
        return { status: "too-many" };
    if (unique.some((key) => !getAchievementDefinition(key)))
        return { status: "unknown" };
    if (unique.length) {
        const earned = await db.userAchievement.findMany({
            where: { userId: userId, key: { in: unique } },
            distinct: ["key"],
            select: { key: true },
        });
        if (earned.length !== unique.length) return { status: "not-earned" };
    }
    await db.$transaction([
        db.userAchievementShowcase.deleteMany({ where: { userId: userId } }),
        db.userAchievementShowcase.createMany({
            data: unique.map((key, index) => ({
                userId: userId,
                position: index + 1,
                key,
            })),
        }),
    ]);
    return { status: "ok", keys: unique };
}

export const ACHIEVEMENT_REJUDGE_BATCH = 50;

export interface AchievementRejudgeBatch {
    /** 이번에 판정한 사용자 수 */
    judged: number;
    /** 이번에 새로 더한 단계 수 */
    awarded: number;
    /** 뺀 단계 수(「기준에 못 미치는 단계도 빼기」 일 때) */
    removed: number;
    /** 단계가 바뀐 사용자(프로필 캐시 비우기용) */
    awardedUserIds: number[];
    /** 다음 묶음 시작점 — 끝이면 null */
    nextCursor: number | null;
}

/**
 * 관리자 「업적 다시 판정」(2026-09-25 B1) — 판정할 거리가 있는 사용자(기록 · 검정 합격 · 커뮤니티 평가)를
 * id 순으로 한 묶음씩. 새로 닿은 단계만 더하고 얻은 단계는 빼지 않는다(동기화 판정과 같은 함수).
 * 연결 수를 넘지 않게 한 사람씩 차례로 돈다.
 */
export async function rejudgeAchievementsBatch(
    afterUserId: number,
    limit = ACHIEVEMENT_REJUDGE_BATCH,
    prune = false,
    judge: (
        userId: number,
        prune: boolean
    ) => Promise<AchievementJudgement> = judgeUserAchievements
): Promise<AchievementRejudgeBatch> {
    const users = await db.user.findMany({
        where: {
            id: { gt: afterUserId },
            OR: [
                { playData: { some: {} } },
                { chartPlayHistory: { some: {} } },
                { examAchievements: { some: {} } },
                { communityEvaluations: { some: {} } },
            ],
        },
        orderBy: { id: "asc" },
        take: limit,
        select: { id: true },
    });
    let awarded = 0;
    let removed = 0;
    const awardedUserIds: number[] = [];
    for (const { id } of users) {
        const result = await judge(id, prune);
        awarded += result.added.length;
        removed += result.removed;
        if (result.added.length || result.removed) awardedUserIds.push(id);
    }
    return {
        judged: users.length,
        awarded,
        removed,
        awardedUserIds,
        nextCursor: users.length === limit ? users[users.length - 1].id : null,
    };
}
