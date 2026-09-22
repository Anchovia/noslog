"use server";

import { updateTag } from "next/cache";
import { ApiError } from "@/lib/api/response";
import type { ActionResult } from "@/lib/actions/result";
import { CACHE_TAGS } from "@/lib/cacheTags";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { isLocale } from "@/lib/i18n/routing";
import { logServerError } from "@/lib/observability/server";
import getSession from "@/lib/session";
import { mutateChartCommunity } from "@/features/music/server/communityMutation";
import { getCommunityTranslation } from "@/features/music/server/communityTranslation";
import { communityTranslateInputSchema } from "@/features/music/schemas/communitySchema";

export async function saveChartContribution(
    input: unknown,
    requestedLocale: string
): Promise<
    ActionResult<{
        chartId: number;
        helpfulCount?: number;
        selected?: boolean;
        evaluationId?: number;
        likeCount?: number;
    }>
> {
    const t = createTranslator(
        getMessages(isLocale(requestedLocale) ? requestedLocale : "ko")
    );
    const session = await getSession();
    if (!session.id)
        return { success: false, message: t("community.action.login") };
    try {
        const result = await mutateChartCommunity(input, session.id);
        updateTag(CACHE_TAGS.chartEvaluations);
        return {
            success: true,
            message: t("community.action.saved"),
            ...result,
        };
    } catch (error) {
        if (
            error instanceof ApiError &&
            (error.code === "invalid" ||
                error.code === "ineligible" ||
                error.code === "unavailable")
        ) {
            return {
                success: false,
                message: t(`community.action.${error.code}`),
            };
        }
        logServerError(error, { event: "music-community.save.failed" });
        return { success: false, message: t("community.action.failed") };
    }
}

// 의견 · 답글 번역(2026-09-22 T1) — 로그인 없이도(저장된 번역을 나눠 쓴다). 실패하면 원문을 그대로 둔다
export async function translateChartContribution(
    input: unknown,
    requestedLocale: string
): Promise<ActionResult<{ text: string }>> {
    const t = createTranslator(
        getMessages(isLocale(requestedLocale) ? requestedLocale : "ko")
    );
    const parsed = communityTranslateInputSchema.safeParse(input);
    if (!parsed.success)
        return { success: false, message: t("community.translateFailed") };
    try {
        const text = await getCommunityTranslation(parsed.data);
        return { success: true, message: "", text };
    } catch (error) {
        if (!(error instanceof ApiError))
            logServerError(error, {
                event: "music-community.translate.failed",
            });
        return { success: false, message: t("community.translateFailed") };
    }
}
