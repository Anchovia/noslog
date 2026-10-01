import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import Script from "next/script";
import AppToaster from "@/components/ui/AppToaster";
import { LocaleProvider } from "@/components/i18n/localeProvider";
import { AppProviders } from "@/components/providers/appProviders";
import { serverEnv } from "@/lib/env/server";
import { getMessages } from "@/lib/i18n/messages";
import {
    DEFAULT_LOCALE,
    isLocale,
    LOCALE_REQUEST_HEADER,
} from "@/lib/i18n/routing";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/metadata/site";
import "./globals.css";

// Pretendard 로컬 폰트를 전역 CSS 변수로 연결함
const pretendard = localFont({
    src: "./fonts/PretendardVariable.woff2",
    variable: "--font-pretendard",
    weight: "45 920",
    display: "swap",
    preload: false,
});

const themeScript =
    process.env.NEXT_PUBLIC_ENABLE_THEME_SWITCHING === "true"
        ? `
    try {
        var theme = localStorage.getItem("noslog-theme");
        document.documentElement.dataset.theme = theme === "light" ? "light" : "dark";
    } catch (_) {
        document.documentElement.dataset.theme = "dark";
    }
`
        : 'document.documentElement.dataset.theme = "dark";';

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "game",
    referrer: "origin-when-cross-origin",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
    // url 은 페이지마다(createPageMetadata) — 여기 두면 404 등 페이지가 홈 주소를 공유 주소로 내보낸다
    openGraph: {
        type: "website",
        locale: "ko_KR",
        siteName: SITE_NAME,
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
    },
    verification: serverEnv.GOOGLE_SITE_VERIFICATION
        ? { google: serverEnv.GOOGLE_SITE_VERIFICATION }
        : undefined,
    manifest: "/manifest.webmanifest",
};

// 다크 전용(2026-10-01 메타데이터 점검 E2) — 주소창 색 = 바탕 토큰 surface/canvas, color-scheme 으로 스크롤바 · 기본 컨트롤도 어둡게
export const viewport: Viewport = {
    themeColor: "#111111",
    colorScheme: "dark",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const requestHeaders = await headers();
    const requestLocale = requestHeaders.get(LOCALE_REQUEST_HEADER);
    const locale = isLocale(requestLocale) ? requestLocale : DEFAULT_LOCALE;

    return (
        <html
            lang={locale}
            data-theme="dark"
            suppressHydrationWarning
            className={`${pretendard.variable} bg-bg text-text-primary`}
        >
            <head>
                <Script
                    id="noslog-theme"
                    strategy="beforeInteractive"
                    dangerouslySetInnerHTML={{ __html: themeScript }}
                />
            </head>
            <body className="font-sans">
                <LocaleProvider locale={locale} messages={getMessages(locale)}>
                    <AppProviders>
                        {children}
                        <AppToaster />
                    </AppProviders>
                </LocaleProvider>
            </body>
        </html>
    );
}
