import "server-only";

import { revalidatePath, updateTag } from "next/cache";

import type { ActionResult } from "@/lib/actions/result";
import { preferredArcadeSchema } from "@/features/arcades/schemas/preferredArcadeSchema";
import { CACHE_TAGS, getUserProfileTag } from "@/lib/cacheTags";
import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/routing";
import getSession from "@/lib/session";
import { logServerError } from "@/lib/observability/server";

export type PreferredArcadeActionResult = ActionResult;

// 선호 오락실이 바뀌면 오락실 목록·프로필·설정이 함께 바뀐다
function invalidatePreferredArcade(userId: number, locale: Locale) {
    updateTag(CACHE_TAGS.arcades);
    updateTag(CACHE_TAGS.userProfiles);
    updateTag(getUserProfileTag(userId));
    revalidatePath("/gamecenter");
    revalidatePath(localizePath("/gamecenter", locale));
    revalidatePath(`/profile/${userId}`);
    revalidatePath("/profile/settings");
}

export async function setPreferredArcade(
    arcadeId: number,
    requestedLocale = "ko"
): Promise<PreferredArcadeActionResult> {
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const t = createTranslator(getMessages(locale));
    const session = await getSession();
    if (!session.id) {
        return {
            success: false,
            message: t("onboarding.error.loginRequired"),
        };
    }
    if (!preferredArcadeSchema.safeParse({ arcadeId }).success) {
        return { success: false, message: t("arcades.error.select") };
    }

    let arcade: { id: number; name: string };
    try {
        const availableArcade = await db.arcade.findFirst({
            where: { id: arcadeId, is_active: true },
            select: { id: true, name: true },
        });
        if (!availableArcade) {
            return {
                success: false,
                message: t("arcades.error.notFound"),
            };
        }

        arcade = availableArcade;
        await db.user.update({
            where: { id: session.id },
            data: { preferred_arcade_id: arcade.id },
        });
    } catch (error) {
        logServerError(error, {
            event: "arcades.preferred.save.failed",
            routePath: "/gamecenter",
            routeType: "action",
        });
        return { success: false, message: t("settings.saveError") };
    }

    invalidatePreferredArcade(session.id, locale);

    return {
        success: true,
        message: t("arcades.preferredSaved", { name: arcade.name }),
    };
}

/**
 * 상세의 채운 하트를 다시 누르면 해제 — 그 오락실이 지금 선호일 때만 비운다.
 * 다른 탭에서 선호를 바꾼 뒤 옛 화면에서 눌러도 새 선호를 지우지 않는다.
 */
export async function clearPreferredArcade(
    arcadeId: number,
    requestedLocale = "ko"
): Promise<PreferredArcadeActionResult> {
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const t = createTranslator(getMessages(locale));
    const session = await getSession();
    if (!session.id) {
        return {
            success: false,
            message: t("onboarding.error.loginRequired"),
        };
    }
    if (!preferredArcadeSchema.safeParse({ arcadeId }).success) {
        return { success: false, message: t("arcades.error.select") };
    }

    try {
        await db.user.updateMany({
            where: { id: session.id, preferred_arcade_id: arcadeId },
            data: { preferred_arcade_id: null },
        });
    } catch (error) {
        logServerError(error, {
            event: "arcades.preferred.clear.failed",
            routePath: "/gamecenter",
            routeType: "action",
        });
        return { success: false, message: t("arcades.unsetPreferredFailed") };
    }

    invalidatePreferredArcade(session.id, locale);

    return { success: true, message: t("arcades.preferredCleared") };
}
