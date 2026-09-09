"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import RecoveryContent from "@/features/recovery/components/recoveryContent";
import { recordClientError } from "@/lib/observability/client";
import { stripLocaleFromPath } from "@/lib/i18n/routing";

export default function OrdinaryError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();
    const path = stripLocaleFromPath(usePathname());
    const preserved =
        /^\/admin(?:\/|$)/.test(path) ||
        /^\/music\/[^/]+\/[^/]+\/pattern(?:\/|$)/.test(path);
    useEffect(() => {
        if (!preserved) recordClientError(error, "ordinary-error-boundary");
    }, [error, preserved]);
    // The locked experiences must reach the original parent boundary, including
    // its original shell replacement, rather than this new nested boundary.
    if (preserved) throw error;
    return (
        <RecoveryContent
            reset={() => {
                router.refresh();
                reset();
            }}
        />
    );
}
