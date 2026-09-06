"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useEffectEvent, useId } from "react";
import type { ReactNode } from "react";

import { useTranslations } from "@/components/i18n/localeProvider";

export default function FullScreenDialog({
    open,
    onOpenChange,
    title,
    children,
    footer,
    trigger,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: ReactNode;
    footer: ReactNode;
    trigger: ReactNode;
}) {
    const t = useTranslations();
    const historyId = useId();
    const closeFromHistory = useEffectEvent(() => onOpenChange(false));
    useEffect(() => {
        if (!open) return;
        window.history.pushState(
            { ...window.history.state, noslogOverlay: historyId },
            ""
        );
        const handleBack = () => {
            if (window.history.state?.noslogOverlay !== historyId)
                closeFromHistory();
        };
        window.addEventListener("popstate", handleBack);
        return () => {
            window.removeEventListener("popstate", handleBack);
            if (window.history.state?.noslogOverlay === historyId)
                window.history.back();
        };
    }, [open, historyId]);
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
            <Dialog.Portal>
                <div className="noslog-ui">
                    <Dialog.Overlay className="nl-dialog-overlay" />
                    <Dialog.Content
                        className="nl-full-dialog"
                        aria-describedby={undefined}
                    >
                        <div className="nl-full-dialog__header">
                            <Dialog.Title className="nl-component-title">
                                {title}
                            </Dialog.Title>
                            <Dialog.Close
                                className="nl-icon-button"
                                aria-label={t("common.close")}
                            >
                                <X className="nl-icon" aria-hidden />
                            </Dialog.Close>
                        </div>
                        <div className="nl-full-dialog__body">{children}</div>
                        <div className="nl-full-dialog__footer">{footer}</div>
                    </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
