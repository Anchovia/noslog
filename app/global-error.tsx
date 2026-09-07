"use client";

import { useEffect, useSyncExternalStore } from "react";
import LegacyGlobalError from "@/features/recovery/components/legacyGlobalError";
import RecoveryAction from "@/features/recovery/components/recoveryAction";
import { foundationButtonClass } from "@/components/ui/Button";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import {
    DEFAULT_LOCALE,
    getPathLocale,
    localeFromAcceptLanguage,
    localizePath,
    stripLocaleFromPath,
} from "@/lib/i18n/routing";
import { recordClientError } from "@/lib/observability/client";
import "./globals.css";

const subscribe = () => () => {};
const serverPath = () => null;
const browserPath = () => window.location.pathname;

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
    const t = createTranslator(getMessages(locale));
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
                    {path === null
                        ? "NosLog"
                        : `${t("recovery.fatalTitle")} | NosLog`}
                </title>
            </head>
            <body className="noslog-ui nl-recovery-minimal">
                <main id="main-content">
                    <div className="nl-recovery-minimal__content">
                        <p className="nl-page-title">NosLog</p>
                        {path !== null ? (
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
