"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import type { PerformanceTrendPoint } from "@/components/music/musicDetailTypes";
import LineChart from "@/components/ui/lineChart";
import type { LineChartPoint } from "@/components/ui/lineChart";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import { getMissNearCount, getSJustRate } from "@/lib/music/scoreTrend";

type Metric = "sjust" | "missNear" | "timing";

export default function PerformanceChart({
    points,
}: {
    points: PerformanceTrendPoint[];
}) {
    const t = useTranslations();
    const locale = useLocale();
    const [metric, setMetric] = useState<Metric>("sjust");
    const label =
        metric === "sjust"
            ? "S-Just"
            : metric === "missNear"
              ? "Miss+Near"
              : "FAST/SLOW";
    const chartPoints = points.flatMap((point): LineChartPoint[] => {
        const value =
            metric === "sjust"
                ? getSJustRate(point)
                : metric === "missNear"
                  ? getMissNearCount(point)
                  : point.fast_count;
        if (
            value === null ||
            (metric === "timing" && point.slow_count === null)
        )
            return [];
        const dimension = point.play_time
            .replace("T", " ")
            .replaceAll("/", "-")
            .slice(0, 16);
        return [
            {
                id: point.id,
                dimension,
                shortDimension: dimension.slice(5, 10),
                value,
                secondaryValue:
                    metric === "timing" ? point.slow_count! : undefined,
            },
        ];
    });
    const values = chartPoints.flatMap((point) =>
        point.secondaryValue === undefined
            ? [point.value]
            : [point.value, point.secondaryValue]
    );
    const maximum = values.length ? Math.max(...values) : 1;
    const formatValue = (value: number) =>
        metric === "sjust"
            ? `${value.toLocaleString(locale, { maximumFractionDigits: 1 })}%`
            : value.toLocaleString(locale);
    return (
        <div className="nl-stack">
            <SegmentedControl<Metric>
                className="nl-performance-selector"
                label={t("music.trend.selector")}
                value={metric}
                onValueChange={setMetric}
                options={[
                    { value: "sjust", label: "S-Just" },
                    { value: "missNear", label: "Miss/Near" },
                    { value: "timing", label: "FAST/SLOW" },
                ]}
            />
            <p className="nl-body-secondary nl-muted">
                {t("music.judgement.playBasis", { count: chartPoints.length })}
            </p>
            <LineChart
                key={metric}
                points={chartPoints}
                label={label}
                dimensionLabel={t("record.date")}
                valueLabel={metric === "timing" ? "FAST" : label}
                secondaryLabel={metric === "timing" ? "SLOW" : undefined}
                formatValue={formatValue}
                formatAxis={formatValue}
                domain={[
                    0,
                    metric === "sjust"
                        ? 100
                        : Math.max(2, Math.ceil(maximum / 2) * 2),
                ]}
                emptyMessage={t("music.trend.noData", { metric: label })}
                singleMessage={t("record.single")}
            />
        </div>
    );
}
