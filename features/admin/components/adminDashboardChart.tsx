"use client";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

// 대시보드 추이 그래프 — 한 계열 선(local-data/single) · 격자 border/default · 애니메이션 없음(문서에 없는 모션 금지)
export default function AdminDashboardChart({
    data,
    label,
}: {
    data: { date: string; label: string; value: number }[];
    label: string;
}) {
    return (
        <div
            className="nl-dashboard__chart"
            role="img"
            aria-label={`${label} 날짜별 추이 — ${data
                .map((point) => `${point.label} ${point.value}`)
                .join(", ")}`}
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    accessibilityLayer={false}
                    margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
                >
                    <CartesianGrid
                        stroke="var(--nl-border-default)"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                        minTickGap={16}
                        tick={{
                            fill: "var(--nl-content-subdued)",
                            fontSize: 12,
                        }}
                    />
                    <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        width={40}
                        tick={{
                            fill: "var(--nl-content-subdued)",
                            fontSize: 12,
                        }}
                    />
                    <Tooltip
                        cursor={{ stroke: "var(--nl-border-strong)" }}
                        contentStyle={{
                            background: "var(--nl-surface-overlay)",
                            border: "1px solid var(--nl-border-overlay)",
                            borderRadius: 10,
                            color: "var(--nl-content-default)",
                            fontSize: 14,
                        }}
                        labelStyle={{ color: "var(--nl-content-subdued)" }}
                        formatter={(value) => [
                            Number(value).toLocaleString("ko-KR"),
                            label,
                        ]}
                    />
                    <Line
                        type="linear"
                        dataKey="value"
                        stroke="var(--nl-local-data-single)"
                        strokeWidth={2}
                        dot={{
                            r: 3,
                            fill: "var(--nl-local-data-single)",
                            strokeWidth: 0,
                        }}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
