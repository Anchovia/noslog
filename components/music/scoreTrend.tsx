"use client";

import { formatScoreRecordDate } from "@/lib/music/scoreTrend";
import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface ScoreTrendProps {
    points: {
        id: number;
        score: number;
        rank: string;
        play_time: string;
    }[];
}

export default function ScoreTrend({ points }: ScoreTrendProps) {
    if (points.length === 0) {
        return (
            <div className="text-text-disabled flex h-32 items-center justify-center text-sm">
                베스트 스코어 갱신 이력이 없습니다.
            </div>
        );
    }

    const scores = points.map((point) => point.score);
    const minimum = Math.max(0, Math.min(...scores) - 10000);
    const maximum = Math.min(1000000, Math.max(...scores) + 10000);

    return (
        <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={points}
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
                            formatScoreRecordDate(
                                payload[0]?.payload.play_time ?? ""
                            )
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
            <div className="text-caption text-text-disabled -mt-5 flex justify-between">
                <span>{formatScoreRecordDate(points[0]?.play_time ?? "")}</span>
                <span>
                    {formatScoreRecordDate(points.at(-1)?.play_time ?? "")}
                </span>
            </div>
        </div>
    );
}
