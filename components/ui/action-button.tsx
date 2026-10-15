"use client";

import type { ComponentProps } from "react";

import Button from "@/components/ui/button";

type ActionButtonProps = ComponentProps<typeof Button> & {
    /** false 기본. busy 중 클릭을 막지만 form의 Enter 제출 잠금은 호출부 책임이다. */
    busy?: boolean;
    /** busy 중 children 대신 표시할 번역된 문구. 생략하면 children을 유지한다. */
    busyLabel?: string;
};

export default function ActionButton({
    busy = false,
    busyLabel,
    children,
    onClick,
    ...props
}: ActionButtonProps) {
    return (
        <Button
            {...props}
            aria-busy={busy || undefined}
            aria-disabled={busy || props.disabled || undefined}
            onClick={(event) => {
                if (busy) {
                    event.preventDefault();
                    return;
                }
                onClick?.(event);
            }}
        >
            {busy ? <span className="nl-spinner" aria-hidden /> : null}
            {busy && busyLabel ? busyLabel : children}
        </Button>
    );
}
