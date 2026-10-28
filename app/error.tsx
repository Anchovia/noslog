"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import { foundationButtonClass } from "@/components/ui/button";
import IntentLink from "@/components/ui/intent-link";
import LegacyRouteError from "@/features/recovery/components/legacy-route-error";
import RecoveryAction from "@/features/recovery/components/recovery-action";
import { stripLocaleFromPath } from "@/lib/i18n/routing";
import { recordClientError } from "@/lib/observability/client";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const router = useRouter();
    const path = stripLocaleFromPath(usePathname());
    // 관리자 · 채보 에디터는 원래 오류 화면 그대로((site)/error.tsx 가 이 경계로 넘긴다)
    const preserved =
        /^\/admin(?:\/|$)/.test(path) ||
        /^\/music\/[^/]+\/[^/]+\/pattern(?:\/|$)/.test(path);
    useEffect(() => {
        recordClientError(error, "route-error-boundary");
        console.error(error);
    }, [error]);

    if (preserved) return <LegacyRouteError reset={reset} />;

    // 그 밖(로그인 · 온보딩 · 점검 · 레이아웃 실패)은 헤더가 없는 오류 화면(global-error)과 같은 모양 — 토큰 · 공용 버튼(2026-10-01)
    return (
        <div className="noslog-ui nl-recovery-minimal">
            <main id="main-content">
                <div className="nl-recovery-minimal__content">
                    <title>{`${t("common.pageError")} | NosLog`}</title>
                    <meta name="robots" content="noindex" />
                    <p className="nl-page-title">NosLog</p>
                    <h1 className="nl-page-title">{t("common.pageError")}</h1>
                    <p className="nl-metadata nl-muted">
                        {t("common.retryLater")}
                    </p>
                    <div className="nl-recovery__actions">
                        <RecoveryAction
                            label={t("common.retry")}
                            busyLabel={t("recovery.retrying")}
                            reset={() => {
                                router.refresh();
                                reset();
                            }}
                        />
                        <IntentLink
                            href={href("/")}
                            className={foundationButtonClass({
                                variant: "secondary",
                            })}
                        >
                            {t("common.goHome")}
                        </IntentLink>
                    </div>
                </div>
            </main>
        </div>
    );
}
