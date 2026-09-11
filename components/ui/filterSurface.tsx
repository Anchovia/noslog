"use client";

import * as Popover from "@radix-ui/react-popover";
import type { ReactNode } from "react";

import FullScreenDialog from "@/components/ui/fullScreenDialog";

/**
 * 필터 그릇 — Compact 는 전체 레이어(배치 적용 · 하단 "결과 N개 보기"),
 * 672 이상은 트리거 아래 팝오버(즉시 적용 · footer 없음). 빙고 BINGO-25 그릇을 공용으로 승격.
 */
export default function FilterSurface({
    popover,
    open,
    onOpenChange,
    title,
    trigger,
    headerAction,
    footer,
    children,
    onCloseAutoFocus,
}: {
    popover: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    trigger: ReactNode;
    headerAction?: ReactNode;
    footer: ReactNode;
    children: ReactNode;
    onCloseAutoFocus?: (event: Event) => void;
}) {
    if (!popover) {
        return (
            <FullScreenDialog
                {...{
                    open,
                    onOpenChange,
                    title,
                    trigger,
                    headerAction,
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
                        aria-label={title}
                    >
                        {headerAction ? (
                            <div className="nl-filter-popover__head">
                                {headerAction}
                            </div>
                        ) : null}
                        {children}
                    </Popover.Content>
                </div>
            </Popover.Portal>
        </Popover.Root>
    );
}
