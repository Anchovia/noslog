"use client";

import type { ReactNode } from "react";

import { useTranslations } from "@/components/i18n/localeProvider";
import AppHeader from "@/components/layout/appHeader";
import type { ShellAccount } from "@/components/layout/appHeader";
import PageViewBeacon from "@/components/layout/pageViewBeacon";
import { FeedbackUnreadProvider } from "@/features/feedback/components/feedbackUnread";

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
        <FeedbackUnreadProvider initial={account?.feedbackUnread ?? 0}>
            <div className="noslog-ui nl-app">
                <a className="nl-skip-link nl-control" href="#main-content">
                    {t("skip.main")}
                </a>
                <AppHeader account={account} />
                <main id="main-content" className="nl-main" tabIndex={-1}>
                    <div className="nl-main__content">{children}</div>
                </main>
                {footer}
                {/* 방문 통계(자체 집계) — 관리자 셸(AdminShell)에는 없다 */}
                <PageViewBeacon />
            </div>
        </FeedbackUnreadProvider>
    );
}
