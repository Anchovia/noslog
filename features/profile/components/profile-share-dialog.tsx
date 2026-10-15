"use client";

import { useQuery } from "@tanstack/react-query";
import { Check, Share } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import type {
    ProfileMode,
    ProfileUser,
} from "@/components/profile/dashboard/profile-types";
import { formatProfileDate } from "@/components/profile/dashboard/profile-utils";
import ActionButton from "@/components/ui/action-button";
import Button from "@/components/ui/button";
import ModalDialog from "@/components/ui/modal-dialog";
import { LoadingStatus } from "@/components/ui/skeleton";
import { StatusMessage } from "@/components/ui/status-message";
import { profileCardOptions } from "@/features/profile/api/profile-card";
import { getProfileCardMode } from "@/features/profile/profile-card-model";
import { cn } from "@/lib/cn";

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
        "idle" | "copying" | "sharing" | "copied" | "error"
    >("idle");
    // 「✓ 복사됨」 은 2초 뒤 원래 글자로
    useEffect(() => {
        if (status !== "copied") return;
        const timer = window.setTimeout(() => setStatus("idle"), 2000);
        return () => window.clearTimeout(timer);
    }, [status]);
    const username = user.username || t("profile.shareUser");
    const locale = useLocale();
    const card = getProfileCardMode(user, mode);
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
    // 준비 전에만 비활성 — 복사 · 공유 중에는 누른 버튼이 바쁨(스피너)을 보인다(가이드 「바쁨은 비활성이 아니다」)
    const disabled = preparing || result.isFetching;
    function download() {
        if (!preview) return;
        const anchor = document.createElement("a");
        anchor.href = preview;
        anchor.download = fileName;
        anchor.click();
    }
    async function copy() {
        if (!result.data || !canCopy) return;
        setStatus("copying");
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
            setStatus("sharing");
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
        <div className="nl-image-share__body">
            {failed ? (
                <StatusMessage
                    severity="danger"
                    role="alert"
                    title={t("profile.cardError")}
                />
            ) : (
                <>
                    {/* 카드 묶음(2026-09-26 A) — 1055 이하에서 화면 세로 가운데, 아래 한 줄 = 카드에 담긴 모드 · 기준일 */}
                    <div className="nl-profile-share__stage">
                        <div
                            className={cn(
                                "nl-image-share__preview nl-profile-card-preview",
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
                        <p className="nl-metadata nl-muted nl-profile-share__caption">
                            {`1200 × 630 · ${card.label} · ${t("profile.asOf", {
                                date: formatProfileDate(
                                    user.hide_play_activity
                                        ? null
                                        : user.last_played_at,
                                    locale,
                                    t("profile.noRecord")
                                ),
                            })}`}
                        </p>
                        {preparing ? (
                            <LoadingStatus
                                label={t("profile.preparingImage")}
                            />
                        ) : null}
                    </div>
                    {/* 복사 성공은 상자 대신 버튼 글자가 잠깐 「✓ 복사됨」(2026-09-28 인상 점검 A1 · GitHub 복사 버튼) — 알림은 화면 읽기로 */}
                    {status === "copied" ? (
                        <span className="sr-only" role="status">
                            {t("profile.copiedImage")}
                        </span>
                    ) : status === "error" ? (
                        <StatusMessage
                            severity="danger"
                            role="alert"
                            title={t("profile.imageError")}
                        />
                    ) : null}
                </>
            )}
            <div className="nl-image-share__actions">
                {failed ? (
                    <ActionButton
                        variant="primary"
                        busy={result.isFetching}
                        busyLabel={t("recovery.retrying")}
                        onClick={() => {
                            setPreview(null);
                            setPreviewFailed(false);
                            void result.refetch();
                        }}
                    >
                        {t("common.retry")}
                    </ActionButton>
                ) : (
                    <>
                        <Button
                            className="nl-image-share__save"
                            variant="primary"
                            disabled={disabled}
                            onClick={download}
                        >
                            {t("profile.saveImage")}
                        </Button>
                        <div className="nl-image-share__secondary">
                            <ActionButton
                                variant="secondary"
                                busy={status === "copying"}
                                busyLabel={t("profile.copyingImage")}
                                disabled={disabled || !canCopy}
                                onClick={() => void copy()}
                            >
                                {status === "copied" ? (
                                    <>
                                        <Check
                                            className="nl-icon-small"
                                            aria-hidden
                                        />
                                        {t("common.copied")}
                                    </>
                                ) : (
                                    t("profile.copyImage")
                                )}
                            </ActionButton>
                            <ActionButton
                                variant="secondary"
                                busy={status === "sharing"}
                                busyLabel={t("profile.sharing")}
                                disabled={disabled}
                                onClick={() => void share()}
                            >
                                {t(
                                    canShare
                                        ? "profile.shareAction"
                                        : "profile.shareX"
                                )}
                            </ActionButton>
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
    triggerClassName,
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
            className="nl-image-share"
            trigger={
                <button
                    type="button"
                    className={triggerClassName}
                    aria-label={t("profile.share")}
                >
                    <Share className="nl-icon" aria-hidden />
                </button>
            }
        >
            {open ? (
                <ProfileCardPreview key={mode} user={user} mode={mode} />
            ) : null}
        </ModalDialog>
    );
}
