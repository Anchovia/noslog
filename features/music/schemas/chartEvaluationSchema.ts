import { z } from "zod";

const patternScore = z.number().int().min(0).max(4);

// 체감 상수와 다섯 패턴 축의 투표 입력을 한곳에서 검증함
export const chartEvaluationSchema = z.object({
    chartId: z.number().int().positive(),
    perceivedConstant: z
        .number()
        .min(1)
        .max(14)
        .refine((value) => Number.isInteger(value * 10), {
            message: "체감 난이도는 0.1 단위로 입력해 주세요.",
        }),
    stairs: patternScore,
    chord: patternScore,
    trill: patternScore,
    glissando: patternScore,
    repetition: patternScore,
    comment: z
        .string()
        .trim()
        .min(1, "코멘트를 입력해 주세요.")
        .max(120, "코멘트는 120자 이하로 입력해 주세요."),
});

export const chartEvaluationReactionSchema = z.object({
    evaluationId: z.number().int().positive(),
    value: z.union([z.literal(1), z.literal(-1)]),
});

export const chartEvaluationDeleteSchema = z.object({
    evaluationId: z.number().int().positive(),
});

export type ChartEvaluationInput = z.input<typeof chartEvaluationSchema>;
export type ChartEvaluationReactionInput = z.input<
    typeof chartEvaluationReactionSchema
>;
export type ChartEvaluationDeleteInput = z.input<
    typeof chartEvaluationDeleteSchema
>;
