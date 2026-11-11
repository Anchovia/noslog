"use server";

import { redirect } from "next/navigation";

import { endUserSessions } from "@/features/users/server/user-session-service";
import { type Locale, localizePath } from "@/lib/i18n/routing";
import getSession from "@/lib/session";

export async function logout(locale: Locale) {
    const session = await getSession();
    if (session.id) await endUserSessions(session.id);
    session.destroy();
    redirect(localizePath("/", locale));
}
