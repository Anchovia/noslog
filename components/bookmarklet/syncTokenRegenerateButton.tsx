"use client";

import { regenerateSyncToken } from "@/app/(nevigation)/bookmarklet/action";
import Button from "@/components/ui/Button";
import * as Dialog from "@radix-ui/react-dialog";
import { KeyRound, LoaderCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function SyncTokenRegenerateButton() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    function handleRegenerate() {
        startTransition(async () => {
            const result = await regenerateSyncToken();

            if (result.success) {
                setOpen(false);
                toast.success(result.message);
                return;
            }

            toast.error(result.message);
        });
    }

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(nextOpen) => {
                if (isPending) return;
                setOpen(nextOpen);
            }}
        >
            <Dialog.Trigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="연동 토큰 재발급"
                    title="연동 토큰 재발급"
                >
                    <KeyRound size={16} aria-hidden />
                </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/75" />
                <Dialog.Content className="border-border bg-bg fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-90 -translate-x-1/2 -translate-y-1/2 rounded-lg border p-4 shadow-2xl focus:outline-none">
                    <Dialog.Title className="text-section">
                        연동 토큰 재발급
                    </Dialog.Title>
                    <Dialog.Description className="text-caption mt-1">
                        기존 북마클릿이 즉시 만료됩니다.
                    </Dialog.Description>

                    <p className="border-score/30 bg-score/5 text-body-muted rounded-card mt-4 border p-3">
                        재발급 후 아래의 NosLog 동기화 버튼을 북마크바에 다시
                        등록해주세요.
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <Dialog.Close asChild>
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={isPending}
                            >
                                취소
                            </Button>
                        </Dialog.Close>
                        <Button
                            type="button"
                            className="gap-2"
                            disabled={isPending}
                            onClick={handleRegenerate}
                        >
                            {isPending ? (
                                <>
                                    <LoaderCircle
                                        className="size-4 animate-spin"
                                        aria-hidden
                                    />
                                    재발급 중
                                </>
                            ) : (
                                "재발급"
                            )}
                        </Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
