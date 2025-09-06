import type { Metadata } from "next";
import "./globals.css";

import { Outfit } from "next/font/google";

const outfit = Outfit({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "500", "700", "800", "900"],
    style: ["normal"],
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
        <html lang="en" className="bg-black text-white">
            <body className={`${outfit.className} antialiased`}>
                {children}
            </body>
        </html>
    );
}
