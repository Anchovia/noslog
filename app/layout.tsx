import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const appUrl = process.env.APP_URL?.trim() || "https://noslog.app";

// Pretendard 로컬 폰트를 전역 CSS 변수로 연결함
const pretendard = localFont({
    src: "./fonts/PretendardVariable.woff2",
    variable: "--font-pretendard",
    weight: "45 920",
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL(appUrl),
    applicationName: "NosLog",
    title: {
        default: "NosLog",
        template: "%s | NosLog",
    },
    description: "NOSTALGIA 플레이 기록·랭킹·서열 아카이브",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "ko_KR",
        url: "/",
        siteName: "NosLog",
        title: "NosLog",
        description: "NOSTALGIA 플레이 기록·랭킹·서열 아카이브",
    },
    twitter: {
        card: "summary_large_image",
        title: "NosLog",
        description: "NOSTALGIA 플레이 기록·랭킹·서열 아카이브",
    },
    manifest: "/manifest.webmanifest",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" className="bg-bg text-text-primary">
            <body className={`${pretendard.variable} font-sans`}>
                {children}
            </body>
        </html>
    );
}
