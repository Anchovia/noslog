"use client";

import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import ActionButton from "@/components/ui/action-button";
import Button from "@/components/ui/button";
import DiscordIcon from "@/components/ui/discord-icon";
import IntentLink from "@/components/ui/intent-link";
import ModalDialog from "@/components/ui/modal-dialog";
import { StatusMessage } from "@/components/ui/status-message";
import { MusecatConnectionRow } from "@/features/partner/components/musecat-connection-settings";
import type { MusecatSettings } from "@/features/partner/server/partner-settings-data";

const DISCORD_DETAIL_QUERY = "?category=connections&partner=discord";
const DISCORD_SCOPES = ["id", "name", "avatar"] as const;

/** 설정 › 연결 목록 — 줄마다 누르면 상세로 간다. Discord 와 뮤즈캣이 같은 모양 */
export default function ConnectionSettings({
    displayName,
    musecat,
}: {
    displayName: string;
    /** 뮤즈캣 연동(2026-10-20) — visible 일 때만 줄을 보인다 */
    musecat?: MusecatSettings;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    return (
        <div className="nl-settings__form">
            <div className="nl-settings__rows">
                <IntentLink
                    className="nl-settings__row"
                    href={`${href("/settings")}${DISCORD_DETAIL_QUERY}`}
                >
                    <span className="nl-settings__row-lead">
                        <span className="nl-settings__logo" aria-hidden>
                            <DiscordIcon />
                        </span>
                        <span className="nl-settings__row-copy">
                            <span className="nl-control">Discord</span>
                            <span className="nl-metadata nl-muted">
                                {t("settings.loginAccount")} · {displayName}
                            </span>
                        </span>
                    </span>
                    <ChevronRight
                        className="nl-settings__row-chevron"
                        aria-hidden
                    />
                </IntentLink>
                {musecat?.visible ? (
                    <MusecatConnectionRow settings={musecat} />
                ) : null}
            </div>
        </div>
    );
}

/** Discord 연결 상세 — 뮤즈캣 상세와 같은 순서. 로그인 계정이라 「연결 끊기」 대신 새로고침 · 계정 변경을 둔다 */
export function DiscordConnectionDetail({
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
            returnTo: `${href("/settings")}${DISCORD_DETAIL_QUERY}`,
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
            <div className="nl-settings__row-lead">
                <span className="nl-settings__logo" aria-hidden>
                    <DiscordIcon />
                </span>
                <div className="nl-settings__row-copy">
                    <h1 className="nl-section-title">Discord</h1>
                    <span className="nl-metadata nl-muted">
                        {t("settings.loginAccount")} · {displayName}
                    </span>
                </div>
            </div>
            {errorMessage && !confirmChange ? (
                <StatusMessage
                    severity="danger"
                    role="alert"
                    title={errorMessage}
                />
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
            <section className="nl-settings__zone nl-settings__zone--compact">
                <h2 className="nl-component-title">
                    {t("settings.discordScopeTitle")}
                </h2>
                <ul className="nl-settings__rows">
                    {DISCORD_SCOPES.map((scope) => (
                        <li key={scope} className="nl-settings__row">
                            <span className="nl-control">
                                {t(`settings.discordScope.${scope}`)}
                            </span>
                        </li>
                    ))}
                </ul>
            </section>
            <div className="nl-settings__zone nl-settings__zone--compact">
                {/* Discord 로 가는 버튼은 Discord 색(2026-10-01 사용자) — 로그인 화면 · 다시 인증과 같은 부품 */}
                <div className="nl-button-row">
                    <ActionButton
                        variant="secondary"
                        className="nl-auth-discord"
                        disabled={pending === "change"}
                        busy={pending === "refresh"}
                        busyLabel={t("settings.refreshingDiscord")}
                        onClick={() => authenticate("refresh")}
                    >
                        {t("settings.refreshDiscord")}
                    </ActionButton>
                </div>
                <div className="nl-button-row">
                    <Button
                        ref={changeButton}
                        variant="secondary"
                        disabled={pending !== null}
                        onClick={() => setConfirmChange(true)}
                    >
                        {t("settings.changeLoginAccount")}
                    </Button>
                </div>
            </div>
            <ModalDialog
                className="nl-settings-dialog"
                open={confirmChange}
                onOpenChange={(open) => {
                    if (!pending) setConfirmChange(open);
                }}
                title={t("settings.changeLoginAccount")}
                description={t("settings.changeLoginAccountWarning")}
                variant="confirm"
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
                            variant="secondary"
                            disabled={pending !== null}
                            onClick={() => setConfirmChange(false)}
                        >
                            {t("settings.cancel")}
                        </Button>
                        <ActionButton
                            busy={pending === "change"}
                            onClick={() => authenticate("change")}
                        >
                            {t("settings.continue")}
                        </ActionButton>
                    </>
                }
            >
                {localError ? (
                    <StatusMessage
                        severity="danger"
                        role="alert"
                        title={localError}
                    />
                ) : null}
            </ModalDialog>
        </div>
    );
}
