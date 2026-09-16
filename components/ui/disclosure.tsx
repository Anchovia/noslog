import { ChevronDown } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

/** 펼침 — 구역(요약 줄 48) · 보조(`compact`, 컨트롤 높이) 두 단계. 화살표는 줄 끝. 규칙은 foundation.css */
export default function Disclosure({
    title,
    children,
    className,
    heading = "component",
    compact = false,
    card = false,
    meta,
    ...props
}: Omit<ComponentProps<"details">, "title"> & {
    title: ReactNode;
    heading?: "component" | "section";
    compact?: boolean;
    /** 혼자 떠 있는 상자 — 카드 면 위에 둔다 */
    card?: boolean;
    meta?: ReactNode;
}) {
    return (
        <details
            className={cn(
                "nl-disclosure",
                compact && "nl-disclosure--compact",
                card && "nl-disclosure--card",
                className
            )}
            {...props}
        >
            <summary
                className={
                    compact
                        ? "nl-control"
                        : heading === "section"
                          ? "nl-section-title"
                          : "nl-component-title"
                }
            >
                <span>{title}</span>
                {meta ? (
                    <span className="nl-metadata nl-muted">{meta}</span>
                ) : null}
                <ChevronDown
                    className="nl-icon nl-disclosure__chevron"
                    aria-hidden
                />
            </summary>
            <div className="nl-disclosure__body">{children}</div>
        </details>
    );
}
