"use server";

import {
    submitChartEvaluation as submitChartEvaluationService,
    toggleChartEvaluationReaction as toggleChartEvaluationReactionService,
    deleteChartEvaluation as deleteChartEvaluationService,
} from "@/features/music/server/chartEvaluationService";
import type { Locale } from "@/lib/i18n/routing";
import type {
    ChartEvaluationInput,
    ChartEvaluationReactionInput,
    ChartEvaluationDeleteInput,
} from "@/features/music/schemas/chartEvaluationSchema";

export async function submitChartEvaluation(
    input: ChartEvaluationInput,
    requestedLocale?: Locale
) {
    return submitChartEvaluationService(input, requestedLocale);
}

export async function toggleChartEvaluationReaction(
    input: ChartEvaluationReactionInput,
    requestedLocale?: Locale
) {
    return toggleChartEvaluationReactionService(input, requestedLocale);
}

export async function deleteChartEvaluation(
    input: ChartEvaluationDeleteInput,
    requestedLocale?: Locale
) {
    return deleteChartEvaluationService(input, requestedLocale);
}
