"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";

export interface GradeHistoryPoint {
    besttime: string;
    grade_basic: number;
    grade_recital: number;
}

function formatGradeHistoryDate(value: string) {
    return value.slice(0, 10).replaceAll("-", ".");
}

export default function ProfileGradeChart({
    data,
    mode,
}: {
    data: GradeHistoryPoint[];
    mode: "basic" | "recital";
}) {
    const dataKey = mode === "basic" ? "grade_basic" : "grade_recital";

    if (data.length < 2) {
        return (
            <div className="text-text-disabled flex h-24 items-center justify-center text-sm">
                Grd 추이를 표시할 기록이 부족합니다.
            </div>
        );
    }

    return (
        <div className="h-24 w-full" aria-label={`${mode} Grd 추이 차트`}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    accessibilityLayer={false}
                    margin={{ top: 8, right: 6, bottom: 8, left: 6 }}
                >
                    <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                    <Tooltip
                        cursor={false}
                        contentStyle={{
                            border: "1px solid #2a2a35",
                            borderRadius: 8,
                            background: "#121218",
                            color: "#f2f2f5",
                            fontSize: 12,
                        }}
                        labelStyle={{ color: "#a0a0aa" }}
                        labelFormatter={(_, payload) => {
                            const point = payload[0]?.payload as
                                GradeHistoryPoint | undefined;
                            return point
                                ? formatGradeHistoryDate(point.besttime)
                                : "";
                        }}
                        formatter={(value) => [
                            Number(value).toLocaleString("ko-KR"),
                            "Grd",
                        ]}
                    />
                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke="#facc15"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: "#facc15", strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
