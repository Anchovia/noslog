import { cn } from "@/lib/cn";

export type StatusDotTone = "success" | "warning" | "danger" | "info" | "empty";

/**
 * 상태 색 점 8(2026-10-21 공용화) — 늘 상태 글자와 함께 쓴다(색 단독으로 뜻을 전하지 않음, WCAG 1.4.1).
 * 색 = 알림 표시색, `empty` = 빈 원(미확인). 크기 · 선은 토큰
 */
export default function StatusDot({
    tone,
    className,
}: {
    tone: StatusDotTone;
    className?: string;
}) {
    return (
        <span
            className={cn("nl-status-dot", className)}
            data-tone={tone}
            aria-hidden
        />
    );
}
