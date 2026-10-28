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
        messagesLocale: Locale;
        messages: Messages;
    } | null>(null);
    useEffect(() => {
        if (path === null) return;
        let active = true;
        // 그 언어 카탈로그를 못 받으면 기본 언어 카탈로그로라도 「다시 시도」 · 홈 이동을 보인다
        loadMessages[locale]()
            .then((messages) => ({ messagesLocale: locale, messages }))
            .catch((loadError: unknown) => {
                recordClientError(loadError, "global-error-messages");
                return loadMessages[DEFAULT_LOCALE]().then((messages) => ({
                    messagesLocale: DEFAULT_LOCALE,
                    messages,
                }));
            })
            .then(({ messagesLocale, messages }) => {
                if (active) setLoaded({ locale, messagesLocale, messages });
            })
            .catch((loadError: unknown) => {
                recordClientError(loadError, "global-error-messages");
            });
        return () => {
            active = false;
        };
    }, [path, locale]);
    // 카탈로그가 오기 전에는 경로를 모를 때처럼 언어 중립 화면만 그림
    const current = loaded?.locale === locale ? loaded : null;
    const messages = current?.messages ?? null;
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
        <html lang={current?.messagesLocale ?? locale} data-theme="dark">
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
                                <p className="nl-metadata nl-muted">
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
