import "server-only";

import db from "@/lib/db";
import { getMessages, createTranslator } from "@/lib/i18n/messages";
import { localizePath, type Locale } from "@/lib/i18n/routing";
import type { ActionResult } from "@/lib/actions/result";
import { syncTokenRequestSchema } from "@/features/profile/schemas/syncTokenSchema";
import { logServerError } from "@/lib/observability/server";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";

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
