"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { regenerateSyncToken } from "@/app/(site)/bookmarklet/action";
import { useLocale, useTranslations } from "@/components/i18n/locale-provider";
import ActionButton from "@/components/ui/action-button";
import Button, { foundationButtonClass } from "@/components/ui/button";
import ModalDialog from "@/components/ui/modal-dialog";
import { StatusMessage } from "@/components/ui/status-message";

export default function SyncInvalidation({
    onInvalidated,
}: {
    onInvalidated: () => void;
}) {
    const locale = useLocale();
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();
    const [failed, setFailed] = useState(false);
    const cancel = useRef<HTMLButtonElement>(null);
    const invalidated = useRef(false);
    function invalidate() {
        if (pending) return;
        startTransition(async () => {
            try {
                const result = await regenerateSyncToken(locale);
                if (!result.success) {
                    setFailed(true);
                    return;
                }
                invalidated.current = true;
                setOpen(false);
                toast.success(result.message);
            } catch {
                setFailed(true);
            }
        });
    }
    return (
        <ModalDialog
            open={open}
            onOpenChange={(next) => {
                if (!pending) {
                    setOpen(next);
                    setFailed(false);
                }
            }}
            title={t("sync.invalidate")}
            description={t("sync.invalidateHelp")}
            variant="confirm"
            trigger={
                <Button variant="danger" destructiveFilled>
                    {t("sync.invalidate")}
                </Button>
            }
            onOpenAutoFocus={(event) => {
                event.preventDefault();
                cancel.current?.focus();
            }}
            onCloseAutoFocus={(event) => {
                if (invalidated.current) {
                    event.preventDefault();
                    invalidated.current = false;
                    onInvalidated();
                }
            }}
            footer={
                <>
                    <button
                        ref={cancel}
                        type="button"
                        className={foundationButtonClass({
                            variant: "secondary",
                        })}
                        disabled={pending}
                        onClick={() => setOpen(false)}
                    >
                        {t("sync.cancel")}
                    </button>
                    <ActionButton
                        variant="danger"
                        destructiveFilled
                        busy={pending}
                        busyLabel={t("sync.regenerating")}
                        onClick={invalidate}
                    >
                        {t("sync.invalidateConfirm")}
                    </ActionButton>
                </>
            }
        >
            {failed ? (
                <StatusMessage
                    severity="danger"
                    role="alert"
                    title={t("sync.regenerateError")}
                />
            ) : null}
        </ModalDialog>
    );
}
