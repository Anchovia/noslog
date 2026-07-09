import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const pretendard = localFont({
    src: "./fonts/PretendardVariable.woff2",
    variable: "--font-pretendard",
    weight: "45 920",
    display: "swap",
});

export const metadata: Metadata = {
    title: "NosLog",
    description: "NosLog Test Homepage",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="bg-dark-primary text-white-primary">
            <body className={`${pretendard.variable} font-sans`}>
                {children}
            </body>
        </html>
    );
}
