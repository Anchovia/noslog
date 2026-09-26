"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ActionButton from "@/components/ui/actionButton";
import ModalDialog from "@/components/ui/modalDialog";
import { fieldDescription, FormField, Input } from "@/components/ui/formField";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import { logoutAccount } from "@/app/(nevigation)/settings/accountActions";
import { deleteAccount } from "@/app/(nevigation)/profile/settings/securityActions";
import { createAccountDeletionSchema } from "../schemas/accountDeletionSchema";
import type {
    AccountDeletionFormValues,
    AccountDeletionSummary,
} from "../schemas/accountDeletionSchema";

/**
 * 계정 설정 — 로그아웃 · 회원 탈퇴. 탈퇴 창은 입력 칸이 있는 폼 창(닫기 · 발 버튼, 2026-09-26 확인 창에서 옮김):
 * 지워지는 것 상자 → 1. Discord 다시 인증 → 2. 확인 글자 입력(인증 전엔 잠김)
 */
export default function AccountSettings({
    summary,
    expiresAt,
    error,
    result,
    deleteAction = deleteAccount,
    logoutAction = logoutAccount,
}: {
    summary: AccountDeletionSummary;
    expiresAt: number | null;
    error?: string;
    result?: string;
    deleteAction?: typeof deleteAccount;
    logoutAction?: typeof logoutAccount;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const cache = useQueryClient();
    const id = useId();
    const formId = `${id}-form`;
    const [open, setOpen] = useState(result === "delete" || Boolean(error));
    const [verified, setVerified] = useState(() =>
        Boolean(expiresAt && expiresAt > Date.now())
    );
    const [loggingOut, setLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState("");
    const [deleteError, setDeleteError] = useState(
        error ? t("settings.discordError") : ""
    );
    const cancelRef = useRef<HTMLButtonElement>(null);
    const busyRef = useRef(false);
    const form = useForm<AccountDeletionFormValues>({
        resolver: zodResolver(createAccountDeletionSchema(t)),
        defaultValues: { confirmation: "" },
    });
    const confirmation = useWatch({
        control: form.control,
        name: "confirmation",
    });
    const busy = form.formState.isSubmitting;
    useEffect(() => {
        if (!expiresAt) return;
        const timer = window.setTimeout(
            () => setVerified(false),
            Math.max(0, expiresAt - Date.now())
        );
        return () => window.clearTimeout(timer);
    }, [expiresAt]);
    function finish(status: "logged-out" | "deleted") {
        cache.clear();
        // A new document also discards account-sensitive Next router and component caches.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign(`${href("/")}?accountStatus=${status}`);
    }
    async function logOut() {
        if (busyRef.current) return;
        busyRef.current = true;
        setLoggingOut(true);
        setLogoutError("");
        try {
            await logoutAction();
            finish("logged-out");
        } catch {
            setLogoutError(t("settings.logoutError"));
            busyRef.current = false;
            setLoggingOut(false);
        }
    }
    async function submit(values: AccountDeletionFormValues) {
        if (busyRef.current || !verified) return;
        busyRef.current = true;
        setDeleteError("");
        try {
            const response = await deleteAction(values.confirmation, locale);
            if (response.success) {
                finish("deleted");
                return;
            }
            if (
                "reauthenticationRequired" in response &&
                response.reauthenticationRequired
            )
                setVerified(false);
            setDeleteError(response.message);
        } catch {
            setDeleteError(t("settings.deleteError"));
        }
        busyRef.current = false;
    }
    return (
        <div className="nl-settings__form">
            <div className="nl-settings__zone">
                <ActionButton
                    variant="secondary"
                    busy={loggingOut}
                    onClick={() => void logOut()}
                >
                    {t("profile.logout")}
                </ActionButton>
                {logoutError ? (
                    <p
                        role="alert"
                        className="nl-body-secondary nl-field__error"
                    >
                        {logoutError}
                    </p>
                ) : null}
            </div>
            <section className="nl-settings__zone nl-account-deletion">
                <h2 className="nl-section-title">
                    {t("settings.deleteTitle")}
                </h2>
                <p className="nl-body-secondary nl-muted">
                    {t("settings.deleteDescription")}{" "}
                    {t("settings.deleteIrreversible")}
                </p>
                <p className="nl-body-secondary nl-muted">
                    {t("settings.deletionBoundary")}
                </p>
                <ModalDialog
                    open={open}
                    onOpenChange={(next) => {
                        if (!busyRef.current) {
                            setOpen(next);
                            form.reset();
                        }
                    }}
                    title={t("settings.deleteTitle")}
                    className="nl-account-dialog"
                    onOpenAutoFocus={(event) => {
                        event.preventDefault();
                        cancelRef.current?.focus();
                    }}
                    trigger={
                        <Button
                            variant="danger"
                            destructiveFilled
                            disabled={loggingOut}
                        >
                            {t("settings.deleteTitle")}
                        </Button>
                    }
                    footer={
                        <>
                            <Button
                                ref={cancelRef}
                                variant="secondary"
                                type="button"
                                disabled={busy}
                                onClick={() => {
                                    setOpen(false);
                                    form.reset();
                                }}
                            >
                                {t("settings.cancel")}
                            </Button>
                            <ActionButton
                                variant="danger"
                                destructiveFilled
                                type="submit"
                                form={formId}
                                busy={busy}
                                disabled={
                                    !verified ||
                                    confirmation !==
                                        t("settings.deleteConfirmation")
                                }
                            >
                                {t("settings.deleteEverything")}
                            </ActionButton>
                        </>
                    }
                >
                    <p className="nl-body-secondary nl-muted">
                        {t("settings.deleteIrreversible")}{" "}
                        {t("settings.deletionBoundary")}
                    </p>
                    <section className="nl-account-consequences">
                        <h3 className="nl-metadata">
                            {t("settings.deletionHeading")}
                        </h3>
                        <dl>
                            {(
                                Object.keys(
                                    summary
                                ) as (keyof AccountDeletionSummary)[]
                            ).map((key) => (
                                <div key={key}>
                                    <dt className="nl-muted">
                                        {t(`settings.deletionGroup.${key}`)}
                                    </dt>
                                    <dd>
                                        {t("settings.deletionCount", {
                                            count: summary[key].toLocaleString(
                                                locale
                                            ),
                                        })}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                    <section className="nl-field">
                        <h3 className="nl-emphasis-label">
                            {t("settings.deleteStepReauth")}
                        </h3>
                        <div className="nl-account-reauth">
                            {!verified ? (
                                <a
                                    className="nl-button nl-button--secondary"
                                    href={`/discord/start?${new URLSearchParams({ mode: "delete", returnTo: `${href("/settings")}?category=account` })}`}
                                >
                                    {t("settings.reauthenticate")}
                                </a>
                            ) : null}
                            <p
                                className={
                                    verified
                                        ? "nl-body-secondary"
                                        : "nl-metadata"
                                }
                                role="status"
                            >
                                {t(
                                    verified
                                        ? "settings.reauthenticated"
                                        : "settings.reauthenticateNext"
                                )}
                            </p>
                        </div>
                    </section>
                    <form
                        id={formId}
                        onSubmit={(event) =>
                            void form.handleSubmit(submit)(event)
                        }
                        noValidate
                        className="nl-account-confirmation"
                        aria-busy={busy}
                    >
                        <FormField
                            id={id}
                            // 단계 제목은 emphasis-label(2026-09-26 점검 C2, 시안)
                            label={
                                <span className="nl-emphasis-label">
                                    {t("settings.deleteStepConfirm")}
                                </span>
                            }
                            help={t("settings.deletePrompt", {
                                confirmation: t("settings.deleteConfirmation"),
                            })}
                            error={form.formState.errors.confirmation?.message}
                        >
                            <Input
                                id={id}
                                {...form.register("confirmation")}
                                disabled={busy || !verified}
                                autoComplete="off"
                                placeholder={t("settings.deleteConfirmation")}
                                aria-invalid={Boolean(
                                    form.formState.errors.confirmation
                                )}
                                aria-describedby={fieldDescription(id, {
                                    help: true,
                                    error: Boolean(
                                        form.formState.errors.confirmation
                                    ),
                                })}
                            />
                        </FormField>
                        {deleteError ? (
                            <div
                                role="alert"
                                className="nl-body-secondary nl-field__error"
                            >
                                <p>{deleteError}</p>
                                <Link href={href("/privacy")}>
                                    {t("footer.privacy")}
                                </Link>
                            </div>
                        ) : null}
                    </form>
                </ModalDialog>
                <Link href={href("/privacy")} className="nl-control">
                    {t("footer.privacy")}
                </Link>
            </section>
        </div>
    );
}
