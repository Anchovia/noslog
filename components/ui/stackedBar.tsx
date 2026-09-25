import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface StackedBarSegment {
    key: string;
    /** 0 이상 — 줄 안 합계에 대한 비율로 그린다 */
    value: number;
    /** 조각 색(CSS 색 · 토큰 변수) */
    color: string;
}

export interface StackedBarRow {
    key: string;
    /** 줄 라벨 — 모든 줄에 없으면 라벨 열 없이 막대만(프로필 판정 요약 한 줄, 2026-09-26 D1) */
    label?: string;
    segments: StackedBarSegment[];
    /** 줄 오른쪽 값(metric-value) — 한 줄이라도 있으면 모든 줄에 값 칸이 생긴다(프로필 레벨별 달성, 2026-09-26) */
    value?: ReactNode;
}

/**
 * 누적 막대 — 전체 중 부분(판정 비율 등)을 한 줄로, 줄을 겹쳐 나 · 평균을 비교 (2026-09-16).
 * 줄 = 라벨 metadata(최소 40) · 트랙 8(모서리 4 · raised 면), 줄 사이 8 · 열 사이 12, 조각 사이 틈 없음.
 * 줄 오른쪽 값 칸은 선택(값 metric-value, 열 사이 12). 정확한 값은 곁의 목록이 말하므로 막대는 화면 읽기 프로그램에서 숨긴다.
 */
export default function StackedBar({
    rows,
    className,
}: {
    rows: StackedBarRow[];
    className?: string;
}) {
    const valued = rows.some((row) => row.value !== undefined);
    const labeled = rows.some((row) => row.label !== undefined);
    return (
        <div
            className={cn("nl-stacked-bar", className)}
            data-valued={valued || undefined}
            data-unlabeled={!labeled || undefined}
            aria-hidden="true"
        >
            {rows.map((row) => {
                const total = row.segments.reduce(
                    (sum, segment) => sum + Math.max(0, segment.value),
                    0
                );
                return (
                    <div key={row.key} className="nl-stacked-bar__row">
                        {labeled ? (
                            <span className="nl-metadata nl-muted">
                                {row.label}
                            </span>
                        ) : null}
                        <span className="nl-stacked-bar__track">
                            {total > 0 ? (
                                <span className="nl-stacked-bar__fill nl-chart-reveal">
                                    {row.segments
                                        .filter((segment) => segment.value > 0)
                                        .map((segment) => (
                                            <span
                                                key={segment.key}
                                                className="nl-stacked-bar__segment nl-chart-bar"
                                                style={{
                                                    width: `${(segment.value / total) * 100}%`,
                                                    background: segment.color,
                                                }}
                                            />
                                        ))}
                                </span>
                            ) : null}
                        </span>
                        {valued ? (
                            <span className="nl-stacked-bar__value nl-metric-value">
                                {row.value}
                            </span>
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
}
