"use server";

import db from "@/lib/db";
import { getMessages, createTranslator } from "@/lib/i18n/messages";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/routing";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function regenerateSyncToken(requestedLocale?: Locale) {
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const t = createTranslator(getMessages(locale));
    const session = await getSession();
    if (!session.id) {
        return {
            success: false as const,
            message: t("sync.loginRequired"),
        };
    }

    try {
        await db.user.update({
            where: { id: session.id },
            data: { sync_token_version: { increment: 1 } },
        });

        revalidatePath(localizePath("/bookmarklet", locale));
        return {
            success: true as const,
            message: t("sync.regenerateSuccess"),
        };
    } catch (error) {
        console.error("연동 토큰 재발급에 실패했습니다.", error);
        return {
            success: false as const,
            message: t("sync.regenerateError"),
        };
    }
}
