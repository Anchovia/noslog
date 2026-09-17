"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import ModalDialog from "@/components/ui/modalDialog";
import { StatusMessage } from "@/components/ui/statusMessage";

export default function DeleteContributionDialog({
    kind,
    scope = "",
    trigger,
    onConfirm,
    onDeleted,
    open: controlledOpen,
    onOpenChange,
}: {
    kind: "vote" | "evaluation" | "opinion";
    scope?: string;
    trigger?: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onConfirm: () => Promise<unknown>;
    onDeleted?: () => void;
}) {
    const t = useTranslations();
    const [internalOpen, setInternalOpen] = useState(false);
    const open = controlledOpen ?? internalOpen;
    const setOpen = onOpenChange ?? setInternalOpen;
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const confirmed = useRef(false);
    const handleDelete = async () => {
        setBusy(true);
        setError("");
        confirmed.current = true;
        try {
            await onConfirm();
            setOpen(false);
            if (onDeleted) requestAnimationFrame(onDeleted);
        } catch (error) {
            confirmed.current = false;
            setError(
                error instanceof Error
                    ? error.message
                    : t("community.action.failed")
            );
        } finally {
            setBusy(false);
        }
    };
    return (
        <ModalDialog
            open={open}
            onOpenChange={(next) => {
                if (!busy) {
                    setOpen(next);
                    setError("");
                }
            }}
            title={t(`community.delete.${kind}.title`, { scope })}
            description={t(`community.delete.${kind}.body`, { scope })}
            showClose={false}
            onCloseAutoFocus={(event) => {
                if (confirmed.current) event.preventDefault();
            }}
            trigger={trigger}
            footer={
                <>
                    <ActionButton
                        variant="secondary"
                        disabled={busy}
                        onClick={() => setOpen(false)}
                    >
                        {t("community.cancel")}
                    </ActionButton>
                    {/* 되돌릴 수 없는 기록 삭제는 모두 채운 위험 버튼 — 계정 · 공지 삭제와 같은 말투
                        (2026-09-17 · 09-18 사용자 지적: 의견 · 투표만 테두리 버튼이라 어긋났다) */}
                    <ActionButton
                        variant="danger"
                        destructiveFilled
                        busy={busy}
                        busyLabel={t("community.deleting")}
                        onClick={() => void handleDelete()}
                    >
                        {t(`community.delete.${kind}.action`)}
                    </ActionButton>
                </>
            }
        >
            {error ? (
                <StatusMessage severity="danger" role="alert" title={error} />
            ) : null}
        </ModalDialog>
    );
}
