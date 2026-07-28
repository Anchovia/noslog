"use client";

import { regenerateSyncToken } from "@/app/(nevigation)/bookmarklet/action";
import Button from "@/components/ui/Button";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import * as Dialog from "@radix-ui/react-dialog";
import { KeyRound, LoaderCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function SyncTokenRegenerateButton() {
    const locale = useLocale();
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    function handleRegenerate() {
        startTransition(async () => {
            const result = await regenerateSyncToken(locale);

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
                    aria-label={t("sync.regenerate")}
                    title={t("sync.regenerate")}
                >
                    <KeyRound size={16} aria-hidden />
                </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/75" />
                <Dialog.Content className="border-border bg-bg fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-90 -translate-x-1/2 -translate-y-1/2 rounded-lg border p-4 shadow-2xl focus:outline-none">
                    <Dialog.Title className="text-section">
                        {t("sync.regenerate")}
                    </Dialog.Title>
                    <Dialog.Description className="text-caption mt-1">
                        {t("sync.regenerateDescription")}
                    </Dialog.Description>

                    <p className="border-score/30 bg-score/5 text-body-muted rounded-card mt-4 border p-3">
                        {t("sync.regenerateHelp")}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <Dialog.Close asChild>
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={isPending}
                            >
                                {t("sync.cancel")}
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
                                    {t("sync.regenerating")}
                                </>
                            ) : (
                                t("sync.regenerateAction")
                            )}
                        </Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
