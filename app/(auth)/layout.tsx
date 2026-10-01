import type { Metadata } from "next";

import { getServerI18n } from "@/lib/i18n/server";

export const metadata: Metadata = {
    robots: { index: false, follow: false, noarchive: true },
};

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { t } = await getServerI18n();

    return (
        <>
            {/* 셸과 같은 건너뛰기 링크(nl-skip-link) — 토큰이 .noslog-ui 안에서만 풀린다 */}
            <div className="noslog-ui">
                <a className="nl-skip-link nl-control" href="#main-content">
                    {t("skip.main")}
                </a>
            </div>
            {children}
        </>
    );
}
