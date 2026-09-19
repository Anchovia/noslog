import type { ReactNode } from "react";
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
