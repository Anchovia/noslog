import { getMissNearCount, getSJustRate } from "@/lib/music/scoreTrend";

interface ProfileRecord {
    play_count: number;
    clear_count: number | null;
    fullcombo_count: number;
    pianistic_count: number;
    judge_sjust: number | null;
    judge_just: number | null;
    judge_good: number | null;
    judge_miss: number | null;
    judge_near: number | null;
    note_rate_standard: number | null;
    note_rate_tenuto: number | null;
    note_rate_glissando: number | null;
    note_rate_trill: number | null;
}

interface RecentPerformanceRecord {
    id: number;
    play_time: string;
    fast_count: number | null;
    slow_count: number | null;
    judge_sjust: number | null;
    judge_just: number | null;
    judge_good: number | null;
    judge_miss: number | null;
    judge_near: number | null;
}

export interface ProfilePerformanceTrendPoint {
    id: number;
    play_time: string;
    fast: number | null;
    slow: number | null;
    sjust_rate: number | null;
    miss_near: number | null;
}

export interface ProfilePerformanceAnalytics {
    judgement: {
        sjustRate: number | null;
        averageMissNear: number | null;
        chartCount: number;
    };
    timing: {
        fastCount: number;
        slowCount: number;
        fastRate: number | null;
        playCount: number;
    };
    noteRates: {
        key: "standard" | "tenuto" | "glissando" | "trill";
        label: string;
        value: number | null;
    }[];
    weakestNoteType: string | null;
    outcomes: {
        clearRate: number | null;
        fullComboRate: number | null;
        pianistRate: number | null;
        playCount: number;
    };
    recentTrend: ProfilePerformanceTrendPoint[];
}

function toPercentage(count: number, total: number) {
    if (total <= 0) return null;
    return (count / total) * 100;
}

function average(values: number[]) {
    if (values.length === 0) return null;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function buildProfilePerformanceAnalytics(
    records: ProfileRecord[],
    recentPlays: RecentPerformanceRecord[]
): ProfilePerformanceAnalytics {
    const judgementRecords = records.filter(
        (record) =>
            record.judge_sjust !== null &&
            record.judge_just !== null &&
            record.judge_good !== null &&
            record.judge_miss !== null &&
            record.judge_near !== null
    );
    const judgementTotals = judgementRecords.reduce(
        (totals, record) => ({
            sjust: totals.sjust + (record.judge_sjust ?? 0),
            just: totals.just + (record.judge_just ?? 0),
            good: totals.good + (record.judge_good ?? 0),
            miss: totals.miss + (record.judge_miss ?? 0),
            near: totals.near + (record.judge_near ?? 0),
        }),
        { sjust: 0, just: 0, good: 0, miss: 0, near: 0 }
    );
    const judgementTotal = Object.values(judgementTotals).reduce(
        (sum, value) => sum + value,
        0
    );

    const noteRateDefinitions = [
        {
            key: "standard" as const,
            label: "일반",
            field: "note_rate_standard" as const,
        },
        {
            key: "tenuto" as const,
            label: "테누토",
            field: "note_rate_tenuto" as const,
        },
        {
            key: "glissando" as const,
            label: "글리산도",
            field: "note_rate_glissando" as const,
        },
        {
            key: "trill" as const,
            label: "트릴",
            field: "note_rate_trill" as const,
        },
    ];
    const noteRates = noteRateDefinitions.map((definition) => {
        const values = records.flatMap((record) => {
            const value = record[definition.field];
            return value === null ? [] : [value / 100];
        });

        return {
            key: definition.key,
            label: definition.label,
            value: average(values),
        };
    });
    const availableNoteRates = noteRates.filter(
        (
            note
        ): note is (typeof noteRates)[number] & {
            value: number;
        } => note.value !== null
    );
    const weakestNoteType =
        availableNoteRates.length > 0
            ? availableNoteRates.reduce((weakest, note) =>
                  note.value < weakest.value ? note : weakest
              ).label
            : null;

    const totalPlayCount = records.reduce(
        (sum, record) => sum + record.play_count,
        0
    );
    const clearRecords = records.filter(
        (record) => record.clear_count !== null
    );
    const clearPlayCount = clearRecords.reduce(
        (sum, record) => sum + record.play_count,
        0
    );
    const clearCount = clearRecords.reduce(
        (sum, record) => sum + (record.clear_count ?? 0),
        0
    );
    const fullComboCount = records.reduce(
        (sum, record) => sum + record.fullcombo_count,
        0
    );
    const pianistCount = records.reduce(
        (sum, record) => sum + record.pianistic_count,
        0
    );

    const timingPlays = recentPlays.filter(
        (play) => play.fast_count !== null && play.slow_count !== null
    );
    const fastCount = timingPlays.reduce(
        (sum, play) => sum + (play.fast_count ?? 0),
        0
    );
    const slowCount = timingPlays.reduce(
        (sum, play) => sum + (play.slow_count ?? 0),
        0
    );

    return {
        judgement: {
            sjustRate: toPercentage(judgementTotals.sjust, judgementTotal),
            averageMissNear:
                judgementRecords.length > 0
                    ? (judgementTotals.miss + judgementTotals.near) /
                      judgementRecords.length
                    : null,
            chartCount: judgementRecords.length,
        },
        timing: {
            fastCount,
            slowCount,
            fastRate: toPercentage(fastCount, fastCount + slowCount),
            playCount: timingPlays.length,
        },
        noteRates,
        weakestNoteType,
        outcomes: {
            clearRate: toPercentage(clearCount, clearPlayCount),
            fullComboRate: toPercentage(fullComboCount, totalPlayCount),
            pianistRate: toPercentage(pianistCount, totalPlayCount),
            playCount: totalPlayCount,
        },
        recentTrend: recentPlays.map((play) => ({
            id: play.id,
            play_time: play.play_time,
            fast: play.fast_count,
            slow: play.slow_count,
            sjust_rate: getSJustRate(play),
            miss_near: getMissNearCount(play),
        })),
    };
}
