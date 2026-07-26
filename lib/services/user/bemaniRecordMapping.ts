export type BemaniJudgeCounts = [number, number, number, number, number];

export type BemaniNoteSuccessRates = [number, number, number, number];

export function normalizeBemaniRank(rank: string) {
    return rank.toUpperCase();
}

export function mapBemaniJudgeCounts(judge: BemaniJudgeCounts) {
    return {
        judge_sjust: judge[0],
        judge_just: judge[1],
        judge_good: judge[2],
        judge_miss: judge[3],
        judge_near: judge[4],
    };
}

export function mapBemaniNoteSuccessRates(
    noteSuccessRate: BemaniNoteSuccessRates
) {
    const normalize = (value: number) => (value < 0 ? null : value);

    return {
        note_rate_standard: normalize(noteSuccessRate[0]),
        note_rate_tenuto: normalize(noteSuccessRate[1]),
        note_rate_glissando: normalize(noteSuccessRate[2]),
        note_rate_trill: normalize(noteSuccessRate[3]),
    };
}

export function getBemaniClearFlag(clearFlag: [number]) {
    return clearFlag[0];
}
