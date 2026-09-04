import "server-only";

import db from "@/lib/db";
import { CACHE_TAGS } from "@/lib/cacheTags";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/routing";
import getSession from "@/lib/session";
import { revalidatePath, updateTag } from "next/cache";
import type { ActionResult } from "@/lib/actions/result";
import {
    chartEvaluationDeleteSchema,
    chartEvaluationReactionSchema,
    createChartEvaluationSchema,
    type ChartEvaluationDeleteInput,
    type ChartEvaluationInput,
    type ChartEvaluationReactionInput,
} from "@/features/music/schemas/chartEvaluationSchema";

type EvaluationActionResult = ActionResult;

// 사용자별 채보 투표를 최초 등록하거나 기존 값으로 갱신함
export async function submitChartEvaluation(
    input: ChartEvaluationInput,
    requestedLocale?: Locale
): Promise<EvaluationActionResult> {
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const t = createTranslator(getMessages(locale));
    const session = await getSession();

    if (!session.id) {
        return { success: false, message: t("music.action.voteLogin") };
    }

    const parsed = createChartEvaluationSchema(t).safeParse(input);

    if (!parsed.success) {
        return {
            success: false,
            message: t("music.action.voteInvalid"),
        };
    }

    const chart = await db.musicChart.findUnique({
        where: { id: parsed.data.chartId },
        select: { id: true, music_idx: true, difficulty: true },
    });

    if (!chart) {
        return { success: false, message: t("music.action.chartNotFound") };
    }

    const playData = await db.playData.findFirst({
        where: {
            chart_id: chart.id,
            user_id: session.id,
            score: { gt: 0 },
        },
        select: { id: true },
    });

    if (!playData) {
        return {
            success: false,
            message: t("music.action.playRequired"),
        };
    }

    const data = {
        perceived_constant: parsed.data.perceivedConstant,
        stairs: parsed.data.stairs,
        chord: parsed.data.chord,
        trill: parsed.data.trill,
        glissando: parsed.data.glissando,
        repetition: parsed.data.repetition,
        comment: parsed.data.comment,
    };

    await db.chartEvaluation.upsert({
        where: {
            chart_id_user_id: {
                chart_id: chart.id,
                user_id: session.id,
            },
        },
        create: {
            ...data,
            chart_id: chart.id,
            user_id: session.id,
        },
        update: data,
    });

    updateTag(CACHE_TAGS.chartEvaluations);
    const chartPath = `/music/${chart.music_idx}/${chart.difficulty.toLowerCase()}`;
    revalidatePath(chartPath);
    revalidatePath(localizePath(chartPath, locale));

    return { success: true, message: t("music.action.voteSaved") };
}

// 같은 반응을 다시 누르면 취소하고 다른 반응이면 값을 교체함
export async function toggleChartEvaluationReaction(
    input: ChartEvaluationReactionInput,
    requestedLocale?: Locale
): Promise<EvaluationActionResult> {
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const t = createTranslator(getMessages(locale));
    const session = await getSession();

    if (!session.id) {
        return { success: false, message: t("music.action.reactionLogin") };
    }

    const parsed = chartEvaluationReactionSchema.safeParse(input);

    if (!parsed.success) {
        return { success: false, message: t("music.action.reactionInvalid") };
    }

    const evaluation = await db.chartEvaluation.findUnique({
        where: { id: parsed.data.evaluationId },
        select: {
            id: true,
            chart: { select: { music_idx: true, difficulty: true } },
        },
    });

    if (!evaluation) {
        return { success: false, message: t("music.action.opinionNotFound") };
    }

    const existing = await db.chartEvaluationReaction.findUnique({
        where: {
            evaluation_id_user_id: {
                evaluation_id: evaluation.id,
                user_id: session.id,
            },
        },
        select: { id: true, value: true },
    });

    if (existing?.value === parsed.data.value) {
        await db.chartEvaluationReaction.delete({
            where: { id: existing.id },
        });
    } else {
        await db.chartEvaluationReaction.upsert({
            where: {
                evaluation_id_user_id: {
                    evaluation_id: evaluation.id,
                    user_id: session.id,
                },
            },
            create: {
                evaluation_id: evaluation.id,
                user_id: session.id,
                value: parsed.data.value,
            },
            update: { value: parsed.data.value },
        });
    }

    updateTag(CACHE_TAGS.chartEvaluations);
    const chartPath = `/music/${evaluation.chart.music_idx}/${evaluation.chart.difficulty.toLowerCase()}`;
    revalidatePath(chartPath);
    revalidatePath(localizePath(chartPath, locale));

    return { success: true, message: t("music.action.reactionSaved") };
}

// 사용자가 제출한 체감 난이도, 패턴 투표와 의견을 함께 삭제함
export async function deleteChartEvaluation(
    input: ChartEvaluationDeleteInput,
    requestedLocale?: Locale
): Promise<EvaluationActionResult> {
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const t = createTranslator(getMessages(locale));
    const session = await getSession();

    if (!session.id) {
        return { success: false, message: t("music.action.deleteLogin") };
    }

    const parsed = chartEvaluationDeleteSchema.safeParse(input);

    if (!parsed.success) {
        return { success: false, message: t("music.action.deleteInvalid") };
    }

    const evaluation = await db.chartEvaluation.findFirst({
        where: {
            id: parsed.data.evaluationId,
            user_id: session.id,
        },
        select: {
            id: true,
            chart: { select: { music_idx: true, difficulty: true } },
        },
    });

    if (!evaluation) {
        return {
            success: false,
            message: t("music.action.deleteNotFound"),
        };
    }

    await db.chartEvaluation.delete({ where: { id: evaluation.id } });

    updateTag(CACHE_TAGS.chartEvaluations);
    const chartPath = `/music/${evaluation.chart.music_idx}/${evaluation.chart.difficulty.toLowerCase()}`;
    revalidatePath(chartPath);
    revalidatePath(localizePath(chartPath, locale));

    return { success: true, message: t("music.action.deleted") };
}
