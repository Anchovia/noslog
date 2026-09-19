import type { ReactNode } from "react";
import { SkeletonText } from "@/components/ui/skeleton";
import type { StatTone } from "@/components/ui/statStrip";
import { cn } from "@/lib/utils";

export default function MetricSummary({
    label,
    value,
    unit,
    prominent = false,
    description,
    tone,
}: {
    label: ReactNode;
    value: ReactNode;
    unit?: ReactNode;
    prominent?: boolean;
    description?: ReactNode;
    /** 값 색 — 수치 띠와 같은 값 색(foundation.css) */
    tone?: StatTone;
}) {
    return (
        <div className="nl-metric">
            <dt className="nl-control nl-muted">{label}</dt>
            <dd className="nl-metric__value">
                <span
                    className={cn(
                        "nl-toned",
                        prominent ? "nl-metric-display" : "nl-metric-value"
                    )}
                    data-tone={tone}
                >
                    {value}
                </span>
                {unit ? (
                    <span className="nl-body-secondary nl-muted">{unit}</span>
                ) : null}
            </dd>
            {description ? <dd className="sr-only">{description}</dd> : null}
        </div>
    );
}

/** 수치 칸 스켈레톤(2026-09-19 로딩 시안 S1) — 같은 칸 틀(라벨 control →값 metric-display/metric-value) */
export function MetricSummarySkeleton({
    label,
    prominent = false,
}: {
    /** 고정 라벨(「공식 Grd」 등)은 실제 글자로 */
    label?: ReactNode;
    prominent?: boolean;
}) {
    return (
        <div className="nl-metric" aria-hidden="true">
            <dt className={label ? "nl-control nl-muted" : undefined}>
                {label ?? <SkeletonText className="nl-control" width="m" />}
            </dt>
            <dd className="nl-metric__value">
                <SkeletonText
                    className={
                        prominent ? "nl-metric-display" : "nl-metric-value"
                    }
                    width="l"
                />
            </dd>
        </div>
    );
}
