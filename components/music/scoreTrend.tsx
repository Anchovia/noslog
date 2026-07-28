"use client";

import {
    formatScoreRecordDate,
    formatTrendTooltipDate,
    getMissNearCount,
    getSJustRate,
    selectScoreImprovements,
} from "@/lib/music/scoreTrend";
import { useState } from "react";
import {
    Line,
    LineChart,
    ReferenceDot,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type {
    PerformanceTrendPoint,
    ScoreTrendPoint,
} from "./musicDetailTypes";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";

type TrendMetric = "score" | "missNear" | "sjust" | "timing";
type TrendVariant = "score" | "judgement";

interface ScoreTrendProps {
    points: ScoreTrendPoint[];
    performancePoints: PerformanceTrendPoint[];
    variant: TrendVariant;
}

interface TrendChartPoint {
    id: string;
    play_time: string;
    value?: number;
    fast?: number;
    slow?: number;
    isBest?: boolean;
}

const judgementMetricOptions: { key: TrendMetric; label: string }[] = [
    { key: "sjust", label: "S-Just" },
    { key: "missNear", label: "Miss/Near" },
    { key: "timing", label: "FAST/SLOW" },
];

function getTrendDomain(metric: TrendMetric, values: number[]) {
    const minimum = Math.min(...values);
    const maximum = Math.max(...values);

    if (metric === "score") {
        return [
            Math.max(0, minimum - 10000),
            Math.min(1000000, maximum + 10000),
        ];
    }

    const range = maximum - minimum;
    const padding = Math.max(1, Math.ceil(range * 0.15));

    if (metric === "sjust") {
        return [
            Math.max(0, minimum - padding),
            Math.min(100, maximum + padding),
        ];
    }

    return [Math.max(0, minimum - padding), maximum + padding];
}

function formatTrendValue(value: number, metric: TrendMetric, locale: string) {
    if (metric === "score") return value.toLocaleString(locale);
    if (metric === "sjust") return `${value.toFixed(1)}%`;
    return value.toLocaleString(locale);
}

export default function ScoreTrend({
    points,
    performancePoints,
    variant,
}: ScoreTrendProps) {
    const locale = useLocale();
    const t = useTranslations();
    const [activeMetric, setActiveMetric] = useState<TrendMetric>(
        variant === "score" ? "score" : "sjust"
    );

    const scoreRecords =
        points.length > 0
            ? points
            : selectScoreImprovements(
                  performancePoints.map((point) => ({
                      id: point.id,
                      score: point.score,
                      rank: "",
                      play_time: point.play_time,
                  }))
              );
    const currentBestScore = Math.max(
        0,
        ...scoreRecords.map((point) => point.score)
    );
    const scorePoints: TrendChartPoint[] = scoreRecords.map((point) => ({
        id: `best-${point.id}`,
        play_time: point.play_time,
        value: point.score,
        isBest: point.score === currentBestScore,
    }));

    const chartPoints: TrendChartPoint[] =
        activeMetric === "score"
            ? scorePoints
            : performancePoints.flatMap((point): TrendChartPoint[] => {
                  if (activeMetric === "missNear") {
                      const value = getMissNearCount(point);
                      return value === null
                          ? []
                          : [
                                {
                                    id: `play-${point.id}`,
                                    play_time: point.play_time,
                                    value,
                                },
                            ];
                  }

                  if (activeMetric === "sjust") {
                      const value = getSJustRate(point);
                      return value === null
                          ? []
                          : [
                                {
                                    id: `play-${point.id}`,
                                    play_time: point.play_time,
                                    value,
                                },
                            ];
                  }

                  if (point.fast_count === null || point.slow_count === null) {
                      return [];
                  }

                  return [
                      {
                          id: `play-${point.id}`,
                          play_time: point.play_time,
                          fast: point.fast_count,
                          slow: point.slow_count,
                      },
                  ];
              });

    const values =
        activeMetric === "timing"
            ? chartPoints.flatMap((point) => [point.fast ?? 0, point.slow ?? 0])
            : chartPoints.map((point) => point.value ?? 0);
    const domain =
        values.length > 0 ? getTrendDomain(activeMetric, values) : [];
    const lineColor =
        activeMetric === "missNear"
            ? "var(--color-danger)"
            : activeMetric === "sjust"
              ? "var(--color-score)"
              : "var(--color-chart)";
    const activeMetricLabel =
        activeMetric === "score"
            ? t("music.trend.score")
            : activeMetric === "timing"
              ? t("music.trend.timing")
              : activeMetric === "missNear"
                ? "Miss+Near"
                : "S-Just";

    return (
        <div className="mt-3">
            {variant === "judgement" ? (
                <div
                    aria-label={t("music.trend.selector")}
                    className="bg-surface-muted grid grid-cols-3 gap-1 rounded-md p-1"
                    role="tablist"
                >
                    {judgementMetricOptions.map((option) => {
                        const isActive = activeMetric === option.key;

                        return (
                            <button
                                key={option.key}
                                aria-selected={isActive}
                                className={`text-caption h-8 rounded-sm transition-colors ${
                                    isActive
                                        ? "bg-surface text-text-primary font-semibold"
                                        : "text-text-secondary"
                                }`}
                                onClick={() => setActiveMetric(option.key)}
                                role="tab"
                                type="button"
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            ) : null}

            {chartPoints.length === 0 ? (
                <div className="text-caption flex h-40 items-center justify-center text-center">
                    {t("music.trend.noData", {
                        metric: activeMetricLabel,
                    })}
                </div>
            ) : (
                <div
                    className={`relative [&_.recharts-surface:focus:not(:focus-visible)]:outline-none ${
                        variant === "judgement" ? "mt-2" : ""
                    }`}
                >
                    {activeMetric === "score" &&
                    chartPoints.some((point) => point.isBest) ? (
                        <div className="text-micro pointer-events-none absolute top-1 right-1 z-10 flex items-center gap-1.5">
                            <span className="bg-score size-1.5 rounded-full" />
                            {t("music.trend.currentBest")}
                        </div>
                    ) : null}
                    {activeMetric === "timing" ? (
                        <div className="text-micro pointer-events-none absolute top-1 right-1 z-10 flex items-center gap-3">
                            <span className="flex items-center gap-1.5">
                                <span className="bg-danger size-1.5 rounded-full" />
                                FAST
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="bg-chart size-1.5 rounded-full" />
                                SLOW
                            </span>
                        </div>
                    ) : null}

                    <div className="h-36 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartPoints}
                                margin={{
                                    top: 16,
                                    right: 10,
                                    bottom: 0,
                                    left: 10,
                                }}
                            >
                                <XAxis dataKey="play_time" hide />
                                <YAxis domain={domain} hide />
                                <Tooltip
                                    cursor={{
                                        stroke: "var(--color-divider)",
                                    }}
                                    contentStyle={{
                                        background:
                                            "var(--color-surface-muted)",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: 6,
                                        color: "var(--color-text-primary)",
                                        fontSize: 12,
                                    }}
                                    formatter={(value, name) => [
                                        formatTrendValue(
                                            Number(value),
                                            activeMetric,
                                            locale
                                        ),
                                        name,
                                    ]}
                                    labelFormatter={(_, payload) =>
                                        formatTrendTooltipDate(
                                            payload[0]?.payload.play_time ?? ""
                                        )
                                    }
                                />

                                {activeMetric === "timing" ? (
                                    <>
                                        <Line
                                            activeDot={{ r: 5 }}
                                            dataKey="fast"
                                            dot={{ r: 3 }}
                                            isAnimationActive={false}
                                            name="FAST"
                                            stroke="var(--color-danger)"
                                            strokeWidth={2}
                                            type="linear"
                                        />
                                        <Line
                                            activeDot={{ r: 5 }}
                                            dataKey="slow"
                                            dot={{ r: 3 }}
                                            isAnimationActive={false}
                                            name="SLOW"
                                            stroke="var(--color-chart)"
                                            strokeWidth={2}
                                            type="linear"
                                        />
                                    </>
                                ) : (
                                    <Line
                                        activeDot={{ r: 5 }}
                                        dataKey="value"
                                        dot={{
                                            r: 3,
                                            fill: "var(--color-text-primary)",
                                            stroke: lineColor,
                                            strokeWidth: 2,
                                        }}
                                        isAnimationActive={false}
                                        name={activeMetricLabel}
                                        stroke={lineColor}
                                        strokeWidth={2}
                                        type="linear"
                                    />
                                )}

                                {activeMetric === "score"
                                    ? chartPoints
                                          .filter(
                                              (
                                                  point
                                              ): point is TrendChartPoint & {
                                                  value: number;
                                              } =>
                                                  Boolean(point.isBest) &&
                                                  point.value !== undefined
                                          )
                                          .map((point) => (
                                              <ReferenceDot
                                                  key={point.id}
                                                  fill="var(--color-score)"
                                                  r={4}
                                                  stroke="var(--color-surface)"
                                                  strokeWidth={2}
                                                  x={point.play_time}
                                                  y={point.value}
                                              />
                                          ))
                                    : null}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div
                        className={`text-caption text-text-disabled -mt-1 flex ${
                            chartPoints.length === 1
                                ? "justify-center"
                                : "justify-between"
                        }`}
                    >
                        <span>
                            {formatScoreRecordDate(
                                chartPoints[0]?.play_time ?? ""
                            )}
                        </span>
                        {chartPoints.length > 1 ? (
                            <span>
                                {formatScoreRecordDate(
                                    chartPoints.at(-1)?.play_time ?? ""
                                )}
                            </span>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}
