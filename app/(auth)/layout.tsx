import type { Metadata } from "next";
import SkipLink from "@/components/layout/skipLink";

export const metadata: Metadata = {
    robots: { index: false, follow: false, noarchive: true },
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <SkipLink />
            {children}
        </>
    );
}
