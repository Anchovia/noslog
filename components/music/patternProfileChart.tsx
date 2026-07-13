"use client";

import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
} from "recharts";

interface PatternProfileChartProps {
    values: {
        stairs: number;
        chord: number;
        trill: number;
        glissando: number;
        repetition: number;
    };
}

export default function PatternProfileChart({
    values,
}: PatternProfileChartProps) {
    const data = [
        { label: "계단", value: values.stairs },
        { label: "동치", value: values.chord },
        { label: "트릴", value: values.trill },
        { label: "글리산도", value: values.glissando },
        { label: "연타", value: values.repetition },
    ];

    return (
        <div className="h-32 min-w-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data} outerRadius="66%">
                    <PolarGrid stroke="var(--color-border)" />
                    <PolarAngleAxis
                        dataKey="label"
                        tick={{
                            fill: "var(--color-text-secondary)",
                            fontSize: 9,
                        }}
                    />
                    <PolarRadiusAxis
                        domain={[0, 4]}
                        tick={false}
                        axisLine={false}
                    />
                    <Radar
                        dataKey="value"
                        stroke="var(--color-chart)"
                        fill="var(--color-chart)"
                        fillOpacity={0.25}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
