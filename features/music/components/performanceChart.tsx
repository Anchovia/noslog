"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import type { PerformanceTrendPoint } from "@/components/music/musicDetailTypes";
import LineChart from "@/components/ui/lineChart";
import type { LineChartPoint } from "@/components/ui/lineChart";
import { judgementLabels } from "@/components/ui/judgementMarker";
import { SegmentedControl } from "@/components/ui/segmentedControl";
import {
    formatDaysAgo,
    getMissCount,
    getSJustRate,
} from "@/lib/music/scoreTrend";

type Metric = "sjust" | "miss" | "timing";

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
            ? judgementLabels.sjust
            : metric === "miss"
              ? judgementLabels.miss
              : "FAST/SLOW";
    const chartPoints = points.flatMap((point): LineChartPoint[] => {
        const value =
            metric === "sjust"
                ? getSJustRate(point)
                : metric === "miss"
                  ? getMissCount(point)
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
                // 툴팁 아래 「N일 전」 — 위 날짜 줄 대신 (2026-09-17)
                detail: formatDaysAgo(dimension, locale),
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
        // 선 색 = 판정 색(◆JUST 분홍 · MISS 빨강 · FAST 판정 NEAR 파랑 · SLOW 주황) (2026-09-17 B)
        <div className="nl-stack nl-performance-chart" data-metric={metric}>
            <SegmentedControl<Metric>
                className="nl-performance-selector"
                label={t("music.trend.selector")}
                value={metric}
                onValueChange={setMetric}
                options={[
                    { value: "sjust", label: judgementLabels.sjust },
                    { value: "miss", label: judgementLabels.miss },
                    { value: "timing", label: "FAST/SLOW" },
                ]}
            />
            {chartPoints.length ? (
                <p className="nl-body-secondary nl-muted">
                    {t("music.judgement.playBasis", {
                        count: chartPoints.length,
                    })}
                </p>
            ) : null}
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
                // 기록이 없으면 빈 틀 + 가운데 「기록 없음」 (2026-09-16 E2)
                emptyMessage={t("music.record.noRecord")}
                keepPlotGeometry
                // 점 값은 툴팁 · 최근 플레이가 말하므로 표는 화면 읽기용으로만 (2026-09-16)
                tableVisibility="screen-reader"
            />
        </div>
    );
}
