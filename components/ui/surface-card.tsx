import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/**
 * 면 카드 — 면 `surface/surface` · 1px 테두리(`border/elevated`) · 모서리 control · 안쪽 16 · 안 사이 8. 값은 모두 토큰(foundation.css)
 */
export default function SurfaceCard({
    className,
    ...props
}: ComponentProps<"div">) {
    return <div className={cn("nl-surface-card", className)} {...props} />;
}
