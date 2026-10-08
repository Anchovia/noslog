import "server-only";

import type { Metadata } from "next";

import type { getCachedProfileData } from "@/features/profile/server/public-profile-data";
import { type Locale, localizePath } from "@/lib/i18n/routing";
import type { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";

type ProfileTab =
    "overview" | "records" | "stats" | "achievements" | "activity";

/**
 * 프로필 다섯 탭의 메타데이터(2026-10-01 메타데이터 점검 P1 · A2) — 제목 = 「이름 · 탭」(이름은 머리와 같은 규칙),
 * 공유 이미지 = 공개 프로필의 Basic 카드(점수 비공개면 사이트 기본 이미지 · 설명에서도 점수 말을 뺀다), og:type profile.
 * 검색 노출은 지금처럼 막는다(noindex)
 */
export function createProfileMetadata({
    id,
    profile,
    tab,
    locale,
    t,
}: {
    id: number | null;
    profile: Awaited<ReturnType<typeof getCachedProfileData>>;
    tab: ProfileTab;
    locale: Locale;
    t: Awaited<ReturnType<typeof getServerI18n>>["t"];
}): Metadata {
    if (id === null || !profile)
        return createPageMetadata({
            title: t("profile.fallbackTitle"),
            path: localizePath(
                id === null ? "/profile" : `/profile/${id}`,
                locale
            ),
            noIndex: true,
        });
    const name = profile.user.username || t("common.unnamedUser");
    const tabLabel = {
        overview: t("profile.tabs.overview"),
        records: t("profile.tabs.records"),
        stats: t("profile.tabs.stats"),
        achievements: t("profile.tabs.achievements"),
        activity: t("profile.tabs.activity"),
    }[tab];
    const scoresPublic = !profile.user.hide_play_scores;
    return createPageMetadata({
        title: `${name} · ${tabLabel}`,
        description: scoresPublic
            ? t("profile.metaDescription", { name })
            : t("profile.metaDescriptionPrivate", { name }),
        path: localizePath(
            tab === "overview" ? `/profile/${id}` : `/profile/${id}/${tab}`,
            locale
        ),
        noIndex: true,
        type: "profile",
        image: scoresPublic
            ? {
                  url: localizePath(`/profile/${id}/share-image`, locale),
                  width: 1200,
                  height: 630,
                  alt: t("profile.shareImageAlt", { name }),
              }
            : undefined,
    });
}
