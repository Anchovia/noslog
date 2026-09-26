"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { deleteOwnEvent } from "@/app/(nevigation)/events/actions";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import ModalDialog from "@/components/ui/modalDialog";
import { StatusMessage } from "@/components/ui/statusMessage";

// 작성자 글 삭제(2026-09-18 D1 · P1) — 빨간 테두리 버튼 → 확인 창(Compact · 채운 빨강). 공개 중이면 사라지는 곳을 한 줄 더 알린다
export default function EventDeleteButton({
    id,
    title,
    isPublic,
}: {
    id: number;
    title: string;
    isPublic: boolean;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const href = useLocalizedHref();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    async function remove() {
        setBusy(true);
        setError("");
        try {
            const result = await deleteOwnEvent(id, locale);
            if (!result.success) {
                setError(result.message);
                return;
            }
            toast.success(result.message);
            setOpen(false);
            router.replace(href("/events/mine"));
            router.refresh();
        } catch {
            setError(t("events.delete.failed"));
        } finally {
            setBusy(false);
        }
    }

    return (
        <ModalDialog
            open={open}
            onOpenChange={(next) => {
                if (!busy) {
                    setOpen(next);
                    setError("");
                }
            }}
            title={t("events.delete.title")}
            description={t(
                isPublic ? "events.delete.bodyPublic" : "events.delete.body",
                { title }
            )}
            variant="confirm"
            trigger={
                <ActionButton variant="danger">
                    {t("events.delete.button")}
                </ActionButton>
            }
            footer={
                <>
                    <ActionButton
                        variant="secondary"
                        disabled={busy}
                        onClick={() => setOpen(false)}
                    >
                        {t("events.actions.cancel")}
                    </ActionButton>
                    <ActionButton
                        variant="danger"
                        destructiveFilled
                        busy={busy}
                        busyLabel={t("events.delete.deleting")}
                        onClick={() => void remove()}
                    >
                        {t("events.delete.button")}
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
