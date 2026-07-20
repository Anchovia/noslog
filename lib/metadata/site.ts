import type { Metadata } from "next";

export const SITE_NAME = "NosLog";
export const SITE_URL =
    process.env.APP_URL?.trim().replace(/\/$/, "") || "https://noslog.app";
export const SITE_DESCRIPTION =
    "노스텔지어(NOSTALGIA) 플레이 기록, 유저 랭킹, 악곡 서열표, 검정과 빙고 정보를 확인하는 기록 아카이브";

interface PageMetadataOptions {
    title?: string;
    description?: string;
    path: string;
    noIndex?: boolean;
}

export function createPageMetadata({
    title,
    description = SITE_DESCRIPTION,
    path,
    noIndex = false,
}: PageMetadataOptions): Metadata {
    return {
        title,
        description,
        alternates: { canonical: path },
        openGraph: {
            type: "website",
            locale: "ko_KR",
            url: path,
            siteName: SITE_NAME,
            title: title ? `${title} | ${SITE_NAME}` : SITE_NAME,
            description,
        },
        twitter: {
            card: "summary_large_image",
            title: title ? `${title} | ${SITE_NAME}` : SITE_NAME,
            description,
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
