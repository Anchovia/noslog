"use client";

import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface ScoreTrendProps {
    plays: {
        id: number;
        score: number;
        rank: string;
        play_time: string;
    }[];
}

export default function ScoreTrend({ plays }: ScoreTrendProps) {
    if (plays.length === 0) {
        return (
            <div className="text-text-disabled flex h-32 items-center justify-center text-sm">
                최근 플레이 기록이 없습니다.
            </div>
        );
    }

    const scores = plays.map((play) => play.score);
    const minimum = Math.max(0, Math.min(...scores) - 10000);
    const maximum = Math.min(1000000, Math.max(...scores) + 10000);

    return (
        <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={plays}
                    margin={{ top: 12, right: 10, bottom: 0, left: 10 }}
                >
                    <XAxis dataKey="play_time" hide />
                    <YAxis domain={[minimum, maximum]} hide />
                    <Tooltip
                        cursor={{ stroke: "var(--color-divider)" }}
                        contentStyle={{
                            background: "var(--color-surface-muted)",
                            border: "1px solid var(--color-border)",
                            borderRadius: 6,
                            fontSize: 12,
                        }}
                        formatter={(value) => [
                            Number(value).toLocaleString("ko-KR"),
                            "점수",
                        ]}
                        labelFormatter={(_, payload) =>
                            payload[0]?.payload.play_time ?? ""
                        }
                    />
                    <Line
                        type="linear"
                        dataKey="score"
                        stroke="var(--color-chart)"
                        strokeWidth={3}
                        dot={{
                            r: 4,
                            fill: "var(--color-text-primary)",
                            stroke: "var(--color-chart)",
                            strokeWidth: 2,
                        }}
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
            <div className="text-text-disabled -mt-5 flex justify-between text-[10px]">
                <span>{plays[0]?.play_time.split(" ")[0]}</span>
                <span>{plays.at(-1)?.play_time.split(" ")[0]} 현재</span>
            </div>
        </div>
    );
}
