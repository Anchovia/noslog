"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useId } from "react";
import type { ReactNode } from "react";

import { useTranslations } from "@/components/i18n/localeProvider";
import IconButton from "@/components/ui/iconButton";
import { cn } from "@/lib/utils";

/**
 * 대화상자(2026-09-26 A, GitHub · Primer 3칸 창) — 머리(제목 + 닫기 + 아래 구분선) · 본문(여기만 스크롤) · 발(버튼 오른쪽, 위 구분선).
 * 크기 = small 440 · medium 560(기본) · large 768. 확인 창(`variant="confirm"`)은 small · 큰 제목 · 구분선 없음 · 닫기 없음.
 * 672 미만: 입력 칸이 있는 창은 전체 화면, 그 밖은 아래 시트(Primer 좁은 화면 규칙, CSS 가 내용으로 가른다).
 */
export default function ModalDialog({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    trigger,
    showClose,
    size,
    variant = "default",
    sheet = false,
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
    /** 기본 = 확인 창이 아니면 보임 */
    showClose?: boolean;
    /** small 440 · medium 560 · large 768(읽기 폭). 기본 = 확인 창 small, 그 밖 medium */
    size?: "small" | "medium" | "large";
    /** confirm = 되돌릴 수 없는 결정 · 경고(큰 제목 · 구분선 없음 · 닫기 없음) */
    variant?: "default" | "confirm";
    /** 1055 이하에서 화면 아래에 붙는 시트로(2026-09-26, 유튜브 폰 설명 창). 넓은 화면은 가운데 창 그대로 */
    sheet?: boolean;
    onCloseAutoFocus?: (event: Event) => void;
    onOpenAutoFocus?: (event: Event) => void;
    className?: string;
}) {
    const t = useTranslations();
    const descriptionId = useId();
    const confirm = variant === "confirm";
    const closeVisible = showClose ?? !confirm;
    const dialogSize = size ?? (confirm ? "small" : "medium");
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
                            `nl-dialog--${dialogSize}`,
                            confirm && "nl-dialog--confirm",
                            sheet && "nl-dialog--sheet",
                            className
                        )}
                        onCloseAutoFocus={onCloseAutoFocus}
                        onOpenAutoFocus={onOpenAutoFocus}
                        aria-describedby={
                            description ? descriptionId : undefined
                        }
                    >
                        <div className="nl-dialog__header">
                            <Dialog.Title
                                className={
                                    confirm
                                        ? "nl-section-title"
                                        : "nl-component-title"
                                }
                            >
                                {title}
                            </Dialog.Title>
                            {closeVisible ? (
                                /* 머리 오른쪽 닫기 — 컴팩트 아이콘 버튼(M) · 아이콘 20 */
                                <Dialog.Close asChild>
                                    <IconButton
                                        className="nl-dialog__close"
                                        size="compact"
                                        label={t("common.close")}
                                    >
                                        <X className="nl-icon" aria-hidden />
                                    </IconButton>
                                </Dialog.Close>
                            ) : null}
                        </div>
                        <div className="nl-dialog__body">
                            {description ? (
                                <Dialog.Description
                                    id={descriptionId}
                                    className="nl-body-secondary nl-muted"
                                >
                                    {description}
                                </Dialog.Description>
                            ) : null}
                            {children}
                        </div>
                        {footer ? (
                            <div className="nl-dialog__footer nl-dialog__actions">
                                {footer}
                            </div>
                        ) : null}
                    </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
