"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/avatar";
import ModalDialog from "@/components/ui/modalDialog";
import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";

export default function ConnectionSettings({
    displayName,
    error,
    result,
}: {
    displayName: string;
    error?: string;
    result?: string;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const [confirmChange, setConfirmChange] = useState(false);
    const [pending, setPending] = useState<"refresh" | "change" | null>(null);
    const [localError, setLocalError] = useState("");
    const changeButton = useRef<HTMLButtonElement>(null);
    const cancelButton = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const restore = () => setPending(null);
        window.addEventListener("pageshow", restore);
        return () => window.removeEventListener("pageshow", restore);
    }, []);
    function authenticate(mode: "refresh" | "change") {
        if (pending) return;
        if (!navigator.onLine) {
            setLocalError(t("settings.offline"));
            return;
        }
        setLocalError("");
        setPending(mode);
        const params = new URLSearchParams({
            mode,
            returnTo: `${href("/settings")}?category=connections`,
        });
        // OAuth requires a top-level document navigation to the provider.
        window.location.assign(
            new URL(`/discord/start?${params}`, window.location.origin).href
        );
    }
    const errorMessage =
        localError ||
        (error
            ? t(
                  error === "identity_mismatch"
                      ? "settings.discordIdentityMismatch"
                      : error === "session_expired"
                        ? "settings.loginRequired"
                        : "settings.discordError"
              )
            : "");
    return (
        <div className="nl-settings__form" aria-busy={pending !== null}>
            <div className="nl-settings__zone">
                <p className="nl-control nl-muted">
                    {t("settings.loginAccount")}
                </p>
                <div className="nl-settings__identity-row">
                    <Avatar alt="" size={40} />
                    <div className="nl-settings__read-only">
                        <p className="nl-body">{displayName}</p>
                        <p className="nl-metadata nl-muted">Discord</p>
                    </div>
                </div>
            </div>
            {errorMessage && !confirmChange ? (
                <p role="alert" className="nl-body-secondary nl-field__error">
                    {errorMessage}
                </p>
            ) : null}
            {!error && (result === "refresh" || result === "change") ? (
                <p role="status" className="nl-body-secondary">
                    {t(
                        result === "refresh"
                            ? "settings.discordRefreshComplete"
                            : "settings.discordChangeComplete"
                    )}
                </p>
            ) : null}
            <div className="nl-settings__zone">
                <Button
                    appearance="foundation"
                    size="sm"
                    variant="secondary"
                    disabled={pending !== null}
                    onClick={() => authenticate("refresh")}
                >
                    {t(
                        pending === "refresh"
                            ? "settings.refreshingDiscord"
                            : "settings.refreshDiscord"
                    )}
                </Button>
                <Button
                    ref={changeButton}
                    appearance="foundation"
                    size="sm"
                    variant="secondary"
                    disabled={pending !== null}
                    onClick={() => setConfirmChange(true)}
                >
                    {t("settings.changeLoginAccount")}
                </Button>
            </div>
            <ModalDialog
                className="nl-settings-dialog"
                open={confirmChange}
                onOpenChange={(open) => {
                    if (!pending) setConfirmChange(open);
                }}
                title={t("settings.changeLoginAccount")}
                description={t("settings.changeLoginAccountWarning")}
                showClose={false}
                onOpenAutoFocus={(event) => {
                    event.preventDefault();
                    cancelButton.current?.focus();
                }}
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    changeButton.current?.focus();
                }}
                footer={
                    <>
                        <Button
                            ref={cancelButton}
                            appearance="foundation"
                            size="sm"
                            variant="secondary"
                            disabled={pending !== null}
                            onClick={() => setConfirmChange(false)}
                        >
                            {t("settings.cancel")}
                        </Button>
                        <Button
                            appearance="foundation"
                            size="sm"
                            disabled={pending !== null}
                            onClick={() => authenticate("change")}
                        >
                            {t("settings.continue")}
                        </Button>
                    </>
                }
            >
                {localError ? (
                    <p
                        role="alert"
                        className="nl-body-secondary nl-field__error"
                    >
                        {localError}
                    </p>
                ) : null}
            </ModalDialog>
        </div>
    );
}
