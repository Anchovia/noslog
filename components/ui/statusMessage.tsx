import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import type { ComponentType, HTMLAttributes, ReactNode, SVGProps } from "react";
import { cn } from "@/lib/utils";

const statusIcons = {
    info: Info,
    success: CircleCheck,
    warning: TriangleAlert,
    danger: CircleAlert,
};

interface StatusMessageProps extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "title"
> {
    severity?: keyof typeof statusIcons;
    // severity 기본 아이콘 대신 쓸 아이콘 (예: 활동 비공개의 자물쇠)
    icon?: ComponentType<SVGProps<SVGSVGElement>>;
    title: ReactNode;
    children?: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    /**
     * 모양(2026-09-28 인상 점검 A1 — 디자인 시스템 7곳 「드물게 · 가까이 · 약하게」):
     * inline(기본) = 상자 없이 아이콘 16 + 글자(오류는 오류 글자색) — 창 · 폼 · 동작 결과 · 빈 상태 안내.
     * quiet = 아이콘 · 색 없이 흐린 한 줄 + 오른쪽 동작 — 구역 불러오기 실패.
     * boxed = 색 면 상자 — 되돌릴 수 없는 결과를 알리는 경고(개인정보) · 관리자 화면만.
     */
    tone?: "inline" | "quiet" | "boxed";
}

export function StatusMessage({
    severity = "info",
    icon,
    title,
    children,
    description,
    action,
    tone = "inline",
    className,
    ...props
}: StatusMessageProps) {
    const Icon = icon ?? statusIcons[severity];
    const boxed = tone === "boxed";
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
            {tone === "quiet" ? null : (
                <Icon
                    className={boxed ? "nl-icon" : "nl-icon-small"}
                    aria-hidden="true"
                />
            )}
            <div className="nl-status__copy">
                <p
                    className={
                        boxed ? "nl-emphasis-label" : "nl-body-secondary"
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
