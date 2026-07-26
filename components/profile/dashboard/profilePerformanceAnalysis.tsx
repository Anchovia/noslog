"use client";

import { formatMetricPercentage } from "@/lib/music/judgementStats";
import type {
    ProfilePerformanceAnalytics,
    ProfilePerformanceTrendPoint,
} from "@/lib/profile/profileAnalytics";
import { useState } from "react";
import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { formatProfileDate, formatProfileDateTime } from "./profileUtils";

type AnalysisMetric = "sjust" | "missNear" | "timing";

interface ProfilePerformanceAnalysisProps {
    analytics: ProfilePerformanceAnalytics;
}

interface AnalysisChartPoint {
    id: number;
    play_time: string;
    value?: number;
    fast?: number;
    slow?: number;
}

const metricOptions: { key: AnalysisMetric; label: string }[] = [
    { key: "sjust", label: "S-Just" },
    { key: "missNear", label: "Miss/Near" },
    { key: "timing", label: "FAST/SLOW" },
];

function formatDecimal(value: number | null) {
    if (value === null) return "-";

    return new Intl.NumberFormat("ko-KR", {
        maximumFractionDigits: 1,
    }).format(value);
}

function getChartDomain(metric: AnalysisMetric, values: number[]) {
    const minimum = Math.min(...values);
    const maximum = Math.max(...values);
    const padding = Math.max(1, Math.ceil((maximum - minimum) * 0.15));

    if (metric === "sjust") {
        return [
            Math.max(0, minimum - padding),
            Math.min(100, maximum + padding),
        ];
    }

    return [Math.max(0, minimum - padding), maximum + padding];
}

function getChartPoints(
    trend: ProfilePerformanceTrendPoint[],
    metric: AnalysisMetric
) {
    return trend.flatMap((point): AnalysisChartPoint[] => {
        if (metric === "sjust") {
            return point.sjust_rate === null
                ? []
                : [
                      {
                          id: point.id,
                          play_time: point.play_time,
                          value: point.sjust_rate,
                      },
                  ];
        }

        if (metric === "missNear") {
            return point.miss_near === null
                ? []
                : [
                      {
                          id: point.id,
                          play_time: point.play_time,
                          value: point.miss_near,
                      },
                  ];
        }

        return point.fast === null || point.slow === null
            ? []
            : [
                  {
                      id: point.id,
                      play_time: point.play_time,
                      fast: point.fast,
                      slow: point.slow,
                  },
              ];
    });
}

export default function ProfilePerformanceAnalysis({
    analytics,
}: ProfilePerformanceAnalysisProps) {
    const [activeMetric, setActiveMetric] = useState<AnalysisMetric>("sjust");
    const chartPoints = getChartPoints(analytics.recentTrend, activeMetric);
    const chartValues =
        activeMetric === "timing"
            ? chartPoints.flatMap((point) => [point.fast ?? 0, point.slow ?? 0])
            : chartPoints.map((point) => point.value ?? 0);
    const chartDomain =
        chartValues.length > 0 ? getChartDomain(activeMetric, chartValues) : [];
    const outcomeRows = [
        { label: "클리어", value: analytics.outcomes.clearRate },
        { label: "풀콤보", value: analytics.outcomes.fullComboRate },
        { label: "Pianist", value: analytics.outcomes.pianistRate },
    ];

    return (
        <div className="border-divider mt-4 border-t pt-4">
            <header className="flex items-center justify-between gap-3">
                <h3 className="text-label">판정 상세</h3>
                <span className="text-micro">베스트 기록 기준</span>
            </header>

            <div className="mt-3 grid grid-cols-2 gap-2">
                <article className="bg-surface-muted rounded-card min-w-0 p-3">
                    <p className="text-caption">S-Just</p>
                    <strong className="text-label mt-1 block truncate">
                        {formatMetricPercentage(
                            analytics.judgement.sjustRate
                        ) ?? "-"}
                    </strong>
                    <p className="text-micro mt-1 truncate tabular-nums">
                        {analytics.judgement.chartCount}개 채보
                    </p>
                </article>
                <article className="bg-surface-muted rounded-card min-w-0 p-3">
                    <p className="text-caption">Miss/Near</p>
                    <strong className="text-label mt-1 block truncate">
                        평균{" "}
                        {formatDecimal(analytics.judgement.averageMissNear)}
                    </strong>
                    <p className="text-micro mt-1 truncate tabular-nums">
                        채보당 판정 수
                    </p>
                </article>
            </div>

            <dl className="mt-2 grid grid-cols-3 gap-2 text-center">
                {outcomeRows.map((row) => (
                    <div
                        key={row.label}
                        className="bg-surface-muted rounded-card px-2 py-2.5"
                    >
                        <dt className="text-caption">{row.label}</dt>
                        <dd className="text-label mt-1 font-bold tabular-nums">
                            {formatMetricPercentage(row.value) ?? "-"}
                        </dd>
                    </div>
                ))}
            </dl>

            <div className="border-divider mt-4 border-t pt-4">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="text-label">음표별 평균 성공률</h3>
                    {analytics.weakestNoteType ? (
                        <span className="text-micro">
                            취약 · {analytics.weakestNoteType}
                        </span>
                    ) : null}
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-2">
                    {analytics.noteRates.map((note) => (
                        <div
                            key={note.key}
                            className="bg-surface-muted rounded-card flex items-center justify-between gap-2 px-3 py-2.5"
                        >
                            <dt className="text-caption">{note.label}</dt>
                            <dd className="text-label font-bold tabular-nums">
                                {formatMetricPercentage(note.value) ?? "-"}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>

            <div className="border-divider mt-4 border-t pt-4">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="text-label">최근 판정 추이</h3>
                    <span className="text-micro">
                        최대 {analytics.recentTrend.length}플레이
                    </span>
                </div>
                <div
                    aria-label="최근 판정 추이 지표"
                    className="bg-surface-muted mt-2 grid grid-cols-3 gap-1 rounded-md p-1"
                    role="tablist"
                >
                    {metricOptions.map((option) => {
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

                {chartPoints.length > 0 ? (
                    <>
                        <div className="relative mt-2 h-32 [&_.recharts-surface:focus:not(:focus-visible)]:outline-none">
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
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={chartPoints}
                                    margin={{
                                        top: 16,
                                        right: 8,
                                        bottom: 0,
                                        left: 8,
                                    }}
                                >
                                    <XAxis dataKey="play_time" hide />
                                    <YAxis domain={chartDomain} hide />
                                    <Tooltip
                                        contentStyle={{
                                            background:
                                                "var(--color-surface-muted)",
                                            border: "1px solid var(--color-border)",
                                            borderRadius: 6,
                                            color: "var(--color-text-primary)",
                                            fontSize: 12,
                                        }}
                                        cursor={{
                                            stroke: "var(--color-divider)",
                                        }}
                                        formatter={(value, name) => [
                                            activeMetric === "sjust"
                                                ? `${Number(value).toFixed(1)}%`
                                                : Number(value).toLocaleString(
                                                      "ko-KR"
                                                  ),
                                            name,
                                        ]}
                                        labelFormatter={(_, payload) =>
                                            formatProfileDateTime(
                                                payload[0]?.payload.play_time ??
                                                    null
                                            )
                                        }
                                    />
                                    {activeMetric === "timing" ? (
                                        <>
                                            <Line
                                                activeDot={{ r: 5 }}
                                                dataKey="fast"
                                                dot={{ r: 2.5 }}
                                                isAnimationActive={false}
                                                name="FAST"
                                                stroke="var(--color-danger)"
                                                strokeWidth={2}
                                                type="linear"
                                            />
                                            <Line
                                                activeDot={{ r: 5 }}
                                                dataKey="slow"
                                                dot={{ r: 2.5 }}
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
                                            dot={{ r: 2.5 }}
                                            isAnimationActive={false}
                                            name={
                                                activeMetric === "sjust"
                                                    ? "S-Just"
                                                    : "Miss+Near"
                                            }
                                            stroke={
                                                activeMetric === "sjust"
                                                    ? "var(--color-score)"
                                                    : "var(--color-danger)"
                                            }
                                            strokeWidth={2}
                                            type="linear"
                                        />
                                    )}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-caption text-text-disabled flex justify-between">
                            <span>
                                {formatProfileDate(
                                    chartPoints[0]?.play_time ?? null
                                )}
                            </span>
                            <span>
                                {formatProfileDate(
                                    chartPoints.at(-1)?.play_time ?? null
                                )}
                            </span>
                        </div>
                    </>
                ) : (
                    <p className="text-caption flex h-28 items-center justify-center text-center">
                        이 지표를 표시할 최근 기록이 없습니다.
                    </p>
                )}
            </div>
        </div>
    );
}
