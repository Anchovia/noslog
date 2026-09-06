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

export async function saveChartContribution(
    input: unknown,
    requestedLocale: string
): Promise<
    ActionResult<{ chartId: number; helpfulCount?: number; selected?: boolean }>
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
