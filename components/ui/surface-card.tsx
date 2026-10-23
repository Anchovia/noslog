import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/**
 * 면 카드(2026-10-21) — `surface/surface` 면 · 모서리 `container`(12, 전면 대조 ⑦) · 안 사이 8.
 * 안쪽은 목록 항목 카드 12 · 16(기본, 오락실 기체 카드와 같은 값) 또는 카드 안쪽 16(`roomy`). 값은 모두 토큰(foundation.css)
 */
export default function SurfaceCard({
    roomy = false,
    className,
    ...props
}: ComponentProps<"div"> & { roomy?: boolean }) {
    return (
        <div
            className={cn(
                "nl-surface-card",
                roomy && "nl-surface-card--roomy",
                className
            )}
            {...props}
        />
    );
}
