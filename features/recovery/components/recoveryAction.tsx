"use client";

import { useRef, useState, useTransition } from "react";
import Button from "@/components/ui/Button";

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
        <Button
            appearance="foundation"
            variant="primary"
            aria-busy={busy}
            aria-disabled={busy}
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
        </Button>
    );
}
