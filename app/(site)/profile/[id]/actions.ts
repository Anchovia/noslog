"use server";

import { redirect } from "next/navigation";

import { type Locale, localizePath } from "@/lib/i18n/routing";
import getSession from "@/lib/session";

export async function logout(locale: Locale) {
    const session = await getSession();
    session.destroy();
    redirect(localizePath("/", locale));
}
