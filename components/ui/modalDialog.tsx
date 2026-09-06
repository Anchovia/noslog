"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useId } from "react";
import type { ReactNode } from "react";

import { useTranslations } from "@/components/i18n/localeProvider";
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
                        className={cn("nl-dialog", `nl-dialog--${width}`)}
                        onCloseAutoFocus={onCloseAutoFocus}
                        aria-describedby={
                            description ? descriptionId : undefined
                        }
                    >
                        <div className="nl-dialog__header">
                            <Dialog.Title className="nl-component-title">
                                {title}
                            </Dialog.Title>
                            {showClose ? (
                                <Dialog.Close
                                    className="nl-dialog__close"
                                    aria-label={t("common.close")}
                                >
                                    <X className="nl-icon" aria-hidden />
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
