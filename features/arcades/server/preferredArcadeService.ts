import "server-only";

import { revalidatePath, updateTag } from "next/cache";

import type { ActionResult } from "@/lib/actions/result";
import { preferredArcadeSchema } from "@/features/arcades/schemas/preferredArcadeSchema";
import { CACHE_TAGS, getUserProfileTag } from "@/lib/cacheTags";
import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { isLocale, localizePath } from "@/lib/i18n/routing";
import getSession from "@/lib/session";
import { logServerError } from "@/lib/observability/server";

export type PreferredArcadeActionResult = ActionResult;

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

    updateTag(CACHE_TAGS.arcades);
    updateTag(CACHE_TAGS.userProfiles);
    updateTag(getUserProfileTag(session.id));
    revalidatePath("/gamecenter");
    revalidatePath(localizePath("/gamecenter", locale));
    revalidatePath(`/profile/${session.id}`);
    revalidatePath("/profile/settings");

    return {
        success: true,
        message: t("arcades.preferredSaved", { name: arcade.name }),
    };
}
