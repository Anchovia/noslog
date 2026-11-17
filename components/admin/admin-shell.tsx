"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import type { ReactNode } from "react";

import { AdminSidebar, AdminTopbar } from "@/components/admin/admin-nav";
import type { ShellAccount } from "@/components/layout/app-header";
import NavigationProgress from "@/components/layout/navigation-progress";
import { useTranslations } from "@/components/i18n/locale-provider";

// 관리자 셸 — 1056 이상은 왼쪽 사이드바 + 위 막대, 좁은 폭은 위 막대의 메뉴 버튼이 왼쪽 서랍을 연다. 채보 편집기는 보존 대상이라 1.0 셸을 그대로 유지함
export default function AdminShell({
    children,
    account,
    footer,
    legacyHeader,
    legacyFooter,
    legacySkipLink,
}: {
    children: ReactNode;
    account: ShellAccount;
    footer: ReactNode;
    legacyHeader: ReactNode;
    legacyFooter: ReactNode;
    legacySkipLink: ReactNode;
}) {
    const pathname = usePathname();
    const t = useTranslations();

    if (/^\/admin\/music\/[^/]+\/[^/]+\/pattern\/?$/.test(pathname)) {
        return (
            // 에디터 옛 셸도 .noslog-ui 안 — 밖이면 nl 토큰이 풀리지 않는다(2026-10-15 B5 2단계)
            <div className="noslog-ui min-h-screen bg-nl-canvas">
                <Suspense fallback={null}>
                    <NavigationProgress />
                </Suspense>
                <div className="nl-admin-phone-frame mx-auto flex min-h-screen w-full flex-col bg-nl-canvas">
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
            <div className="nl-admin-frame">
                <AdminSidebar account={account} />
                <div className="nl-admin-frame__body">
                    <AdminTopbar account={account} />
                    <main
                        id="main-content"
                        className="nl-admin-main"
                        tabIndex={-1}
                    >
                        {children}
                    </main>
                    {footer}
                </div>
            </div>
        </div>
    );
}
