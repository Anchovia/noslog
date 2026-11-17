"use client";

import { type ReactNode, useId, useState } from "react";

import Button from "@/components/ui/button";
import ModalDialog from "@/components/ui/modal-dialog";

// 삭제 확인(판 4 Supabase Text Confirm) — 지워지는 것 설명 → 이름 입력 → 전폭 위험 버튼. 취소 버튼 없이 닫기 · 바깥 누르기로 닫는다.
// 딸린 줄이 함께 지워지는 삭제만 confirmText 를 넘겨 이름을 입력하게 한다(2026-11-17 결정)
export default function AdminDeleteDialog({
    title,
    description,
    confirmText,
    actionLabel,
    onConfirm,
    trigger,
    pending = false,
}: {
    title: string;
    description: ReactNode;
    confirmText?: string;
    actionLabel: string;
    onConfirm: () => void;
    trigger: ReactNode;
    pending?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const [typed, setTyped] = useState("");
    const inputId = useId();
    const matched = confirmText === undefined || typed === confirmText;

    return (
        <ModalDialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (!next) setTyped("");
            }}
            title={title}
            size="small"
            trigger={trigger}
        >
            <div className="nl-admin-delete">
                <p className="nl-admin-delete__description">{description}</p>
                <form
                    className="nl-admin-delete__confirm"
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (matched && !pending) onConfirm();
                    }}
                >
                    {confirmText !== undefined ? (
                        <>
                            <label htmlFor={inputId}>
                                확인하려면 {confirmText} 를 입력하세요.
                            </label>
                            <input
                                id={inputId}
                                className="nl-input"
                                value={typed}
                                onChange={(event) =>
                                    setTyped(event.target.value)
                                }
                                placeholder={confirmText}
                                autoComplete="off"
                            />
                        </>
                    ) : null}
                    <Button
                        type="submit"
                        variant="danger"
                        className="nl-admin-delete__action"
                        disabled={!matched || pending}
                    >
                        {actionLabel}
                    </Button>
                </form>
            </div>
        </ModalDialog>
    );
}
