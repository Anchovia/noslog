"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

import { useTranslations } from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import IconButton from "@/components/ui/iconButton";
import useOverlayHistory from "@/lib/hooks/useOverlayHistory";

export default function FullScreenDialog({
    open,
    onOpenChange,
    title,
    children,
    footer,
    trigger,
    onReset,
    onCloseAutoFocus,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: ReactNode;
    footer: ReactNode;
    /** 바깥에서 open 을 다룰 때(메뉴 항목에서 여는 창 등)는 비운다 */
    trigger?: ReactNode;
    /** 「초기화」 — 발 왼쪽 고스트 L, 오른쪽 주 액션과 한 줄 (2026-09-16: 폰 필터 22곳 중 발 왼쪽 9 · 머리 오른쪽 1) */
    onReset?: () => void;
    onCloseAutoFocus?: (event: Event) => void;
}) {
    const t = useTranslations();
    useOverlayHistory(open, () => onOpenChange(false));
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            {trigger ? (
                <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
            ) : null}
            <Dialog.Portal>
                <div className="noslog-ui">
                    <Dialog.Overlay className="nl-dialog-overlay" />
                    <Dialog.Content
                        className="nl-full-dialog"
                        aria-describedby={undefined}
                        onCloseAutoFocus={onCloseAutoFocus}
                    >
                        <div className="nl-full-dialog__header">
                            <Dialog.Title className="nl-component-title">
                                {title}
                            </Dialog.Title>
                            {/* 가장자리 닫기 — 아이콘 24 · 머리 오른쪽 패딩 8 (레이어 머리 광학 여백 결정) */}
                            <Dialog.Close asChild>
                                <IconButton label={t("common.close")}>
                                    <X
                                        className="nl-icon nl-icon--large"
                                        aria-hidden
                                    />
                                </IconButton>
                            </Dialog.Close>
                        </div>
                        <div className="nl-full-dialog__body">{children}</div>
                        <div className="nl-full-dialog__footer">
                            {onReset ? (
                                <ActionButton
                                    variant="ghost"
                                    className="nl-full-dialog__reset"
                                    onClick={onReset}
                                >
                                    {t("common.reset")}
                                </ActionButton>
                            ) : null}
                            {footer}
                        </div>
                    </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
