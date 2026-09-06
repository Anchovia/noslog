"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useTranslations } from "@/components/i18n/localeProvider";
import AppHeader from "@/components/layout/appHeader";
import type { ShellAccount } from "@/components/layout/appHeader";
import { stripLocaleFromPath } from "@/lib/i18n/routing";

export default function AppShell({
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
    const pathname = stripLocaleFromPath(usePathname());
    const t = useTranslations();

    if (/^\/music\/[^/]+\/[^/]+\/pattern(?:\/|$)/.test(pathname)) {
        return (
            <div className="bg-bg min-h-screen">
                <div className="bg-bg mx-auto flex min-h-screen w-full max-w-97.5 flex-col">
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
        <div className="noslog-ui nl-app">
            <a className="nl-skip-link nl-control" href="#main-content">
                {t("skip.main")}
            </a>
            <AppHeader account={account} />
            <main id="main-content" className="nl-main" tabIndex={-1}>
                <div className="nl-main__content">{children}</div>
            </main>
            {footer}
        </div>
    );
}
