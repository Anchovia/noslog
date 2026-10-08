"use client";

import { useRef, useState, useTransition } from "react";

import ActionButton from "@/components/ui/action-button";

export default function RecoveryAction({
    label,
    busyLabel,
    reset,
}: {
    label: string;
    busyLabel: string;
    reset?: () => void;
}) {
    const [pending, startTransition] = useTransition();
    const [reloading, setReloading] = useState(false);
    const activating = useRef(false);
    const busy = pending || reloading;
    return (
        <ActionButton
            variant="primary"
            busy={busy}
            onClick={() => {
                if (busy || activating.current) return;
                activating.current = true;
                if (reset) {
                    startTransition(() => reset());
                    queueMicrotask(() => {
                        activating.current = false;
                    });
                } else {
                    setReloading(true);
                    window.location.reload();
                }
            }}
        >
            <span aria-live="polite">{busy ? busyLabel : label}</span>
        </ActionButton>
    );
}
