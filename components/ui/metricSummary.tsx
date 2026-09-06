import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function MetricSummary({
    label,
    value,
    unit,
    prominent = false,
    description,
}: {
    label: ReactNode;
    value: ReactNode;
    unit?: ReactNode;
    prominent?: boolean;
    description?: ReactNode;
}) {
    return (
        <div className="nl-metric">
            <dt className="nl-control nl-muted">{label}</dt>
            <dd className="nl-metric__value">
                <span
                    className={cn(
                        prominent ? "nl-metric-display" : "nl-metric-value"
                    )}
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
