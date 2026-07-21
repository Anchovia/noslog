"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Clipboard, Download, Share2, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import type { ProfileMode, ProfileUser } from "./profileTypes";

interface ProfileShareDialogProps {
    user: ProfileUser;
    mode: ProfileMode;
}

type ShareStatus = "idle" | "loading" | "copied" | "error";

function getCardFileName(user: ProfileUser, mode: ProfileMode) {
    const name = (user.username || "noslog-user")
        .trim()
        .replaceAll(/[^a-zA-Z0-9가-힣_-]+/g, "-")
        .replaceAll(/^-|-$/g, "");

    return `${name || "noslog-user"}-${mode}-profile.png`;
}

async function getProfileCardBlob(imageUrl: string) {
    const response = await fetch(imageUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("프로필 카드 생성에 실패했습니다.");
    return response.blob();
}

// 프로필 카드 미리보기와 이미지 공유 동작을 한곳에서 관리함
export default function ProfileShareDialog({
    user,
    mode,
}: ProfileShareDialogProps) {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState<ShareStatus>("idle");

    const imageUrl = useMemo(
        () => `/profile/${user.id}/card?mode=${mode}`,
        [mode, user.id]
    );
    const fileName = getCardFileName(user, mode);

    async function downloadImage() {
        setStatus("loading");

        try {
            const blob = await getProfileCardBlob(imageUrl);
            const objectUrl = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = objectUrl;
            anchor.download = fileName;
            anchor.click();
            URL.revokeObjectURL(objectUrl);
            setStatus("idle");
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    }

    async function copyImage() {
        setStatus("loading");

        try {
            const blob = await getProfileCardBlob(imageUrl);
            await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
            ]);
            setStatus("copied");
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    }

    async function shareToX() {
        const profileUrl = window.location.href.split("?")[0];
        const username = user.username || "NosLog 유저";

        try {
            const blob = await getProfileCardBlob(imageUrl);
            const file = new File([blob], fileName, { type: "image/png" });

            if (navigator.share && navigator.canShare?.({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: `${username} NosLog 프로필`,
                    text: `${username}님의 NOSTALGIA 기록`,
                    url: profileUrl,
                });
                return;
            }
        } catch (error) {
            if (error instanceof Error && error.name === "AbortError") return;
            console.error(error);
        }

        const intent = new URL("https://x.com/intent/post");
        intent.searchParams.set(
            "text",
            `${username}님의 NOSTALGIA 기록\n${profileUrl}`
        );
        window.open(intent.toString(), "_blank", "noopener,noreferrer");
    }

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);
        setStatus("idle");
    }

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Trigger asChild>
                <button
                    type="button"
                    className="border-border text-text-secondary hover:bg-surface-muted hover:text-text-primary focus-visible:ring-focus/40 flex size-9 cursor-pointer items-center justify-center rounded-md border transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    aria-label="프로필 카드 공유"
                >
                    <Share2 size={16} />
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/75" />
                <Dialog.Content className="bg-bg fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border p-4 shadow-2xl focus:outline-none">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <Dialog.Title className="text-section font-bold">
                            프로필 카드 내보내기
                        </Dialog.Title>
                        <Dialog.Close
                            className="text-text-secondary hover:bg-surface-muted hover:text-text-primary focus-visible:ring-focus/40 flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
                            aria-label="닫기"
                        >
                            <X size={17} />
                        </Dialog.Close>
                    </div>

                    <div className="border-border bg-surface-muted aspect-[1200/630] overflow-hidden rounded-md border">
                        <Image
                            src={imageUrl}
                            alt={`${user.username || "유저"} 프로필 카드 미리보기`}
                            width={1200}
                            height={630}
                            unoptimized
                            className="h-full w-full object-cover"
                            priority
                        />
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <button
                            type="button"
                            onClick={() => void downloadImage()}
                            disabled={status === "loading"}
                            className="bg-text-primary text-bg focus-visible:ring-focus/40 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-bold transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-wait disabled:opacity-50"
                        >
                            <Download size={16} />
                            이미지 저장
                        </button>
                        <button
                            type="button"
                            onClick={() => void copyImage()}
                            disabled={status === "loading"}
                            className="border-border text-text-primary hover:bg-surface-muted focus-visible:ring-focus/40 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-wait disabled:opacity-50"
                        >
                            <Clipboard size={16} />
                            클립보드 복사
                        </button>
                        <button
                            type="button"
                            onClick={() => void shareToX()}
                            disabled={status === "loading"}
                            className="border-border text-text-primary hover:bg-surface-muted focus-visible:ring-focus/40 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-wait disabled:opacity-50"
                            aria-label="X 공유"
                        >
                            <span
                                className="text-base leading-none"
                                aria-hidden
                            >
                                X
                            </span>
                            공유
                        </button>
                    </div>

                    <p
                        className="text-caption mt-2 min-h-4 text-center"
                        aria-live="polite"
                    >
                        {status === "loading"
                            ? "이미지를 준비하고 있습니다."
                            : null}
                        {status === "copied"
                            ? "이미지를 클립보드에 복사했습니다."
                            : null}
                        {status === "error"
                            ? "이미지를 처리하지 못했습니다."
                            : null}
                    </p>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
