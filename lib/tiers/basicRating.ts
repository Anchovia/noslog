export const BASIC_RATING_MAX = 10_000;
export const BASIC_RATING_TOP_COUNT = 100;
export const BASIC_RATING_SCORE_FLOOR = 950_000;
export const BASIC_RATING_SCORE_MAX = 1_000_000;
export const BASIC_RATING_TIER_EXPONENT = 2;

interface BasicRatingCurve {
    label: string;
    description: string;
    anchors: ReadonlyArray<readonly [score: number, coefficient: number]>;
}

export const BASIC_RATING_CURVES = {
    accessible: {
        label: "완만형",
        description: "S 달성부터 비교적 많은 포인트를 주는 성장 중심 곡선",
        anchors: [
            [950_000, 0.45],
            [960_000, 0.55],
            [970_000, 0.66],
            [980_000, 0.78],
            [990_000, 0.89],
            [1_000_000, 1],
        ],
    },
    balanced: {
        label: "균형형",
        description: "고득점 구간으로 갈수록 상승 폭이 커지는 기준 곡선",
        anchors: [
            [950_000, 0.3],
            [960_000, 0.4],
            [970_000, 0.52],
            [980_000, 0.66],
            [990_000, 0.82],
            [1_000_000, 1],
        ],
    },
    mastery: {
        label: "숙련형",
        description:
            "990,000점과 Pianist 성과를 강하게 평가하는 상위 집중 곡선",
        anchors: [
            [950_000, 0.15],
            [960_000, 0.23],
            [970_000, 0.34],
            [980_000, 0.5],
            [990_000, 0.72],
            [1_000_000, 1],
        ],
    },
} as const satisfies Record<string, BasicRatingCurve>;

export type BasicRatingCurveId = keyof typeof BASIC_RATING_CURVES;

export interface BasicRatingRecord {
    chartId: number;
    score: number;
    tierConstant: number;
}

export interface BasicRatingContribution extends BasicRatingRecord {
    coefficient: number;
    basePower: number;
    points: number;
}

export interface BasicRatingResult {
    rating: number;
    rawTotal: number;
    theoreticalMax: number;
    filledSlots: number;
    cutlinePoints: number;
    contributions: BasicRatingContribution[];
}

export function getBasicRatingCoefficient(
    score: number,
    curveId: BasicRatingCurveId
) {
    if (!Number.isFinite(score) || score < BASIC_RATING_SCORE_FLOOR) {
        return 0;
    }
    if (score >= BASIC_RATING_SCORE_MAX) return 1;

    const anchors = BASIC_RATING_CURVES[curveId].anchors;
    for (let index = 1; index < anchors.length; index += 1) {
        const [upperScore, upperCoefficient] = anchors[index];
        if (score > upperScore) continue;

        const [lowerScore, lowerCoefficient] = anchors[index - 1];
        const progress = (score - lowerScore) / (upperScore - lowerScore);
        return (
            lowerCoefficient + (upperCoefficient - lowerCoefficient) * progress
        );
    }

    return 1;
}

export function getBasicRatingBasePower(tierConstant: number) {
    if (!Number.isFinite(tierConstant) || tierConstant <= 0) return 0;
    return tierConstant ** BASIC_RATING_TIER_EXPONENT;
}

export function calculateBasicRatingTheoreticalMax(
    tierConstants: number[],
    topCount = BASIC_RATING_TOP_COUNT
) {
    if (!Number.isInteger(topCount) || topCount <= 0) {
        throw new RangeError("반영 채보 수는 1 이상의 정수여야 합니다.");
    }

    return tierConstants
        .map(getBasicRatingBasePower)
        .filter((power) => power > 0)
        .sort((left, right) => right - left)
        .slice(0, topCount)
        .reduce((sum, power) => sum + power, 0);
}

export function calculateBasicRating(
    records: BasicRatingRecord[],
    theoreticalMax: number,
    curveId: BasicRatingCurveId,
    topCount = BASIC_RATING_TOP_COUNT
): BasicRatingResult {
    if (!Number.isFinite(theoreticalMax) || theoreticalMax <= 0) {
        throw new RangeError("이론상 만점의 원시 합계가 필요합니다.");
    }
    if (!Number.isInteger(topCount) || topCount <= 0) {
        throw new RangeError("반영 채보 수는 1 이상의 정수여야 합니다.");
    }

    const contributionByChart = new Map<number, BasicRatingContribution>();

    for (const record of records) {
        const coefficient = getBasicRatingCoefficient(record.score, curveId);
        const basePower = getBasicRatingBasePower(record.tierConstant);
        const points = basePower * coefficient;
        if (points <= 0) continue;

        const contribution = {
            ...record,
            coefficient,
            basePower,
            points,
        };
        const current = contributionByChart.get(record.chartId);
        if (!current || contribution.points > current.points) {
            contributionByChart.set(record.chartId, contribution);
        }
    }

    const contributions = [...contributionByChart.values()]
        .sort(
            (left, right) =>
                right.points - left.points || left.chartId - right.chartId
        )
        .slice(0, topCount);
    const rawTotal = contributions.reduce(
        (sum, contribution) => sum + contribution.points,
        0
    );

    return {
        rating: Math.min(
            BASIC_RATING_MAX,
            (rawTotal / theoreticalMax) * BASIC_RATING_MAX
        ),
        rawTotal,
        theoreticalMax,
        filledSlots: contributions.length,
        cutlinePoints:
            contributions.length === topCount
                ? (contributions.at(-1)?.points ?? 0)
                : 0,
        contributions,
    };
}
