import type { Metadata } from "next";

import { serverEnv } from "@/lib/env/server";
import {
    getPathLocale,
    type Locale,
    localizePath,
    SUPPORTED_LOCALES,
} from "@/lib/i18n/routing";

export const SITE_NAME = "NosLog";
export const SITE_URL =
    serverEnv.APP_URL?.replace(/\/$/, "") || "https://noslog.app";
// 설명은 그 페이지를 요약한다(Google 메타 설명 · 2026-10-01 메타데이터 점검 B) — 이 값은 홈과 설명이 없는 페이지에만
export const SITE_DESCRIPTION =
    "NOSTALGIA 플레이 기록을 연동해 Grd · 레이팅 · 순위를 보고, 악곡 서열표 · 검정 · 빙고 · 오락실 정보를 찾는 비공식 기록 사이트입니다.";
const SITE_DESCRIPTIONS: Record<Locale, string> = {
    ko: SITE_DESCRIPTION,
    ja: "NOSTALGIAのプレー記録を連携してGrd・レーティング・順位を確認し、楽曲の難易度表・検定・ビンゴ・ゲームセンター情報を探せる非公式の記録サイトです。",
    en: "An unofficial NOSTALGIA records site: sync your plays to see your Grd, rating and ranks, and browse tier lists, exams, bingo and arcades.",
};
const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
    ko: "ko_KR",
    ja: "ja_JP",
    en: "en_US",
};
const SOCIAL_IMAGE_ALTS: Record<Locale, string> = {
    ko: "NosLog — NOSTALGIA 기록 · 랭킹 · 서열표",
    ja: "NosLog — NOSTALGIAの記録・ランキング・難易度表",
    en: "NosLog — NOSTALGIA records, rankings and tier lists",
};

export interface SocialImage {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
}

/** 사이트 기본 공유 이미지(app/opengraph-image) — 페이지가 openGraph 를 쓰면 상위 이미지가 통째로 지워지므로 늘 직접 넣는다(Next.js 메타데이터 병합) */
export function defaultSocialImage(locale: Locale): SocialImage {
    return {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: SOCIAL_IMAGE_ALTS[locale],
    };
}

interface PageMetadataOptions {
    title?: string;
    description?: string;
    path: string;
    noIndex?: boolean;
    /** 공유 이미지 — 없으면 사이트 기본 이미지 */
    image?: SocialImage;
    /** 정사각 이미지(자켓 등)는 작은 카드 `summary` */
    imageCard?: "summary" | "summary_large_image";
    type?: "website" | "profile";
}

export function createPageMetadata({
    title,
    description,
    path,
    noIndex = false,
    image,
    imageCard = "summary_large_image",
    type = "website",
}: PageMetadataOptions): Metadata {
    const locale = getPathLocale(path) ?? "ko";
    const localizedDescription = description ?? SITE_DESCRIPTIONS[locale];
    const localizedPath = getPathLocale(path);
    const barePath = localizedPath
        ? path.slice(localizedPath.length + 1) || "/"
        : path;
    // 언어가 맞지 않으면 언어 없는 주소로 — 프록시가 브라우저 언어로 보내 준다(x-default)
    const languageAlternates = localizedPath
        ? {
              ...Object.fromEntries(
                  SUPPORTED_LOCALES.map((item) => [
                      item,
                      localizePath(barePath, item),
                  ])
              ),
              "x-default": barePath,
          }
        : undefined;
    const socialTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const socialImage = image ?? defaultSocialImage(locale);

    return {
        title,
        description: localizedDescription,
        alternates: {
            canonical: path,
            languages: languageAlternates,
        },
        openGraph: {
            type,
            locale: OPEN_GRAPH_LOCALES[locale],
            alternateLocale: SUPPORTED_LOCALES.filter(
                (item) => item !== locale
            ).map((item) => OPEN_GRAPH_LOCALES[item]),
            url: path,
            siteName: SITE_NAME,
            title: socialTitle,
            description: localizedDescription,
            images: [socialImage],
        },
        twitter: {
            card: imageCard,
            title: socialTitle,
            description: localizedDescription,
            images: [{ url: socialImage.url, alt: socialImage.alt }],
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
