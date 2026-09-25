import "server-only";

import db from "@/lib/db";
import {
    PROFILE_TIER_KEYS,
    profileStatsSchema,
    type ProfileTierKey,
} from "@/features/profile/schemas/profileStatsSchema";

/** 레벨별 달성 칸(2026-09-26 L1) — Pianist(FC 램프 3 · P 랭크) > FC(FC 램프 2) > 랭크 S · A+ · A · B 이하 */
export function playTier(play: {
    fc_type: number;
    rank: string;
}): ProfileTierKey {
    if (play.fc_type >= 3 || play.rank === "P") return "pianist";
    if (play.fc_type >= 2) return "fc";
    if (play.rank === "S") return "S";
    if (play.rank === "A2") return "A+";
    if (play.rank === "A") return "A";
    return "B";
}

/**
 * 「통계」 탭(2026-09-26) — 모드와 관계없는 기록 집계. 레벨별 달성(난이도 · 레벨마다 칸별 수, 분모는 수록 채보 전체) ·
 * 판정 합계
 */
export async function getProfileStats(userId: number) {
    const [charts, plays] = await Promise.all([
        db.musicChart.groupBy({
            by: ["difficulty", "level"],
            _count: { _all: true },
        }),
        db.playData.findMany({
            where: { user_id: userId, score: { gt: 0 } },
            select: {
                rank: true,
                fc_type: true,
                judge_sjust: true,
                judge_just: true,
                judge_good: true,
                judge_near: true,
                judge_miss: true,
                chart: { select: { difficulty: true, level: true } },
            },
        }),
    ]);
    const levels = new Map(
        charts.map((chart) => [
            `${chart.difficulty.toLowerCase()}:${chart.level}`,
            {
                difficulty: chart.difficulty.toLowerCase(),
                level: chart.level,
                total: chart._count._all,
                tiers: Object.fromEntries(
                    PROFILE_TIER_KEYS.map((key) => [key, 0])
                ) as Record<ProfileTierKey, number>,
            },
        ])
    );
    const judgement = { sjust: 0, just: 0, good: 0, near: 0, miss: 0 };
    let judgedCharts = 0;
    for (const play of plays) {
        const row = play.chart
            ? levels.get(
                  `${play.chart.difficulty.toLowerCase()}:${play.chart.level}`
              )
            : undefined;
        if (row) row.tiers[playTier(play)] += 1;
        const judged = [
            play.judge_sjust,
            play.judge_just,
            play.judge_good,
            play.judge_near,
            play.judge_miss,
        ];
        if (
            judged.every((value) => value !== null && value >= 0) &&
            judged.some((value) => value! > 0)
        ) {
            judgedCharts += 1;
            judgement.sjust += play.judge_sjust!;
            judgement.just += play.judge_just!;
            judgement.good += play.judge_good!;
            judgement.near += play.judge_near!;
            judgement.miss += play.judge_miss!;
        }
    }
    return profileStatsSchema.parse({
        levels: [...levels.values()].sort(
            (a, b) =>
                Number(a.difficulty === "real") -
                    Number(b.difficulty === "real") || a.level - b.level
        ),
        judgement: { counts: judgement, chartCount: judgedCharts },
        played: plays.length,
    });
}
