import { z } from "zod";

import type { createTranslator } from "@/lib/i18n/messages";

type Translator = ReturnType<typeof createTranslator>;

export function createChartEvaluationSchema(t: Translator) {
    const patternMessage = t("music.tier.patternMissing");
    const patternScoreSchema = z
        .number({ error: patternMessage })
        .int(patternMessage)
        .min(0, patternMessage)
        .max(4, patternMessage);

    return z.object({
        chartId: z.number().int().positive(),
        perceivedConstant: z
            .number({ error: t("music.tier.required") })
            .min(1, t("music.tier.min"))
            .max(14, t("music.tier.max"))
            .refine((value) => Number.isInteger(value * 10), {
                message: t("music.tier.step"),
            }),
        stairs: patternScoreSchema,
        chord: patternScoreSchema,
        trill: patternScoreSchema,
        glissando: patternScoreSchema,
        repetition: patternScoreSchema,
        comment: z
            .string({ error: t("music.tier.commentRequired") })
            .trim()
            .min(1, t("music.tier.commentRequired"))
            .max(120, t("music.tier.commentMax")),
    });
}

export function createChartEvaluationFormSchema(t: Translator) {
    const schema = createChartEvaluationSchema(t).omit({ chartId: true });
    // RHF starts unselected radios at null; successful parsing always returns a number.
    const patternScoreSchema = schema.shape.stairs
        .nullable()
        .pipe(schema.shape.stairs);

    return schema.extend({
        stairs: patternScoreSchema,
        chord: patternScoreSchema,
        trill: patternScoreSchema,
        glissando: patternScoreSchema,
        repetition: patternScoreSchema,
        // Preserve the input's raw 120-character limit before server normalization.
        comment: z
            .string({ error: t("music.tier.commentRequired") })
            .max(120, t("music.tier.commentMax"))
            .pipe(schema.shape.comment),
    });
}

export type ChartEvaluationFormValues = z.input<
    ReturnType<typeof createChartEvaluationFormSchema>
>;
export type ChartEvaluationValues = z.output<
    ReturnType<typeof createChartEvaluationFormSchema>
>;

export function createChartEvaluationInput(
    chartId: number,
    values: ChartEvaluationValues
): ChartEvaluationInput {
    return { chartId, ...values };
}

export const chartEvaluationReactionSchema = z.object({
    evaluationId: z.number().int().positive(),
    value: z.union([z.literal(1), z.literal(-1)]),
});

export const chartEvaluationDeleteSchema = z.object({
    evaluationId: z.number().int().positive(),
});

export type ChartEvaluationInput = z.input<
    ReturnType<typeof createChartEvaluationSchema>
>;
export type ChartEvaluationReactionInput = z.input<
    typeof chartEvaluationReactionSchema
>;
export type ChartEvaluationDeleteInput = z.input<
    typeof chartEvaluationDeleteSchema
>;
