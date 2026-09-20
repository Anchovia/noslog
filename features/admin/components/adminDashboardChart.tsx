"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

// 대시보드 추이 그래프 — 한 계열 선 · 격자 border/default · 애니메이션 없음(문서에 없는 모션 금지).
// 선 색은 보고 있는 수치의 색(2026-09-20 C2) — 수치 칸의 색 줄과 같다
export default function AdminDashboardChart({
    data,
    label,
    color = "var(--nl-local-data-single)",
}: {
    data: { date: string; label: string; value: number }[];
    label: string;
    color?: string;
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
                        stroke={color}
                        strokeWidth={2}
                        dot={{
                            r: 3,
                            fill: color,
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

/**
 * 오늘 시간대별 페이지뷰(2026-09-20 H1) — 0~23시 막대. 아직 오지 않은 시각은 빈 칸으로 둔다.
 * 색은 페이지뷰 수치의 색
 */
export function AdminDashboardHours({
    data,
    color,
}: {
    data: { hour: string; label: string; value: number; future: boolean }[];
    color: string;
}) {
    return (
        <div
            className="nl-dashboard__chart"
            role="img"
            aria-label={`오늘 시간대별 페이지뷰 — ${data
                .filter((point) => !point.future)
                .map((point) => `${point.label} ${point.value}`)
                .join(", ")}`}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
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
                        interval={5}
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
                        cursor={{ fill: "var(--nl-surface-raised)" }}
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
                            "페이지뷰",
                        ]}
                    />
                    <Bar
                        dataKey="value"
                        fill={color}
                        radius={[2, 2, 0, 0]}
                        isAnimationActive={false}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
