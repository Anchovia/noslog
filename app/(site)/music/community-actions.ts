"use server";

import { updateTag } from "next/cache";

import { communityTranslateInputSchema } from "@/features/music/schemas/community-schema";
import { mutateChartCommunity } from "@/features/music/server/community-mutation";
import { getCommunityTranslation } from "@/features/music/server/community-translation";
import type { ActionResult } from "@/lib/actions/result";
import { ApiError } from "@/lib/api/response";
import { getChartEvaluationTag } from "@/lib/cache-tags";
import { translatorFor } from "@/lib/i18n/messages";
import { logServerError } from "@/lib/observability/server";
import getSession from "@/lib/session";

// 모두에게 같은 캐시(패턴 요약 · 목표 투표)를 바꾸는 쓰기 — 의견 · 답글 · 좋아요 · 신고는 그 캐시에 없다(2026-10-16 K1)
const SHARED_CACHE_ACTIONS = new Set([
    "save-evaluation",
    "delete-evaluation",
    "save-vote",
    "delete-vote",
]);

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
    const t = translatorFor(requestedLocale);
    const session = await getSession();
    if (!session.id)
        return { success: false, message: t("community.action.login") };
    const userId = session.id;
    try {
        const result = await mutateChartCommunity(input, userId);
        const action = (input as { action?: unknown }).action;
        if (typeof action === "string" && SHARED_CACHE_ACTIONS.has(action))
            updateTag(getChartEvaluationTag(result.chartId));
        return {
            success: true,
            message: t("community.action.saved"),
            ...result,
        };
    } catch (error) {
        if (error instanceof ApiError && error.code === "dailyLimit")
            return { success: false, message: t("community.dailyLimit") };
        if (error instanceof ApiError && error.code === "rateLimited")
            return { success: false, message: t("common.tooManyRequests") };
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

// 의견 · 답글 번역(2026-09-22 T1) — 손님은 저장된 번역만, 새 번역은 로그인한 사람만 만든다. 실패하면 원문을 그대로 둔다
export async function translateChartContribution(
    input: unknown,
    requestedLocale: string
): Promise<ActionResult<{ text: string }>> {
    const t = translatorFor(requestedLocale);
    const parsed = communityTranslateInputSchema.safeParse(input);
    if (!parsed.success)
        return { success: false, message: t("community.translateFailed") };
    const session = await getSession();
    try {
        const text = await getCommunityTranslation({
            ...parsed.data,
            userId: session.id ?? null,
        });
        return { success: true, message: "", text };
    } catch (error) {
        if (error instanceof ApiError && error.code === "login")
            return { success: false, message: t("community.action.login") };
        if (error instanceof ApiError && error.code === "dailyLimit")
            return { success: false, message: t("community.dailyLimit") };
        if (!(error instanceof ApiError))
            logServerError(error, {
                event: "music-community.translate.failed",
            });
        return { success: false, message: t("community.translateFailed") };
    }
}
