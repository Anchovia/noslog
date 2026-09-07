import "server-only";

import { cookies } from "next/headers";
import { z } from "zod";
import db from "@/lib/db";
import getSession from "@/lib/session";
import type { ActionResult } from "@/lib/actions/result";
import { LOCALE_COOKIE_NAME, SUPPORTED_LOCALES } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";

export async function saveLocalePreference(
    input: unknown
): Promise<ActionResult> {
    const { t } = await getServerI18n();
    const parsed = z.enum(SUPPORTED_LOCALES).safeParse(input);
    if (!parsed.success)
        return { success: false, message: t("settings.preferenceFailed") };
    try {
        const session = await getSession();
        if (session.id) {
            await db.user.update({
                where: { id: session.id },
                data: { locale: parsed.data },
            });
            session.locale = parsed.data;
            await session.save();
        }
        (await cookies()).set(LOCALE_COOKIE_NAME, parsed.data, {
            httpOnly: false,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 365 * 24 * 60 * 60,
        });
        return { success: true, message: "" };
    } catch {
        return { success: false, message: t("settings.preferenceFailed") };
    }
}
