"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

import IconButton from "@/components/ui/icon-button";

// 오른쪽 서랍(판 3 Medusa Drawer) — 머리(제목 · 닫기) · 본문(여기만 스크롤) · 바닥(오른쪽 버튼).
// 나타날 때는 대화상자와 같은 페이드만 쓴다(새 움직임 없음, 2026-11-17 결정)
export default function AdminDrawer({
    open,
    onOpenChange,
    title,
    children,
    footer,
    trigger,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    trigger?: ReactNode;
}) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            {trigger ? (
                <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
            ) : null}
            <Dialog.Portal>
                <div className="noslog-ui">
                    <Dialog.Overlay className="nl-dialog-overlay" />
                    <Dialog.Content
                        className="nl-admin-drawer"
                        aria-describedby={undefined}
                    >
                        <div className="nl-admin-drawer__head">
                            <Dialog.Title className="nl-admin-card__title">
                                {title}
                            </Dialog.Title>
                            <Dialog.Close asChild>
                                <IconButton size="compact" label="닫기">
                                    <X className="nl-icon" aria-hidden />
                                </IconButton>
                            </Dialog.Close>
                        </div>
                        <div className="nl-admin-drawer__body">{children}</div>
                        {footer ? (
                            <div className="nl-admin-drawer__foot">
                                {footer}
                            </div>
                        ) : null}
                    </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
