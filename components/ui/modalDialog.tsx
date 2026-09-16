"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useId } from "react";
import type { ReactNode } from "react";

import { useTranslations } from "@/components/i18n/localeProvider";
import IconButton from "@/components/ui/iconButton";
import { cn } from "@/lib/utils";

export default function ModalDialog({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    trigger,
    showClose = true,
    width = "compact",
    onCloseAutoFocus,
    onOpenAutoFocus,
    className,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: ReactNode;
    description?: ReactNode;
    children?: ReactNode;
    footer?: ReactNode;
    trigger?: ReactNode;
    showClose?: boolean;
    width?: "compact" | "wide";
    onCloseAutoFocus?: (event: Event) => void;
    onOpenAutoFocus?: (event: Event) => void;
    className?: string;
}) {
    const t = useTranslations();
    const descriptionId = useId();
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            {trigger ? (
                <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
            ) : null}
            <Dialog.Portal>
                <div className="noslog-ui">
                    <Dialog.Overlay className="nl-dialog-overlay" />
                    <Dialog.Content
                        className={cn(
                            "nl-dialog",
                            `nl-dialog--${width}`,
                            className
                        )}
                        onCloseAutoFocus={onCloseAutoFocus}
                        onOpenAutoFocus={onOpenAutoFocus}
                        aria-describedby={
                            description ? descriptionId : undefined
                        }
                    >
                        <div className="nl-dialog__header">
                            <Dialog.Title className="nl-component-title">
                                {title}
                            </Dialog.Title>
                            {showClose ? (
                                /* 창 머리 가장자리 닫기 — 전체 화면 창과 같은 IconButton · 아이콘 24, 잉크를 안쪽 24 선에 맞춰 당김 */
                                <Dialog.Close asChild>
                                    <IconButton
                                        className="nl-dialog__close"
                                        label={t("common.close")}
                                    >
                                        <X
                                            className="nl-icon nl-icon--large"
                                            aria-hidden
                                        />
                                    </IconButton>
                                </Dialog.Close>
                            ) : null}
                        </div>
                        {description ? (
                            <Dialog.Description
                                id={descriptionId}
                                className="nl-body nl-muted"
                            >
                                {description}
                            </Dialog.Description>
                        ) : null}
                        {children}
                        {footer ? (
                            <div className="nl-dialog__actions">{footer}</div>
                        ) : null}
                    </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
