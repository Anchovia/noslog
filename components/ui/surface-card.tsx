import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/**
 * 면 카드 — 1px 테두리(`border/divider`) · 모서리 4 · 안쪽 16 · 안 사이 8(2026-10-25 체계 묶음). 값은 모두 토큰(foundation.css)
 */
export default function SurfaceCard({
    className,
    ...props
}: ComponentProps<"div">) {
    return <div className={cn("nl-surface-card", className)} {...props} />;
}
