import "server-only";

import { Prisma } from "@prisma/client";

import {
    ACHIEVEMENT_DEFINITIONS,
    ACHIEVEMENT_MUSIC_CATEGORIES,
    ACHIEVEMENT_SHOWCASE_SIZE,
    staleAchievementRows,
    examGradeScore,
    getAchievementDefinition,
    newAchievementTiers,
    recipientKey,
    type AchievementMetrics,
    type AchievementRecords,
    type AchievementTier,
} from "@/features/achievements/achievementDefinitions";
import {
    examAchievementGradeSelect,
    getBestExamGrade,
} from "@/features/exams/examGrades";
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
    const [
        [plays],
        categories,
        oneHand,
        user,
        exams,
        opinions,
        patternEvaluations,
        helpfulReceived,
    ] = await Promise.all([
        db.$queryRaw<PlayCounts[]>`
            SELECT
                count(*) FILTER (WHERE rank IN (${Prisma.join(S_RANKS)}))::int AS s_rank,
                count(*) FILTER (WHERE score >= 990000)::int AS score_990k,
                count(*) FILTER (WHERE fc_type >= 2 OR score >= 1000000)::int AS full_combo,
                count(*) FILTER (WHERE fc_type = 3 OR score >= 1000000)::int AS pianist,
                count(*) FILTER (WHERE difficulty = 'Real' AND rank IN (${Prisma.join(S_RANKS)}))::int AS real_s_rank
            FROM "PlayData"
            WHERE user_id = ${userId} AND chart_id IS NOT NULL`,
        db.$queryRaw<{ category: string; got: number; total: number }[]>`
            SELECT m.category_short AS category,
                count(DISTINCT m.index) FILTER (WHERE p.id IS NOT NULL)::int AS got,
                count(DISTINCT m.index)::int AS total
            FROM "Music" m
            LEFT JOIN "PlayData" p
                ON p.music_idx = m.index AND p.user_id = ${userId}
                AND p.rank IN (${Prisma.join(S_RANKS)})
            WHERE m.category_short IN (${Prisma.join(categoryCodes)})
            GROUP BY m.category_short`,
        // 한 손 여부는 최근 플레이 응답에만 있다 — 최근 기록 누적(ChartPlayHistory)에서 센다
        db.chartPlayHistory.findMany({
            where: { user_id: userId, is_onehand: true, rank: { in: S_RANKS } },
            distinct: ["chart_id"],
            select: { chart_id: true },
        }),
        db.user.findUnique({
            where: { id: userId },
            select: { grade_basic: true },
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
        oneHandSRankCharts: { value: oneHand.length },
        // User.grade_basic 은 100 배 정수(화면은 /100)
        basicGrade: { value: Math.floor((user?.grade_basic ?? 0) / 100) },
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
            where: { user_id: userId },
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
                user_id: userId,
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
            where: { user_id: userId },
            select: { key: true, tier: true, achieved_at: true },
            orderBy: [{ achieved_at: "desc" }, { tier: "desc" }],
        }),
        db.userAchievementShowcase.findMany({
            where: { user_id: userId },
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
                achievedAt: item.achieved_at.toISOString(),
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

/** 업적 페이지 — 정의별 달성 인원(얻지 않은 단계 포함, 상세 사다리용) */
export async function getAchievementRecipientCounts() {
    const rows = await db.userAchievement.groupBy({
        by: ["key", "tier"],
        _count: { _all: true },
    });
    return Object.fromEntries(
        rows.map((row) => [recipientKey(row.key, row.tier), row._count._all])
    );
}

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
            where: { user_id: userId, key: { in: unique } },
            distinct: ["key"],
            select: { key: true },
        });
        if (earned.length !== unique.length) return { status: "not-earned" };
    }
    await db.$transaction([
        db.userAchievementShowcase.deleteMany({ where: { user_id: userId } }),
        db.userAchievementShowcase.createMany({
            data: unique.map((key, index) => ({
                user_id: userId,
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
                { PlayData: { some: {} } },
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
