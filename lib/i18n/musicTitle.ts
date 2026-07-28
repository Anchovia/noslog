import db from "@/lib/db";

import type { Locale } from "./routing";

export async function getMusicTitleDisplayPreference(
    userId: number | null | undefined
) {
    if (!userId) return true;

    const user = await db.user.findUnique({
        where: { id: userId },
        select: { show_localized_music_title: true },
    });

    return user?.show_localized_music_title ?? true;
}

export function getLocalizedMusicTitle(
    music: {
        title: string;
        title_kana: string;
        translations?: {
            locale: string;
            title: string;
            status: string;
        }[];
    },
    locale: Locale,
    showLocalizedTitle: boolean
) {
    if (!showLocalizedTitle) return null;

    const localizedTitle =
        locale === "ja"
            ? music.title_kana
            : music.translations?.find(
                  (translation) =>
                      translation.locale === locale &&
                      translation.status === "approved"
              )?.title;

    const normalizedTitle = localizedTitle?.trim();
    return normalizedTitle && normalizedTitle !== music.title
        ? normalizedTitle
        : null;
}
