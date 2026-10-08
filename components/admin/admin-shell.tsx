"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import type { ReactNode } from "react";

import AdminNav from "@/components/admin/admin-nav";
import AppHeader from "@/components/layout/app-header";
import type { ShellAccount } from "@/components/layout/app-header";
import NavigationProgress from "@/components/layout/navigation-progress";
import { useTranslations } from "@/components/i18n/locale-provider";

// 관리자 화면을 2.0 셸에 올림. 채보 편집기는 보존 대상이라 1.0 셸을 그대로 유지함
export default function AdminShell({
    children,
    account,
    footer,
    legacyHeader,
    legacyFooter,
    legacySkipLink,
}: {
    children: ReactNode;
    account: ShellAccount | null;
    footer: ReactNode;
    legacyHeader: ReactNode;
    legacyFooter: ReactNode;
    legacySkipLink: ReactNode;
}) {
    const pathname = usePathname();
    const t = useTranslations();

    if (/^\/admin\/music\/[^/]+\/[^/]+\/pattern\/?$/.test(pathname)) {
        return (
            <div className="min-h-screen bg-bg">
                <div className="mx-auto flex min-h-screen w-full max-w-97.5 flex-col bg-bg">
                    {legacySkipLink}
                    {legacyHeader}
                    <main id="main-content" className="flex-1" tabIndex={-1}>
                        {children}
                    </main>
                    {legacyFooter}
                </div>
            </div>
        );
    }

    return (
        <div className="noslog-ui nl-app nl-admin">
            <a className="nl-skip-link nl-control" href="#main-content">
                {t("skip.main")}
            </a>
            <Suspense fallback={null}>
                <NavigationProgress />
            </Suspense>
            <AppHeader account={account} />
            <AdminNav />
            <main id="main-content" className="nl-main" tabIndex={-1}>
                <div className="nl-main__content">{children}</div>
            </main>
            {footer}
        </div>
    );
}
