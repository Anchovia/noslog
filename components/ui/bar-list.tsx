import type { ReactNode } from "react";

import { SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";

export interface BarListRow {
    key: string;
    label: ReactNode;
    /** 0 ~ max. null 이면 막대 없이 값 자리에 「—」 */
    value: number | null;
    /** 화면에 보이는 값 글자(없으면 value 를 소수 1자리로) */
    display?: ReactNode;
    /** 막대 채움 색(CSS 색 · 토큰 변수). 없으면 차트 단일 색 */
    color?: string;
    /** 순서 있는 단계를 칸 막대로 — 칸 수. value 는 채운 칸 수(0–steps)이고 max 를 쓰지 않는다 */
    steps?: number;
}

/**
 * 가로 막대 목록 — 항목 몇 개의 크기를 길이로 비교(레이더 대신).
 * 줄 = 라벨 control · 트랙 8(모서리 4 · surface/control 면) · 값 metric-value, 줄 사이 8. 색은 차트 단일 색(줄마다 color 로 바꿀 수 있음).
 * steps 줄은 같은 트랙을 칸 사이 2 로 나눈 칸 막대(Apple HIG level indicator · Ant Design Progress steps)다.
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
                    {row.steps ? (
                        <dd
                            className="nl-bar-list__track nl-bar-list__track--steps"
                            aria-hidden
                        >
                            {Array.from({ length: row.steps }, (_, step) =>
                                row.value !== null && step < row.value ? (
                                    <span
                                        key={step}
                                        className="nl-bar-list__fill nl-chart-reveal"
                                        style={{ background: row.color }}
                                    />
                                ) : (
                                    <span key={step} />
                                )
                            )}
                        </dd>
                    ) : (
                        <dd className="nl-bar-list__track" aria-hidden>
                            {row.value !== null ? (
                                <span
                                    className="nl-bar-list__fill nl-chart-reveal nl-chart-bar"
                                    style={{
                                        width: `${Math.min(100, Math.max(0, (row.value / max) * 100))}%`,
                                        background: row.color,
                                    }}
                                />
                            ) : null}
                        </dd>
                    )}
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

/**
 * 막대 목록 스켈레톤 —항목 이름은 고정 글자라 실제 글자 그대로, 막대 트랙은 빈 채로,
 * 값 자리만 스켈레톤
 */
export function BarListSkeleton({
    labels,
    className,
}: {
    labels: ReactNode[];
    className?: string;
}) {
    return (
        <dl className={cn("nl-bar-list", className)} aria-hidden="true">
            {labels.map((label, index) => (
                <div key={index} className="nl-bar-list__row">
                    <dt className="nl-control">{label}</dt>
                    <dd className="nl-bar-list__track" />
                    <dd className="nl-bar-list__value">
                        <SkeletonText className="nl-metric-value" />
                    </dd>
                </div>
            ))}
        </dl>
    );
}
