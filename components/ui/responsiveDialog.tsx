"use client";

import type { ReactNode } from "react";

import FullScreenDialog from "@/components/ui/fullScreenDialog";
import ModalDialog from "@/components/ui/modalDialog";
import useMediaQuery from "@/lib/hooks/useMediaQuery";

interface ResponsiveDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children?: ReactNode;
    modalChildren?: ReactNode;
    fullScreenChildren?: ReactNode;
    footer?: ReactNode;
    modalFooter?: ReactNode;
    fullScreenFooter?: ReactNode;
    trigger?: ReactNode;
    size?: "small" | "medium" | "large";
    className?: string;
    onCloseAutoFocus?: (event: Event) => void;
    onOpenAutoFocus?: (event: Event) => void;
}

/** 긴 창의 공용 그릇 — 672 미만 전체 화면, 그 이상은 가운데 모달 */
export default function ResponsiveDialog({
    open,
    onOpenChange,
    title,
    children,
    modalChildren,
    fullScreenChildren,
    footer,
    modalFooter,
    fullScreenFooter,
    trigger,
    size,
    className,
    onCloseAutoFocus,
    onOpenAutoFocus,
}: ResponsiveDialogProps) {
    const wide = useMediaQuery("(min-width: 672px)");

    if (wide) {
        return (
            <ModalDialog
                open={open}
                onOpenChange={onOpenChange}
                title={title}
                footer={modalFooter ?? footer}
                trigger={trigger}
                size={size}
                className={className}
                onCloseAutoFocus={onCloseAutoFocus}
                onOpenAutoFocus={onOpenAutoFocus}
            >
                {modalChildren ?? children}
            </ModalDialog>
        );
    }

    return (
        <FullScreenDialog
            open={open}
            onOpenChange={onOpenChange}
            title={title}
            footer={fullScreenFooter ?? footer ?? null}
            trigger={trigger}
            onCloseAutoFocus={onCloseAutoFocus}
        >
            {fullScreenChildren ?? children ?? null}
        </FullScreenDialog>
    );
}
