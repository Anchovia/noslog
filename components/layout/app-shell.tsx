"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";

import { useTranslations } from "@/components/i18n/locale-provider";
import type { ShellAccount } from "@/components/layout/app-header";
import AppHeader from "@/components/layout/app-header";
import NavigationProgress from "@/components/layout/navigation-progress";
import PageViewBeacon from "@/components/layout/page-view-beacon";
import { FeedbackUnreadProvider } from "@/features/feedback/components/feedback-unread";

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
                <Suspense fallback={null}>
                    <NavigationProgress />
                </Suspense>
                <AppHeader account={account} />
                <main id="main-content" className="nl-main" tabIndex={-1}>
                    <div className="nl-main__content">{children}</div>
                </main>
                {footer}
                {/* 관리자 계정과 관리자 셸(AdminShell)은 방문 통계에서 제외한다 */}
                {account?.role !== "admin" ? <PageViewBeacon /> : null}
            </div>
        </FeedbackUnreadProvider>
    );
}
