import "server-only";

import { revalidatePath } from "next/cache";

import { syncTokenRequestSchema } from "@/features/profile/schemas/sync-token-schema";
import type { ActionResult } from "@/lib/actions/result";
import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { type Locale, localizePath } from "@/lib/i18n/routing";
import { logServerError } from "@/lib/observability/server";
import getSession from "@/lib/session";

export async function regenerateSyncToken(
    requestedLocale?: Locale
): Promise<ActionResult> {
    const { locale } = syncTokenRequestSchema.parse({
        locale: requestedLocale,
    });
    const t = createTranslator(getMessages(locale));
    const session = await getSession();
    if (!session.id) {
        return {
            success: false,
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
            success: true,
            message: t("sync.regenerateSuccess"),
        };
    } catch (error) {
        logServerError(error, {
            event: "profile.sync-token.regenerate.failed",
            routePath: "/bookmarklet",
            routeType: "action",
        });
        return {
            success: false,
            message: t("sync.regenerateError"),
        };
    }
}
