"use server";

import type {
    ChartEvaluationDeleteInput,
    ChartEvaluationInput,
    ChartEvaluationReactionInput,
} from "@/features/music/schemas/chart-evaluation-schema";
import {
    deleteChartEvaluation as deleteChartEvaluationService,
    submitChartEvaluation as submitChartEvaluationService,
    toggleChartEvaluationReaction as toggleChartEvaluationReactionService,
} from "@/features/music/server/chart-evaluation-service";
import type { Locale } from "@/lib/i18n/routing";

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
