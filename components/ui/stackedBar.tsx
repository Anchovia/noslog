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
    label: string;
    segments: StackedBarSegment[];
}

/**
 * 누적 막대 — 전체 중 부분(판정 비율 등)을 한 줄로, 줄을 겹쳐 나 · 평균을 비교 (2026-09-16).
 * 줄 = 라벨 metadata(최소 40) · 트랙 8(모서리 4 · raised 면), 줄 사이 8 · 열 사이 12, 조각 사이 틈 없음.
 * 정확한 값은 곁의 목록이 말하므로 막대는 화면 읽기 프로그램에서 숨긴다.
 */
export default function StackedBar({
    rows,
    className,
}: {
    rows: StackedBarRow[];
    className?: string;
}) {
    return (
        <div className={cn("nl-stacked-bar", className)} aria-hidden="true">
            {rows.map((row) => {
                const total = row.segments.reduce(
                    (sum, segment) => sum + Math.max(0, segment.value),
                    0
                );
                return (
                    <div key={row.key} className="nl-stacked-bar__row">
                        <span className="nl-metadata nl-muted">
                            {row.label}
                        </span>
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
                    </div>
                );
            })}
        </div>
    );
}
