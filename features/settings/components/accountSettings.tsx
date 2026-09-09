"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ActionButton from "@/components/ui/actionButton";
import ModalDialog from "@/components/ui/modalDialog";
import { FormField, Input } from "@/components/ui/formField";
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
                    showClose={false}
                    className="nl-settings-dialog nl-account-dialog"
                    onOpenAutoFocus={(event) => {
                        event.preventDefault();
                        cancelRef.current?.focus();
                    }}
                    trigger={
                        <Button
                            appearance="foundation"
                            variant="danger"
                            destructiveFilled
                            disabled={loggingOut}
                        >
                            {t("settings.deleteTitle")}
                        </Button>
                    }
                >
                    <p className="nl-body-secondary nl-muted">
                        {t("settings.deleteIrreversible")}{" "}
                        {t("settings.deletionBoundary")}
                    </p>
                    <dl className="nl-account-consequences">
                        {(
                            Object.keys(
                                summary
                            ) as (keyof AccountDeletionSummary)[]
                        ).map((key) => (
                            <div key={key}>
                                <dt>{t(`settings.deletionGroup.${key}`)}</dt>
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
                    <p className="nl-body-secondary nl-muted" role="status">
                        {t(
                            verified
                                ? "settings.reauthenticated"
                                : "settings.reauthenticateNotice"
                        )}
                    </p>
                    {!verified ? (
                        <a
                            className="nl-button nl-button--secondary nl-account-reauth"
                            href={`/discord/start?${new URLSearchParams({ mode: "delete", returnTo: `${href("/settings")}?category=account` })}`}
                        >
                            {t("settings.reauthenticate")}
                        </a>
                    ) : null}
                    <form
                        onSubmit={(event) =>
                            void form.handleSubmit(submit)(event)
                        }
                        noValidate
                        className="nl-account-confirmation"
                        aria-busy={busy}
                    >
                        <FormField
                            id={id}
                            label={t("settings.deletePrompt", {
                                confirmation: t("settings.deleteConfirmation"),
                            })}
                            error={form.formState.errors.confirmation?.message}
                        >
                            <Input
                                id={id}
                                {...form.register("confirmation")}
                                disabled={busy}
                                autoComplete="off"
                                placeholder={t("settings.deleteConfirmation")}
                                aria-invalid={Boolean(
                                    form.formState.errors.confirmation
                                )}
                                aria-describedby={
                                    form.formState.errors.confirmation
                                        ? `${id}-error`
                                        : undefined
                                }
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
                        <div className="nl-dialog__actions">
                            <Button
                                ref={cancelRef}
                                appearance="foundation"
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
                                busy={busy}
                                disabled={
                                    !verified ||
                                    confirmation !==
                                        t("settings.deleteConfirmation")
                                }
                            >
                                {t("settings.deleteEverything")}
                            </ActionButton>
                        </div>
                    </form>
                </ModalDialog>
                <Link href={href("/privacy")} className="nl-control">
                    {t("footer.privacy")}
                </Link>
            </section>
        </div>
    );
}
