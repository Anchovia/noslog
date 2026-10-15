"use client";

import "./globals.css";

import { useEffect, useState, useSyncExternalStore } from "react";

import { foundationButtonClass } from "@/components/ui/button";
import LegacyGlobalError from "@/features/recovery/components/legacy-global-error";
import RecoveryAction from "@/features/recovery/components/recovery-action";
import type { Messages } from "@/lib/i18n/message-types";
import {
    DEFAULT_LOCALE,
    getPathLocale,
    type Locale,
    localeFromAcceptLanguage,
    localizePath,
    stripLocaleFromPath,
} from "@/lib/i18n/routing";
import { createTranslator } from "@/lib/i18n/translator";
import { recordClientError } from "@/lib/observability/client";

const subscribe = () => () => {};
const serverPath = () => null;
const browserPath = () => window.location.pathname;

// 오류가 났을 때만 그 언어 카탈로그를 받음 — 평소 번들에 세 언어 카탈로그가 실리지 않게
const loadMessages: Record<Locale, () => Promise<Messages>> = {
    ko: () =>
        import("@/lib/i18n/message-catalogs/ko").then((m) => m.koMessages),
    ja: () =>
        import("@/lib/i18n/message-catalogs/ja").then((m) => m.jaMessages),
    en: () =>
        import("@/lib/i18n/message-catalogs/en").then((m) => m.enMessages),
};

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    // A failed root cannot supply locale through providers. Until the browser
    // route is known, render the language-neutral identity only, never English
    // copy that is replaced after paint on Korean or Japanese routes.
    const path = useSyncExternalStore(subscribe, browserPath, serverPath);
    const locale =
        path === null
            ? DEFAULT_LOCALE
            : (getPathLocale(path) ??
              localeFromAcceptLanguage(navigator.languages.join(",")));
    const [loaded, setLoaded] = useState<{
        locale: Locale;
        messages: Messages;
    } | null>(null);
    useEffect(() => {
        if (path === null) return;
        let active = true;
        loadMessages[locale]()
            .then((messages) => {
                if (active) setLoaded({ locale, messages });
            })
            .catch(() => {});
        return () => {
            active = false;
        };
    }, [path, locale]);
    // 카탈로그가 오기 전에는 경로를 모를 때처럼 언어 중립 화면만 그림
    const messages = loaded?.locale === locale ? loaded.messages : null;
    const t = messages ? createTranslator(messages) : null;
    useEffect(() => recordClientError(error, "global-error-boundary"), [error]);
    const bare = path ? stripLocaleFromPath(path) : "";
    if (
        /^\/admin(?:\/|$)/.test(bare) ||
        /^\/music\/[^/]+\/[^/]+\/pattern(?:\/|$)/.test(bare)
    ) {
        return <LegacyGlobalError error={error} reset={reset} />;
    }
    return (
        <html lang={locale} data-theme="dark">
            <head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta name="robots" content="noindex" />
                <title>
                    {t === null
                        ? "NosLog"
                        : `${t("recovery.fatalTitle")} | NosLog`}
                </title>
            </head>
            <body className="noslog-ui nl-recovery-minimal">
                <main id="main-content">
                    <div className="nl-recovery-minimal__content">
                        <p className="nl-page-title">NosLog</p>
                        {t !== null ? (
                            <>
                                <h1 className="nl-page-title">
                                    {t("recovery.fatalTitle")}
                                </h1>
                                <p className="nl-body nl-muted">
                                    {t("common.retryLater")}
                                </p>
                                <div className="nl-recovery__actions">
                                    <RecoveryAction
                                        label={t("common.retry")}
                                        busyLabel={t("recovery.retrying")}
                                    />
                                    {/* Full-document navigation remains independent of a failed router. */}
                                    <a
                                        href={localizePath("/", locale)}
                                        className={foundationButtonClass({
                                            variant: "secondary",
                                        })}
                                    >
                                        {t("common.goHome")}
                                    </a>
                                </div>
                            </>
                        ) : null}
                    </div>
                </main>
            </body>
        </html>
    );
}
