"use server";

import { revalidatePath, updateTag } from "next/cache";

import { CACHE_TAGS, getUserProfileTag } from "@/lib/cacheTags";
import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { isLocale, localizePath } from "@/lib/i18n/routing";
import getSession from "@/lib/session";

export type PreferredArcadeActionResult =
    { success: true; message: string } | { success: false; message: string };

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
    if (!Number.isInteger(arcadeId)) {
        return { success: false, message: t("arcades.error.select") };
    }

    const arcade = await db.arcade.findFirst({
        where: { id: arcadeId, is_active: true },
        select: { id: true, name: true },
    });
    if (!arcade) {
        return {
            success: false,
            message: t("arcades.error.notFound"),
        };
    }

    await db.user.update({
        where: { id: session.id },
        data: { preferred_arcade_id: arcade.id },
    });

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
