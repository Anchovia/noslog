"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Trash2, X } from "lucide-react";
import { useState } from "react";

import { deleteAccount } from "@/app/(nevigation)/profile/settings/securityActions";

const DELETE_CONFIRMATION = "회원 탈퇴";

export default function AccountDeletionCard() {
    const [open, setOpen] = useState(false);
    const [confirmation, setConfirmation] = useState("");
    const [message, setMessage] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    async function submitDeletion() {
        if (isDeleting || confirmation !== DELETE_CONFIRMATION) return;

        setIsDeleting(true);
        setMessage("");
        const result = await deleteAccount(confirmation);
        if (result.success) {
            window.location.assign("/");
            return;
        }
        setMessage(result.message);
        setIsDeleting(false);
    }

    return (
        <section className="border-danger/35 bg-surface rounded-card border p-4">
            <h2 className="text-danger text-section">회원 탈퇴</h2>
            <p className="text-caption mt-1">
                계정과 모든 기록, 제출 자료를 영구 삭제합니다.
            </p>

            <Dialog.Root
                open={open}
                onOpenChange={(nextOpen) => {
                    if (isDeleting) return;
                    setOpen(nextOpen);
                    if (!nextOpen) {
                        setConfirmation("");
                        setMessage("");
                    }
                }}
            >
                <Dialog.Trigger asChild>
                    <button
                        type="button"
                        className="border-danger/40 text-danger hover:bg-danger/10 focus-visible:ring-danger/30 rounded-card mt-4 flex h-10 w-full items-center justify-center gap-2 border text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                        <Trash2 className="size-4" aria-hidden />
                        회원 탈퇴
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-40 bg-black/75" />
                    <Dialog.Content className="border-border bg-bg fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-90 -translate-x-1/2 -translate-y-1/2 rounded-lg border p-4 shadow-2xl focus:outline-none">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <Dialog.Title className="text-danger text-section">
                                    회원 탈퇴
                                </Dialog.Title>
                                <Dialog.Description className="text-caption mt-1">
                                    삭제한 정보는 복구할 수 없습니다.
                                </Dialog.Description>
                            </div>
                            <Dialog.Close className="text-text-secondary hover:text-text-primary flex size-9 shrink-0 items-center justify-center rounded-md">
                                <X className="size-5" aria-hidden />
                                <span className="sr-only">닫기</span>
                            </Dialog.Close>
                        </div>

                        <div className="mt-4 flex flex-col gap-3">
                            <div className="border-danger/30 bg-danger/10 text-body-muted rounded-card border p-3">
                                계정, 프로필, 플레이·동기화 기록, 커뮤니티 활동,
                                피드백, 검정 제출과 업로드 이미지가 즉시 영구
                                삭제됩니다.
                            </div>
                            <label className="text-text-secondary text-xs font-semibold">
                                계속하려면{" "}
                                <span className="text-text-primary">
                                    {DELETE_CONFIRMATION}
                                </span>
                                를 입력해주세요.
                                <input
                                    type="text"
                                    value={confirmation}
                                    onChange={(event) =>
                                        setConfirmation(event.target.value)
                                    }
                                    autoComplete="off"
                                    disabled={isDeleting}
                                    className="border-border bg-surface text-input focus:border-danger focus:ring-danger/20 rounded-card mt-1.5 h-11 w-full border px-3 outline-none focus:ring-2"
                                />
                            </label>
                            {message ? (
                                <p className="text-danger text-xs">{message}</p>
                            ) : null}
                            <button
                                type="button"
                                onClick={() => void submitDeletion()}
                                disabled={
                                    isDeleting ||
                                    confirmation !== DELETE_CONFIRMATION
                                }
                                className="bg-danger text-text-primary rounded-card h-11 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {isDeleting ? "삭제 중" : "모든 정보 영구 삭제"}
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </section>
    );
}
