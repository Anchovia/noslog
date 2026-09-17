import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type StatTone =
    "rank-1" | "rank-2" | "rank-3" | "rank" | "s" | "990k" | "pianist" | "fc";

export interface StatStripItem {
    key: string;
    label: ReactNode;
    value: ReactNode;
    /** 값 옆 보조(예: 「/ 7」) — body-secondary muted */
    unit?: ReactNode;
    /** 값 색 — rank-1 · rank-2 · rank-3 · rank · s · 990k · pianist · fc (foundation.css) */
    tone?: StatTone;
    /** 값 글자 색을 직접 줄 때(서열 값 그라데이션처럼 단계가 연속인 값) */
    color?: string;
    /** 값이 없으면 칸 자체를 두지 않는다(빈 「—」 칸 없음). value 를 null 로 주면 건너뛴다 */
}

/**
 * 수치 띠 — 핵심 숫자 몇 개를 한 줄에. 값 16/24 · 600 · tabular 위, 라벨 metadata 아래, 칸 사이 1px divider.
 * 상자 surface · 모서리 8 · 칸 안쪽 8/12. 최대 5칸, 넘치면 줄바꿈. 악곡 상세 머리 · 내 기록 요약 (2026-09-16)
 */
export default function StatStrip({
    items,
    label,
    className,
    footer,
}: {
    items: (StatStripItem | null | false | undefined)[];
    label?: string;
    className?: string;
    /** 같은 상자 아래 칸(구분선 1px 위) — 이 수치에 딸린 이동 링크 줄(`nl-action-group`) (2026-09-17 I1C) */
    footer?: ReactNode;
}) {
    const visible = items.filter((item): item is StatStripItem =>
        Boolean(item && item.value !== null && item.value !== undefined)
    );
    if (!visible.length && !footer) return null;
    const strip = visible.length ? (
        <dl className={cn("nl-stat-strip", className)} aria-label={label}>
            {visible.map((item) => (
                <div key={item.key} className="nl-stat-strip__cell">
                    <dd
                        className="nl-stat-strip__value"
                        data-tone={item.tone}
                        style={item.color ? { color: item.color } : undefined}
                    >
                        {item.value}
                        {item.unit ? (
                            <span className="nl-body-secondary nl-muted">
                                {item.unit}
                            </span>
                        ) : null}
                    </dd>
                    <dt className="nl-metadata nl-muted">{item.label}</dt>
                </div>
            ))}
        </dl>
    ) : null;
    if (!footer) return strip;
    return (
        <div className="nl-stat-card">
            {strip}
            {footer}
        </div>
    );
}
