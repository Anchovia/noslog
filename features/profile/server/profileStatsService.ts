import "server-only";

import db from "@/lib/db";
import {
    PROFILE_LAMP_KEYS,
    PROFILE_RANK_KEYS,
    profileStatsSchema,
    type ProfileLampKey,
    type ProfileRankKey,
} from "@/features/profile/schemas/profileStatsSchema";

/** 램프 — Pianist > FC > 클리어 > 실패. 클리어 횟수가 없는 옛 기록은 클리어로 센다(실패는 0 으로 확인된 것만) */
export function playLamp(play: {
    fc_type: number;
    clear_count: number | null;
}): ProfileLampKey {
    if (play.fc_type >= 3) return "pianist";
    if (play.fc_type >= 2) return "fc";
    return play.clear_count === 0 ? "fail" : "clear";
}

/** 랭크 묶음 — P · S · A+ · A · B 이하(B+ · B · C · D · F) */
export function playRankKey(rank: string): ProfileRankKey {
    if (rank === "P" || rank === "S" || rank === "A") return rank;
    if (rank === "A2") return "A+";
    return "B";
}

const NOTE_FIELDS = [
    ["standard", "note_rate_standard"],
    ["tenuto", "note_rate_tenuto"],
    ["glissando", "note_rate_glissando"],
    ["trill", "note_rate_trill"],
] as const;

/**
 * 「통계」 탭(2026-09-26) — 모드와 관계없는 기록 집계. 레벨별 달성(난이도 · 레벨마다 램프 · 랭크 수, 분모는 수록 채보 전체) ·
 * 판정 합계 · 노트 종류별 성공률(그 노트가 있는 채보의 베스트 기록 평균)
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
                clear_count: true,
                judge_sjust: true,
                judge_just: true,
                judge_good: true,
                judge_near: true,
                judge_miss: true,
                note_rate_standard: true,
                note_rate_tenuto: true,
                note_rate_glissando: true,
                note_rate_trill: true,
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
                lamp: Object.fromEntries(
                    PROFILE_LAMP_KEYS.map((key) => [key, 0])
                ) as Record<ProfileLampKey, number>,
                rank: Object.fromEntries(
                    PROFILE_RANK_KEYS.map((key) => [key, 0])
                ) as Record<ProfileRankKey, number>,
            },
        ])
    );
    const judgement = { sjust: 0, just: 0, good: 0, near: 0, miss: 0 };
    let judgedCharts = 0;
    const notes = new Map(
        NOTE_FIELDS.map(([key]) => [key, { sum: 0, count: 0 }])
    );
    for (const play of plays) {
        const row = play.chart
            ? levels.get(
                  `${play.chart.difficulty.toLowerCase()}:${play.chart.level}`
              )
            : undefined;
        if (row) {
            row.lamp[playLamp(play)] += 1;
            row.rank[playRankKey(play.rank)] += 1;
        }
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
        for (const [key, field] of NOTE_FIELDS) {
            const value = play[field];
            if (value === null || value < 0) continue;
            const note = notes.get(key)!;
            note.sum += value;
            note.count += 1;
        }
    }
    return profileStatsSchema.parse({
        levels: [...levels.values()].sort(
            (a, b) =>
                Number(a.difficulty === "real") -
                    Number(b.difficulty === "real") || a.level - b.level
        ),
        judgement: { counts: judgement, chartCount: judgedCharts },
        notes: NOTE_FIELDS.map(([key]) => {
            const note = notes.get(key)!;
            return {
                key,
                // 저장 값은 만분율(10000 = 100%)
                rate: note.count ? note.sum / note.count / 100 : null,
                charts: note.count,
            };
        }),
        played: plays.length,
    });
}
