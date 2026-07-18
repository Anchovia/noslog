import { describe, expect, it } from "vitest";

import {
    chartEvaluationReactionSchema,
    chartEvaluationSchema,
} from "@/app/(nevigation)/music/[index]/[difficulty]/evaluationSchema";

const validEvaluation = {
    chartId: 1,
    perceivedConstant: 12,
    stairs: 0,
    chord: 1,
    trill: 2,
    glissando: 3,
    repetition: 4,
    comment: "패턴이 고르게 구성되어 있습니다.",
};

describe("chartEvaluationSchema", () => {
    it("올바른 체감 난이도와 다섯 패턴 값을 허용한다", () => {
        expect(chartEvaluationSchema.safeParse(validEvaluation).success).toBe(
            true
        );
    });

    it.each([
        {
            override: { perceivedConstant: 12.05 },
            label: "0.1 단위가 아닌 값",
        },
        { override: { perceivedConstant: 14.1 }, label: "범위를 벗어난 값" },
        { override: { stairs: 5 }, label: "패턴 범위를 벗어난 값" },
        { override: { comment: "" }, label: "빈 코멘트" },
        { override: { comment: "a".repeat(121) }, label: "너무 긴 코멘트" },
    ])("$label 입력을 거부한다", ({ override }) => {
        expect(
            chartEvaluationSchema.safeParse({
                ...validEvaluation,
                ...override,
            }).success
        ).toBe(false);
    });
});

describe("chartEvaluationReactionSchema", () => {
    it("추천과 비추천만 허용한다", () => {
        expect(
            chartEvaluationReactionSchema.safeParse({
                evaluationId: 1,
                value: 1,
            }).success
        ).toBe(true);
        expect(
            chartEvaluationReactionSchema.safeParse({
                evaluationId: 1,
                value: 0,
            }).success
        ).toBe(false);
    });
});
