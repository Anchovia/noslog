import "server-only";

import { Prisma } from "@prisma/client";

import {
    ACHIEVEMENT_DEFINITIONS,
    ACHIEVEMENT_MUSIC_CATEGORIES,
    examGradeScore,
    newAchievementTiers,
    type AchievementMetrics,
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
        bingoCells,
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
        db.bingoCellProgress.findMany({
            where: {
                userId,
                isCompleted: true,
                cell: { bingo: { status: { not: "draft" } } },
            },
            select: { cell: { select: { bingoId: true } } },
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

    const completedByBingo = new Map<number, number>();
    for (const { cell } of bingoCells) {
        completedByBingo.set(
            cell.bingoId,
            (completedByBingo.get(cell.bingoId) ?? 0) + 1
        );
    }
    const cellCounts = completedByBingo.size
        ? await db.bingoCell.groupBy({
              by: ["bingoId"],
              where: { bingoId: { in: [...completedByBingo.keys()] } },
              _count: { _all: true },
          })
        : [];
    const bingoFullBoards = cellCounts.filter(
        (row) =>
            row._count._all > 0 &&
            completedByBingo.get(row.bingoId) === row._count._all
    ).length;

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
        bingoFullBoards: { value: bingoFullBoards },
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

/** 업적 키별 얻은 가장 높은 단계 */
async function earnedTiers(userId: number) {
    const rows = await db.userAchievement.groupBy({
        by: ["key"],
        where: { user_id: userId },
        _max: { tier: true },
    });
    return new Map(rows.map((row) => [row.key, row._max.tier ?? 0]));
}

/**
 * 동기화 뒤 판정(N1) — 새로 닿은 단계만 더하고 돌려준다. 같은 단계는 한 번만(유일 키).
 * 날짜는 NosLog 가 확인한 때(2026-09-24 D-a).
 */
export async function evaluateUserAchievements(
    userId: number
): Promise<NewAchievement[]> {
    const [metrics, earned] = await Promise.all([
        collectAchievementMetrics(userId),
        earnedTiers(userId),
    ]);
    const awarded: NewAchievement[] = ACHIEVEMENT_DEFINITIONS.flatMap(
        (definition) =>
            newAchievementTiers(
                definition,
                metrics[definition.metric],
                earned.get(definition.key) ?? 0
            ).map((tier) => ({ key: definition.key, tier }))
    );
    if (awarded.length === 0) return [];
    await db.userAchievement.createMany({
        data: awarded.map((item) => ({
            user_id: userId,
            key: item.key,
            tier: item.tier,
        })),
        skipDuplicates: true,
    });
    return awarded;
}
