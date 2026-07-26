export const PEER_GRADE_RANGE = 200;
export const PEER_STORED_GRADE_RANGE = PEER_GRADE_RANGE * 100;
export const MIN_PEER_SCORE_SAMPLE = 5;

export interface PeerScoreComparison {
    averageScore: number;
    sampleCount: number;
    gradeRange: number;
}

export function buildPeerScoreComparison(
    averageScore: number | null,
    sampleCount: number
): PeerScoreComparison | null {
    if (averageScore === null || sampleCount < MIN_PEER_SCORE_SAMPLE) {
        return null;
    }

    return {
        averageScore: Math.round(averageScore),
        sampleCount,
        gradeRange: PEER_GRADE_RANGE,
    };
}
