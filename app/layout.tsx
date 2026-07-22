import type { Metadata } from "next";
import localFont from "next/font/local";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/metadata/site";
import "./globals.css";

// Pretendard 로컬 폰트를 전역 CSS 변수로 연결함
const pretendard = localFont({
    src: "./fonts/PretendardVariable.woff2",
    variable: "--font-pretendard",
    weight: "45 920",
    display: "swap",
});

const themeScript = `
    try {
        var theme = localStorage.getItem("noslog-theme");
        document.documentElement.dataset.theme = theme === "light" ? "light" : "dark";
    } catch (_) {
        document.documentElement.dataset.theme = "dark";
    }
`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: [
        "NosLog",
        "노스로그",
        "NOSTALGIA",
        "노스텔지어",
        "노스텔지어 기록",
        "노스텔지어 랭킹",
        "노스텔지어 서열표",
        "노스텔지어 검정",
        "BEMANI",
    ],
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
    openGraph: {
        type: "website",
        locale: "ko_KR",
        url: "/",
        siteName: SITE_NAME,
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
    },
    verification: process.env.GOOGLE_SITE_VERIFICATION
        ? { google: process.env.GOOGLE_SITE_VERIFICATION }
        : undefined,
    manifest: "/manifest.webmanifest",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="ko"
            data-theme="dark"
            suppressHydrationWarning
            className={`${pretendard.variable} bg-bg text-text-primary`}
        >
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body className="font-sans">{children}</body>
        </html>
    );
}
