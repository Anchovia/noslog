/** Basic Grd ×100. Only coefficients verified against stored official plays are enabled. */
export interface BasicGradeAttempt {
    rank: string;
    max_combo: number;
    is_onehand?: boolean | null;
    judge_sjust: number | null;
    judge_just: number | null;
    judge_good: number | null;
    judge_near: number | null;
    judge_miss: number | null;
}

export interface BasicGradeChart {
    difficulty?: string;
    level_constant?: number | null;
    note_count: number | null;
}

export function calculateBasicGrade(
    play: BasicGradeAttempt,
    chart: BasicGradeChart
): number | null {
    const rank = ({ A: 72, A2: 78, S: 87, P: 99 } as Record<string, number>)[
        play.rank
    ];
    const difficulty = (
        { Normal: 4, Hard: 5, Expert: 6, Real: 6 } as Record<string, number>
    )[chart.difficulty ?? ""];
    const level = chart.level_constant;
    const notes = chart.note_count;
    const judges = [
        play.judge_sjust,
        play.judge_just,
        play.judge_good,
        play.judge_near,
        play.judge_miss,
    ];
    if (
        !rank ||
        !difficulty ||
        play.is_onehand !== false ||
        level == null ||
        !Number.isFinite(level) ||
        level <= 0 ||
        level > 14.5 ||
        !Number.isInteger(level * 10) ||
        notes == null ||
        !Number.isSafeInteger(notes) ||
        notes <= 0 ||
        judges.some(
            (value) =>
                value == null || !Number.isSafeInteger(value) || value < 0
        ) ||
        !Number.isSafeInteger(play.max_combo) ||
        play.max_combo < 0 ||
        play.max_combo > notes
    )
        return null;
    const [sjust, just, good, near, miss] = judges as number[];
    if (sjust + just + good + near + miss !== notes) return null;
    // Integer arithmetic preserves truncation at 0.01 Grd without floating point drift.
    const achievement =
        BigInt(sjust) * BigInt(20) +
        BigInt(just) * BigInt(6) +
        BigInt(good) * BigInt(3) +
        BigInt(near);
    const performance =
        BigInt(85500) * achievement +
        BigInt(10000 + Math.floor(notes / 10) * 10) *
            BigInt(play.max_combo) *
            BigInt(20);
    return Number(
        (BigInt(Math.round(level * 10)) *
            BigInt(difficulty) *
            BigInt(rank) *
            performance) /
            (BigInt(notes) * BigInt(9600000))
    );
}
