import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface BarListRow {
    key: string;
    label: ReactNode;
    /** 0 ~ max. null 이면 막대 없이 값 자리에 「—」 */
    value: number | null;
    /** 화면에 보이는 값 글자(없으면 value 를 소수 1자리로) */
    display?: ReactNode;
    /** 막대 채움 색(CSS 색 · 토큰 변수). 없으면 차트 단일 색 */
    color?: string;
}

/**
 * 가로 막대 목록 — 항목 몇 개의 크기를 길이로 비교(레이더 대신 · 2026-09-16).
 * 줄 = 라벨 control 14/500 · 트랙 8(모서리 4 · raised 면) · 값 metric-value, 줄 사이 8. 색은 차트 단일 색(줄마다 color 로 바꿀 수 있음).
 */
export default function BarList({
    rows,
    max,
    label,
    className,
}: {
    rows: BarListRow[];
    max: number;
    label?: string;
    className?: string;
}) {
    return (
        <dl className={cn("nl-bar-list", className)} aria-label={label}>
            {rows.map((row) => (
                <div key={row.key} className="nl-bar-list__row">
                    <dt className="nl-control">{row.label}</dt>
                    <dd className="nl-bar-list__track" aria-hidden>
                        {row.value !== null ? (
                            <span
                                className="nl-bar-list__fill"
                                style={{
                                    width: `${Math.min(100, Math.max(0, (row.value / max) * 100))}%`,
                                    background: row.color,
                                }}
                            />
                        ) : null}
                    </dd>
                    <dd
                        className={cn(
                            "nl-bar-list__value nl-metric-value",
                            row.value === null && "nl-muted"
                        )}
                    >
                        {row.display ?? (row.value === null ? "—" : row.value)}
                    </dd>
                </div>
            ))}
        </dl>
    );
}
