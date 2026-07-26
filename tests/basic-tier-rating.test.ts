import {
    BASIC_RATING_CURVES,
    BASIC_RATING_MAX,
    BASIC_RATING_SCORE_FLOOR,
    BASIC_RATING_TOP_COUNT,
    calculateBasicRating,
    calculateBasicRatingTheoreticalMax,
    getBasicRatingBasePower,
    getBasicRatingCoefficient,
    getBasicRatingMaxContribution,
} from "@/lib/tiers/basicRating";
import { describe, expect, it } from "vitest";

describe("Basic 서열 레이팅", () => {
    it("곡별 최대 기여 점수를 10,000점 기준으로 정규화한다", () => {
        expect(getBasicRatingMaxContribution(10, 1_000)).toBe(1_000);
        expect(getBasicRatingMaxContribution(14.5, 0)).toBe(0);
    });

    it("S 미만 기록에는 포인트를 주지 않는다", () => {
        expect(
            getBasicRatingCoefficient(BASIC_RATING_SCORE_FLOOR - 1, "balanced")
        ).toBe(0);
    });

    it("기준점 사이의 계수를 선형 보간한다", () => {
        expect(getBasicRatingCoefficient(975_000, "balanced")).toBeCloseTo(
            0.59
        );
    });

    it("모든 후보 곡선은 Pianist에서 100%가 된다", () => {
        for (const curveId of Object.keys(BASIC_RATING_CURVES) as Array<
            keyof typeof BASIC_RATING_CURVES
        >) {
            expect(getBasicRatingCoefficient(1_000_000, curveId)).toBe(1);
        }
    });

    it("서열 상수는 제곱 가중치로 변환한다", () => {
        expect(getBasicRatingBasePower(12.5)).toBe(156.25);
        expect(getBasicRatingBasePower(0)).toBe(0);
    });

    it("이론상 만점은 설정된 상위 채보 수만 반영한다", () => {
        const constants = Array.from(
            { length: BASIC_RATING_TOP_COUNT + 20 },
            (_, index) => index + 1
        );
        const expected = constants
            .slice(-BASIC_RATING_TOP_COUNT)
            .reduce((sum, value) => sum + value ** 2, 0);

        expect(calculateBasicRatingTheoreticalMax(constants)).toBe(expected);
    });

    it("이론상 반영 채보를 모두 Pianist하면 10,000점이다", () => {
        const constants = Array.from(
            { length: BASIC_RATING_TOP_COUNT },
            (_, index) => 10 + index / 100
        );
        const theoreticalMax = calculateBasicRatingTheoreticalMax(constants);
        const result = calculateBasicRating(
            constants.map((tierConstant, index) => ({
                chartId: index + 1,
                score: 1_000_000,
                tierConstant,
            })),
            theoreticalMax,
            "balanced"
        );

        expect(result.rating).toBeCloseTo(BASIC_RATING_MAX);
        expect(result.filledSlots).toBe(BASIC_RATING_TOP_COUNT);
    });

    it("같은 채보가 중복되면 더 높은 기여 기록만 사용한다", () => {
        const theoreticalMax = calculateBasicRatingTheoreticalMax([12]);
        const result = calculateBasicRating(
            [
                { chartId: 1, score: 970_000, tierConstant: 12 },
                { chartId: 1, score: 990_000, tierConstant: 12 },
            ],
            theoreticalMax,
            "balanced",
            1
        );

        expect(result.filledSlots).toBe(1);
        expect(result.contributions[0].score).toBe(990_000);
        expect(result.rating).toBeCloseTo(8_200);
    });

    it("반영 곡 수를 채우지 못하면 실제 기여 기록만 집계한다", () => {
        const theoreticalMax = calculateBasicRatingTheoreticalMax(
            Array.from({ length: BASIC_RATING_TOP_COUNT }, () => 12)
        );
        const result = calculateBasicRating(
            [{ chartId: 1, score: 1_000_000, tierConstant: 12 }],
            theoreticalMax,
            "balanced"
        );

        expect(result.filledSlots).toBe(1);
        expect(result.rating).toBeCloseTo(
            BASIC_RATING_MAX / BASIC_RATING_TOP_COUNT
        );
        expect(result.cutlinePoints).toBe(0);
    });
});
