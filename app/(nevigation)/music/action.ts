"use server";

import { getMusicPage } from "./data";
import type { MusicSearchParams } from "./query";
import getSession from "@/lib/session";
import { getRequestLocale } from "@/lib/i18n/server";
import { getMusicTitleDisplayPreference } from "@/lib/i18n/musicTitle";

export async function getMoreMusics(
    cursor: string,
    searchParams: MusicSearchParams
) {
    const [session, locale] = await Promise.all([
        getSession(),
        getRequestLocale(),
    ]);
    const showLocalizedTitle = await getMusicTitleDisplayPreference(session.id);
    return getMusicPage(
        searchParams,
        cursor,
        session.id ?? null,
        locale,
        showLocalizedTitle
    );
}
