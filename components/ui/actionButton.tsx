"use client";

import type { ComponentProps } from "react";

import Button from "@/components/ui/Button";

type ActionButtonProps = ComponentProps<typeof Button> & {
    busy?: boolean;
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
            appearance="foundation"
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
