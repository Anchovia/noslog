export type BemaniJudgeCounts = [number, number, number, number, number];

export type BemaniNoteSuccessRates = [number, number, number, number];

export function normalizeBemaniRank(rank: string) {
    return rank.toUpperCase();
}

export function mapBemaniJudgeCounts(judge: BemaniJudgeCounts) {
    return {
        judgeSjust: judge[0],
        judgeJust: judge[1],
        judgeGood: judge[2],
        judgeMiss: judge[3],
        judgeNear: judge[4],
    };
}

export function mapBemaniNoteSuccessRates(
    noteSuccessRate: BemaniNoteSuccessRates
) {
    const normalize = (value: number) => (value < 0 ? null : value);

    return {
        noteRateStandard: normalize(noteSuccessRate[0]),
        noteRateTenuto: normalize(noteSuccessRate[1]),
        noteRateGlissando: normalize(noteSuccessRate[2]),
        noteRateTrill: normalize(noteSuccessRate[3]),
    };
}

export function getBemaniClearFlag(clearFlag: [number]) {
    return clearFlag[0];
}
