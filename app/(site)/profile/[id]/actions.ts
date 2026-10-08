"use server";

import getSession from "@/lib/session";
import { localizePath, type Locale } from "@/lib/i18n/routing";
import { redirect } from "next/navigation";

export async function logout(locale: Locale) {
    const session = await getSession();
    session.destroy();
    redirect(localizePath("/", locale));
}
