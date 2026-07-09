import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Pretendard 로컬 폰트를 전역 CSS 변수로 연결함
const pretendard = localFont({
    src: "./fonts/PretendardVariable.woff2",
    variable: "--font-pretendard",
    weight: "45 920",
    display: "swap",
});

export const metadata: Metadata = {
    title: "NosLog",
    description: "NOSTALGIA 플레이어를 위한 개인 기록·성과 대시보드",
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
