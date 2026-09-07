"use client";

import { Share } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import ModalDialog from "@/components/ui/modalDialog";
import { StatusMessage } from "@/components/ui/statusMessage";
import { profileCardOptions } from "@/features/profile/api/profileCard";
import { cn } from "@/lib/utils";
import type {
    ProfileMode,
    ProfileUser,
} from "@/components/profile/dashboard/profileTypes";

function ProfileCardPreview({
    user,
    mode,
}: {
    user: ProfileUser;
    mode: ProfileMode;
}) {
    const href = useLocalizedHref();
    const t = useTranslations();
    const result = useQuery(
        profileCardOptions(href(`/profile/${user.id}/card?mode=${mode}`))
    );
    const [preview, setPreview] = useState<string | null>(null);
    const [previewFailed, setPreviewFailed] = useState(false);
    const [status, setStatus] = useState<
        "idle" | "working" | "copied" | "error"
    >("idle");
    const username = user.username || t("profile.shareUser");
    const fileName = `${(user.username || "noslog-user").replaceAll(/[^\p{L}\p{N}_-]/gu, "-")}-${mode}-profile.png`;
    const file = result.data
        ? new File([result.data], fileName, { type: "image/png" })
        : null;
    const payload = file
        ? {
              files: [file],
              title: t("profile.shareCardTitle", { name: username }),
              text: t("profile.shareText", { name: username }),
              url: new URL(
                  href(`/profile/${user.id}?mode=${mode}`),
                  window.location.origin
              ).href,
          }
        : null;
    const canCopy =
        typeof navigator !== "undefined" &&
        typeof navigator.clipboard?.write === "function" &&
        typeof ClipboardItem !== "undefined" &&
        (typeof ClipboardItem.supports !== "function" ||
            ClipboardItem.supports("image/png"));
    const canShare =
        payload !== null &&
        typeof navigator.share === "function" &&
        Boolean(navigator.canShare?.(payload));

    useEffect(() => {
        if (!result.data) return;
        const objectUrl = URL.createObjectURL(result.data);
        // This effect owns an external browser URL and revokes it on replacement
        // or close. Expose that acquired resource to the preview after commit.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [result.data]);

    const failed = result.isError || previewFailed;
    const preparing = result.isPending || !preview;
    const disabled = preparing || result.isFetching || status === "working";
    function download() {
        if (!preview) return;
        const anchor = document.createElement("a");
        anchor.href = preview;
        anchor.download = fileName;
        anchor.click();
    }
    async function copy() {
        if (!result.data || !canCopy) return;
        setStatus("working");
        try {
            await navigator.clipboard.write([
                new ClipboardItem({ "image/png": result.data }),
            ]);
            setStatus("copied");
        } catch {
            setStatus("error");
        }
    }
    async function share() {
        if (!payload) return;
        if (canShare) {
            setStatus("working");
            try {
                await navigator.share(payload);
                setStatus("idle");
            } catch (error) {
                setStatus(
                    error instanceof Error && error.name === "AbortError"
                        ? "idle"
                        : "error"
                );
            }
        } else {
            const intent = new URL("https://x.com/intent/post");
            intent.searchParams.set("text", `${payload.text}\n${payload.url}`);
            window.open(intent.href, "_blank", "noopener,noreferrer");
        }
    }
    return (
        <div className="nl-profile-share__body">
            {failed ? (
                <StatusMessage
                    severity="danger"
                    role="alert"
                    title={t("profile.cardError")}
                />
            ) : (
                <>
                    <div
                        className={cn(
                            "nl-profile-share__preview",
                            preparing && "nl-skeleton"
                        )}
                        aria-busy={preparing}
                    >
                        {preview ? (
                            <Image
                                src={preview}
                                width={1200}
                                height={630}
                                unoptimized
                                alt={t("profile.cardPreview", {
                                    name: username,
                                })}
                                onError={() => setPreviewFailed(true)}
                            />
                        ) : null}
                    </div>
                    {preparing ? (
                        <p className="nl-body-secondary nl-muted" role="status">
                            {t("profile.preparingImage")}
                        </p>
                    ) : null}
                    {status === "copied" ? (
                        <StatusMessage
                            severity="success"
                            role="status"
                            title={t("profile.copiedImage")}
                        />
                    ) : status === "error" ? (
                        <StatusMessage
                            severity="danger"
                            role="alert"
                            title={t("profile.imageError")}
                        />
                    ) : null}
                </>
            )}
            <div className="nl-profile-share__actions">
                {failed ? (
                    <Button
                        appearance="foundation"
                        variant="primary"
                        disabled={result.isFetching}
                        onClick={() => {
                            setPreview(null);
                            setPreviewFailed(false);
                            void result.refetch();
                        }}
                    >
                        {t("common.retry")}
                    </Button>
                ) : (
                    <>
                        <Button
                            className="nl-profile-share__save"
                            appearance="foundation"
                            variant="primary"
                            disabled={disabled}
                            onClick={download}
                        >
                            {t("profile.saveImage")}
                        </Button>
                        <div className="nl-profile-share__secondary">
                            <Button
                                appearance="foundation"
                                variant="secondary"
                                disabled={disabled || !canCopy}
                                onClick={() => void copy()}
                            >
                                {t("profile.copyImage")}
                            </Button>
                            <Button
                                appearance="foundation"
                                variant="secondary"
                                disabled={disabled}
                                onClick={() => void share()}
                            >
                                {t(
                                    canShare
                                        ? "profile.shareAction"
                                        : "profile.shareX"
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function ProfileShareDialog({
    user,
    mode,
    triggerClassName = "nl-profile-owner-action",
}: {
    user: ProfileUser;
    mode: ProfileMode;
    triggerClassName?: string;
}) {
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    return (
        <ModalDialog
            open={open}
            onOpenChange={setOpen}
            title={t("profile.shareTitle")}
            className="nl-profile-share"
            trigger={
                <button
                    type="button"
                    className={triggerClassName}
                    aria-label={t("profile.share")}
                >
                    <Share size={20} aria-hidden />
                </button>
            }
        >
            {open ? (
                <ProfileCardPreview key={mode} user={user} mode={mode} />
            ) : null}
        </ModalDialog>
    );
}
