import type { ComponentPropsWithRef, ReactNode } from "react";

import Button from "@/components/ui/Button";

type IconButtonProps = Omit<
    ComponentPropsWithRef<"button">,
    "aria-label" | "children"
> & {
    /** 접근 이름 — 아이콘만 있으므로 반드시 받는다 */
    label: string;
    /** 아이콘 하나. 기본 20(`nl-icon`), 가장자리 닫기처럼 정해 둔 곳만 24 */
    children: ReactNode;
    variant?: "ghost" | "secondary" | "primary";
};

/**
 * 아이콘만 있는 버튼 — 공용 버튼 규격을 그대로 받는다(데스크톱 40 · 모바일 44 · 모서리 8 · 올림 · 누름 · 포커스).
 * 기본은 면 없는 고스트. Radix `asChild` 트리거 안에 그대로 넣을 수 있다. 2026-09-14 부품 결정 ①
 */
export default function IconButton({
    label,
    children,
    variant = "ghost",
    ...props
}: IconButtonProps) {
    return (
        <Button {...props} variant={variant} size="icon" aria-label={label}>
            {children}
        </Button>
    );
}
