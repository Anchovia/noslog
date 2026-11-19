import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/**
 * 면 카드 — 면 `surface/surface` · 1px 테두리(`border/elevated`) · 모서리 control · 안쪽 20 · 안 세로 12. 값은 모두 토큰(app/styles/components/surface-card.css)
 */
export default function SurfaceCard({
    className,
    ...props
}: ComponentProps<"div">) {
    return <div className={cn("nl-surface-card", className)} {...props} />;
}
