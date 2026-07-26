export interface JudgementCounts {
    judge_sjust: number | null;
    judge_just: number | null;
    judge_good: number | null;
    judge_miss: number | null;
    judge_near: number | null;
}

export interface NoteSuccessRates {
    note_rate_standard: number | null;
    note_rate_tenuto: number | null;
    note_rate_glissando: number | null;
    note_rate_trill: number | null;
}

export function hasJudgementData(counts: JudgementCounts) {
    return Object.values(counts).some((value) => value !== null);
}

export function getJudgementTotal(counts: JudgementCounts) {
    if (!hasJudgementData(counts)) return null;

    return Object.values(counts).reduce<number>(
        (total, value) => total + (value ?? 0),
        0
    );
}

export function getJudgementPercentage(
    count: number | null,
    total: number | null
) {
    if (count === null || total === null || total <= 0) return null;
    return (count / total) * 100;
}

export function getCompletionPercentage(
    count: number | null,
    playCount: number | null
) {
    if (count === null || playCount === null || playCount <= 0) return null;
    return (count / playCount) * 100;
}

// BEMANI 원본은 10000을 100.00%로 표현함
export function formatNoteSuccessRate(value: number | null) {
    if (value === null || value < 0) return "-";

    return `${new Intl.NumberFormat("ko-KR", {
        maximumFractionDigits: 2,
    }).format(value / 100)}%`;
}

export function formatMetricPercentage(value: number | null) {
    if (value === null) return null;

    return `${new Intl.NumberFormat("ko-KR", {
        maximumFractionDigits: 1,
    }).format(value)}%`;
}
