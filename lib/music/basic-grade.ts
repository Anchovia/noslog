/** Basic Grd ×100. Only coefficients verified against stored official plays are enabled. */
export interface BasicGradeAttempt {
    rank: string;
    maxCombo: number;
    isOnehand?: boolean | null;
    judgeSjust: number | null;
    judgeJust: number | null;
    judgeGood: number | null;
    judgeNear: number | null;
    judgeMiss: number | null;
}

export interface BasicGradeChart {
    difficulty?: string;
    levelConstant?: number | null;
    noteCount: number | null;
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
    const level = chart.levelConstant;
    const notes = chart.noteCount;
    const judges = [
        play.judgeSjust,
        play.judgeJust,
        play.judgeGood,
        play.judgeNear,
        play.judgeMiss,
    ];
    if (
        !rank ||
        !difficulty ||
        play.isOnehand !== false ||
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
        !Number.isSafeInteger(play.maxCombo) ||
        play.maxCombo < 0 ||
        play.maxCombo > notes
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
            BigInt(play.maxCombo) *
            BigInt(20);
    return Number(
        (BigInt(Math.round(level * 10)) *
            BigInt(difficulty) *
            BigInt(rank) *
            performance) /
            (BigInt(notes) * BigInt(9600000))
    );
}
