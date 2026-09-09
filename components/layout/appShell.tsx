"use client";

import type { ReactNode } from "react";

import { useTranslations } from "@/components/i18n/localeProvider";
import AppHeader from "@/components/layout/appHeader";
import type { ShellAccount } from "@/components/layout/appHeader";

export default function AppShell({
    children,
    account,
    footer,
}: {
    children: ReactNode;
    account: ShellAccount | null;
    footer: ReactNode;
}) {
    const t = useTranslations();

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
