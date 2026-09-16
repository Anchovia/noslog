"use client";

import * as Popover from "@radix-ui/react-popover";
import { useId, type ReactNode } from "react";

import ActionButton from "@/components/ui/actionButton";
import FullScreenDialog from "@/components/ui/fullScreenDialog";
import { useTranslations } from "@/components/i18n/localeProvider";

/**
 * 필터 그릇 — Compact 는 전체 레이어(배치 적용 · 하단 "결과 N개 보기"),
 * 672 이상은 트리거 아래 팝오버(즉시 적용 · footer 없음). 빙고 BINGO-25 그릇을 공용으로 승격.
 * 「초기화」 자리는 그릇에 따른다(2026-09-16): 전체 레이어는 발 왼쪽(「결과 N개 보기」 와 한 줄 — Airbnb · Nike · KREAM · 교보 등 9/22),
 * 팝오버는 즉시 적용이라 「적용」 짝이 없어 머리 줄 제목 | 초기화 (M).
 */
export default function FilterSurface({
    popover,
    open,
    onOpenChange,
    title,
    trigger,
    onReset,
    footer,
    children,
    onCloseAutoFocus,
}: {
    popover: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    trigger: ReactNode;
    onReset?: () => void;
    footer: ReactNode;
    children: ReactNode;
    onCloseAutoFocus?: (event: Event) => void;
}) {
    const titleId = useId();
    const t = useTranslations();
    if (!popover) {
        return (
            <FullScreenDialog
                {...{
                    open,
                    onOpenChange,
                    title,
                    trigger,
                    onReset,
                    footer,
                    onCloseAutoFocus,
                }}
            >
                {children}
            </FullScreenDialog>
        );
    }
    return (
        <Popover.Root open={open} onOpenChange={onOpenChange}>
            <Popover.Trigger asChild>{trigger}</Popover.Trigger>
            <Popover.Portal>
                <div className="noslog-ui">
                    <Popover.Content
                        className="nl-filter-popover"
                        align="start"
                        sideOffset={8}
                        collisionPadding={16}
                        aria-labelledby={titleId}
                    >
                        <div className="nl-filter-popover__head">
                            <h2 id={titleId} className="nl-component-title">
                                {title}
                            </h2>
                            {onReset ? (
                                <ActionButton
                                    variant="ghost"
                                    size="sm"
                                    onClick={onReset}
                                >
                                    {t("common.reset")}
                                </ActionButton>
                            ) : null}
                        </div>
                        {children}
                    </Popover.Content>
                </div>
            </Popover.Portal>
        </Popover.Root>
    );
}
