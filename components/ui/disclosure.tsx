import { ChevronDown, Play } from "lucide-react";
import type { ComponentProps, ReactNode, Ref } from "react";

import { cn } from "@/lib/cn";

/** 펼침 — 구역(요약 줄 40) · 보조(`compact`, 컨트롤 높이) 두 단계. 갈래는 구역 제목(화살표 줄 끝)과 `row`(왼쪽 ▶ · 1px 테두리 상자). 규칙은 app/styles/components/disclosure.css */
export default function Disclosure({
    title,
    children,
    className,
    heading = "component",
    compact = false,
    card = false,
    row = false,
    meta,
    titleId,
    titleRef,
    ...props
}: Omit<ComponentProps<"details">, "title"> & {
    title: ReactNode;
    heading?: "component" | "section";
    compact?: boolean;
    /** 혼자 떠 있는 상자 — 카드 면 위에 둔다 */
    card?: boolean;
    /** 줄 갈래 — 왼쪽 ▶ · 1px 테두리 상자. 기본은 구역 제목(화살표 줄 끝) */
    row?: boolean;
    meta?: ReactNode;
    /** 구역 이름표(aria-labelledby) · 저장 뒤 포커스를 돌려줄 제목 */
    titleId?: string;
    titleRef?: Ref<HTMLSpanElement>;
}) {
    return (
        <details
            className={cn(
                "nl-disclosure",
                compact && "nl-disclosure--compact",
                card && "nl-disclosure--card",
                row && "nl-disclosure--row",
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
                <span
                    id={titleId}
                    ref={titleRef}
                    tabIndex={titleRef ? -1 : undefined}
                >
                    {title}
                </span>
                {meta ? (
                    <span className="nl-metadata nl-muted">{meta}</span>
                ) : null}
                {row ? (
                    <Play
                        className="nl-icon-small nl-disclosure__chevron"
                        aria-hidden
                    />
                ) : (
                    <ChevronDown
                        className="nl-icon nl-disclosure__chevron"
                        aria-hidden
                    />
                )}
            </summary>
            <div className="nl-disclosure__body">{children}</div>
        </details>
    );
}
