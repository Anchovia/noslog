export function getBestScoreDifference(
    score: number,
    bestScore: number | null
) {
    if (bestScore === null || bestScore <= 0) return null;

    return score - bestScore;
}

export function getTimingBias(
    fastCount: number | null,
    slowCount: number | null
) {
    if (fastCount === null || slowCount === null) return null;

    const difference = fastCount - slowCount;
    if (difference === 0) return "균형";

    return `${difference > 0 ? "FAST" : "SLOW"} +${Math.abs(difference)}`;
}
