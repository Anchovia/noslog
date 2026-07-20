"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface ActivityRow {
    date: string;
    users: number;
    syncs: number;
    feedback: number;
}

export default function AdminActivityChart({ data }: { data: ActivityRow[] }) {
    return (
        <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 8, right: 0, bottom: 0, left: -24 }}
                >
                    <CartesianGrid
                        stroke="var(--color-divider)"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="date"
                        tick={{
                            fill: "var(--color-text-disabled)",
                            fontSize: 10,
                        }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        allowDecimals={false}
                        tick={{
                            fill: "var(--color-text-disabled)",
                            fontSize: 10,
                        }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: "var(--color-surface-muted)" }}
                        contentStyle={{
                            background: "var(--color-surface)",
                            border: "1px solid var(--color-border)",
                            borderRadius: 6,
                            fontSize: 12,
                        }}
                        labelStyle={{ color: "var(--color-text-primary)" }}
                    />
                    <Bar
                        dataKey="users"
                        name="신규 유저"
                        fill="var(--color-basic)"
                        radius={[2, 2, 0, 0]}
                    />
                    <Bar
                        dataKey="syncs"
                        name="동기화"
                        fill="var(--color-chart)"
                        radius={[2, 2, 0, 0]}
                    />
                    <Bar
                        dataKey="feedback"
                        name="피드백"
                        fill="var(--color-score)"
                        radius={[2, 2, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
