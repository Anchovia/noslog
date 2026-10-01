import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatusMessageProps extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "title"
> {
    severity?: "info" | "success" | "warning" | "danger";
    title: ReactNode;
    children?: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    /**
     * 모양(2026-09-28 인상 점검 A1 — 디자인 시스템 7곳 「드물게 · 가까이 · 약하게」). 아이콘 · 색 면 없이 글자만(2026-10-01 N1):
     * inline(기본) = 본문 보조 글자(오류는 오류 글자색) — 창 · 폼 · 동작 결과 · 빈 상태 안내.
     * quiet = 흐린 한 줄 + 오른쪽 동작 — 구역 불러오기 실패.
     * boxed = 제목(강조 라벨) + 설명 — 되돌릴 수 없는 결과를 알리는 경고(개인정보) · 관리자 화면.
     */
    tone?: "inline" | "quiet" | "boxed";
}

export function StatusMessage({
    severity = "info",
    title,
    children,
    description,
    action,
    tone = "inline",
    className,
    ...props
}: StatusMessageProps) {
    return (
        <div
            className={cn(
                "nl-status",
                `nl-status--${severity}`,
                `nl-status--${tone}`,
                className
            )}
            {...props}
        >
            <div className="nl-status__copy">
                <p
                    className={
                        tone === "boxed"
                            ? "nl-emphasis-label"
                            : "nl-body-secondary"
                    }
                >
                    {title}
                </p>
                {description ? (
                    <p className="nl-body-secondary">{description}</p>
                ) : null}
                {children ? (
                    <div className="nl-body-secondary">{children}</div>
                ) : null}
                {action}
            </div>
        </div>
    );
}
