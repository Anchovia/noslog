import type { Metadata } from "next";
import {
    getPathLocale,
    localizePath,
    SUPPORTED_LOCALES,
    type Locale,
} from "@/lib/i18n/routing";

export const SITE_NAME = "NosLog";
export const SITE_URL =
    process.env.APP_URL?.trim().replace(/\/$/, "") || "https://noslog.app";
export const SITE_DESCRIPTION =
    "노스텔지어(NOSTALGIA) 플레이 기록, 유저 랭킹, 악곡 서열표, 검정과 빙고 정보를 확인하는 기록 아카이브";
const SITE_DESCRIPTIONS: Record<Locale, string> = {
    ko: SITE_DESCRIPTION,
    ja: "NOSTALGIAのプレー記録、ユーザーランキング、難易度表、検定、ビンゴ情報を確認できる記録アーカイブ",
    en: "A records archive for NOSTALGIA play data, user rankings, tiers, exams, and bingo.",
};
const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
    ko: "ko_KR",
    ja: "ja_JP",
    en: "en_US",
};

interface PageMetadataOptions {
    title?: string;
    description?: string;
    path: string;
    noIndex?: boolean;
}

export function createPageMetadata({
    title,
    description,
    path,
    noIndex = false,
}: PageMetadataOptions): Metadata {
    const locale = getPathLocale(path) ?? "ko";
    const localizedDescription = description ?? SITE_DESCRIPTIONS[locale];
    const localizedPath = getPathLocale(path);
    const barePath = localizedPath
        ? path.slice(localizedPath.length + 1) || "/"
        : path;
    const languageAlternates = localizedPath
        ? Object.fromEntries(
              SUPPORTED_LOCALES.map((item) => [
                  item,
                  localizePath(barePath, item),
              ])
          )
        : undefined;

    return {
        title,
        description: localizedDescription,
        alternates: {
            canonical: path,
            languages: languageAlternates,
        },
        openGraph: {
            type: "website",
            locale: OPEN_GRAPH_LOCALES[locale],
            url: path,
            siteName: SITE_NAME,
            title: title ? `${title} | ${SITE_NAME}` : SITE_NAME,
            description: localizedDescription,
        },
        twitter: {
            card: "summary_large_image",
            title: title ? `${title} | ${SITE_NAME}` : SITE_NAME,
            description: localizedDescription,
        },
        ...(noIndex
            ? {
                  robots: {
                      index: false,
                      follow: false,
                      noarchive: true,
                  },
              }
            : {}),
    };
}
