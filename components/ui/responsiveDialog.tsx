"use client";

import type { ReactNode } from "react";

import FullScreenDialog from "@/components/ui/fullScreenDialog";
import ModalDialog from "@/components/ui/modalDialog";
import useMediaQuery from "@/lib/hooks/useMediaQuery";

interface ResponsiveDialogProps {
    /** 외부 제어 열림 상태. 672 미만 전체 화면, 그 이상 모달이다. */
    open: boolean;
    /** 열림 변경 요청. 외부 상태를 호출부에서 갱신한다. */
    onOpenChange: (open: boolean) => void;
    title: string;
    children?: ReactNode;
    modalChildren?: ReactNode;
    fullScreenChildren?: ReactNode;
    footer?: ReactNode;
    /** 모달에서 공통 footer보다 우선한다. */
    modalFooter?: ReactNode;
    /** 전체 화면에서 공통 footer보다 우선한다. */
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
