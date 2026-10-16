import "server-only";

import { unstable_cache } from "next/cache";

import {
    PROFILE_TIER_KEYS,
    profileStatsSchema,
    type ProfileTierKey,
} from "@/features/profile/schemas/profile-stats-schema";
import { PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cache-policy";
import { CACHE_TAGS } from "@/lib/cache-tags";
import db from "@/lib/db";
import { hasFullComboLamp } from "@/lib/music/clear-mark";

// 난이도 · 레벨별 수록 채보 수 — 모두에게 같아 곡 목록이 바뀔 때 비워지는 musicCatalog 태그로 캐시(2026-10-15 S7)
const getCachedChartLevelCounts = unstable_cache(
    async () =>
        (
            await db.musicChart.groupBy({
                by: ["difficulty", "level"],
                _count: { _all: true },
            })
        ).map((row) => ({
            difficulty: row.difficulty,
            level: row.level,
            count: row._count._all,
        })),
    ["chart-level-counts-v1"],
    {
        tags: [CACHE_TAGS.musicCatalog],
        revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    }
);

/** 레벨별 달성 칸(2026-09-26 L1) — Pianist(FC 램프 3 · P 랭크) > FC(FC 램프 2) > 랭크 S · A+ · A · B 이하 */
export function playTier(play: {
    fcType: number;
    rank: string;
}): ProfileTierKey {
    if (play.fcType >= 3 || play.rank === "P") return "pianist";
    if (hasFullComboLamp(play.fcType)) return "fc";
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
    // 한 사람의 기록 전부를 읽지 않고 DB 에서 칸별 수 · 판정 합계만 센다(2026-10-16 D8 · R1) — 칸 규칙은 위 playTier 와 같다
    const [charts, tierRows, [totals]] = await Promise.all([
        getCachedChartLevelCounts(),
        db.$queryRaw<
            {
                difficulty: string;
                level: number;
                tier: ProfileTierKey;
                count: number;
            }[]
        >`
            SELECT chart.difficulty::text AS difficulty, chart.level,
                   CASE
                       WHEN play.fc_type >= 3 OR play.rank = 'P' THEN 'pianist'
                       WHEN play.fc_type >= 2 THEN 'fc'
                       WHEN play.rank = 'S' THEN 'S'
                       WHEN play.rank = 'A2' THEN 'A+'
                       WHEN play.rank = 'A' THEN 'A'
                       ELSE 'B'
                   END AS tier,
                   count(*)::int AS count
            FROM "PlayData" play
            JOIN "MusicChart" chart ON chart.id = play.chart_id
            WHERE play.user_id = ${userId} AND play.score > 0
            GROUP BY 1, 2, 3
        `,
        // 판정 다섯 칸이 모두 있고(0 이상) 하나라도 0 보다 큰 기록만 판정 합계에 넣는다
        db.$queryRaw<
            {
                played: number;
                judged: number;
                sjust: number;
                just: number;
                good: number;
                near: number;
                miss: number;
            }[]
        >`
            SELECT count(*)::int AS played,
                   count(*) FILTER (WHERE judged)::int AS judged,
                   coalesce(sum(judge_sjust) FILTER (WHERE judged), 0)::int AS sjust,
                   coalesce(sum(judge_just) FILTER (WHERE judged), 0)::int AS just,
                   coalesce(sum(judge_good) FILTER (WHERE judged), 0)::int AS good,
                   coalesce(sum(judge_near) FILTER (WHERE judged), 0)::int AS near,
                   coalesce(sum(judge_miss) FILTER (WHERE judged), 0)::int AS miss
            FROM (
                SELECT judge_sjust, judge_just, judge_good, judge_near, judge_miss,
                       coalesce(
                           judge_sjust >= 0 AND judge_just >= 0 AND judge_good >= 0
                           AND judge_near >= 0 AND judge_miss >= 0
                           AND judge_sjust + judge_just + judge_good + judge_near + judge_miss > 0,
                           false
                       ) AS judged
                FROM "PlayData"
                WHERE user_id = ${userId} AND score > 0
            ) play
        `,
    ]);
    const levels = new Map(
        charts.map((chart) => [
            `${chart.difficulty.toLowerCase()}:${chart.level}`,
            {
                difficulty: chart.difficulty.toLowerCase(),
                level: chart.level,
                total: chart.count,
                tiers: Object.fromEntries(
                    PROFILE_TIER_KEYS.map((key) => [key, 0])
                ) as Record<ProfileTierKey, number>,
            },
        ])
    );
    for (const row of tierRows) {
        const level = levels.get(
            `${row.difficulty.toLowerCase()}:${row.level}`
        );
        if (level) level.tiers[row.tier] += row.count;
    }
    return profileStatsSchema.parse({
        levels: [...levels.values()].sort(
            (a, b) =>
                Number(a.difficulty === "real") -
                    Number(b.difficulty === "real") || a.level - b.level
        ),
        judgement: {
            counts: {
                sjust: totals.sjust,
                just: totals.just,
                good: totals.good,
                near: totals.near,
                miss: totals.miss,
            },
            chartCount: totals.judged,
        },
        played: totals.played,
    });
}
