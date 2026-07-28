interface ProfileRecord {
    judge_sjust: number | null;
    judge_just: number | null;
    judge_good: number | null;
    judge_miss: number | null;
    judge_near: number | null;
}

export interface ProfileSJustAnalytics {
    sjustRate: number | null;
    chartCount: number;
}

function toPercentage(count: number, total: number) {
    if (total <= 0) return null;
    return (count / total) * 100;
}

export function buildProfileSJustAnalytics(
    records: ProfileRecord[]
): ProfileSJustAnalytics {
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

    return {
        sjustRate: toPercentage(judgementTotals.sjust, judgementTotal),
        chartCount: judgementRecords.length,
    };
}
