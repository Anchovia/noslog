"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { stripLocaleFromPath } from "@/lib/i18n/routing";

// Root recovery is shared with locked routes. Keep their existing presentation.
export default function RecoveryBoundary({
    ordinary,
    legacy,
}: {
    ordinary: ReactNode;
    legacy: ReactNode;
}) {
    const path = stripLocaleFromPath(usePathname());
    const preserved =
        /^\/admin(?:\/|$)/.test(path) ||
        /^\/music\/[^/]+\/[^/]+\/pattern(?:\/|$)/.test(path);
    return preserved ? legacy : ordinary;
}
