import db from "@/lib/db";
import { getSessionUser } from "@/lib/user";

import type { Locale } from "./routing";

export async function getMusicTitleDisplayPreference(
    userId: number | null | undefined
) {
    if (!userId) return true;

    // 로그인한 본인이면 레이아웃이 이미 읽은 행을 쓴다(React cache) — 같은 요청에서 User 를 다시 읽지 않게(2026-10-15 S6)
    const { user: sessionUser } = await getSessionUser();
    if (sessionUser?.id === userId)
        return sessionUser.show_localized_music_title ?? true;

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
