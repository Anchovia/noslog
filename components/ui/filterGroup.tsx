import { useId } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * 필터 레이어·레일의 그룹 하나 — 제목(component-title) + 오른쪽 슬롯(선택 수·지우기·로그인) + 내용.
 * 형제 그룹 사이에는 24 간격과 1px divider 가 들어가 제목과 선택지가 한 덩어리로 읽히지 않게 한다.
 */
export default function FilterGroup({
    label,
    aside,
    children,
    className,
}: {
    label: string;
    aside?: ReactNode;
    children: ReactNode;
    className?: string;
}) {
    const id = useId();
    return (
        <section
            className={cn("nl-filter-group", className)}
            aria-labelledby={id}
        >
            <div className="nl-filter-group__head">
                <h3 id={id} className="nl-component-title">
                    {label}
                </h3>
                {aside ? (
                    <div className="nl-filter-group__aside">{aside}</div>
                ) : null}
            </div>
            {children}
        </section>
    );
}
