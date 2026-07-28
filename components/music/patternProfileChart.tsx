"use client";

import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
} from "recharts";
import { useTranslations } from "@/components/i18n/localeProvider";

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
    const t = useTranslations();
    const data = [
        { label: t("music.pattern.stairs"), value: values.stairs },
        { label: t("music.pattern.repetition"), value: values.repetition },
        { label: t("music.pattern.chord"), value: values.chord },
        { label: t("music.pattern.trill"), value: values.trill },
        { label: t("music.pattern.glissando"), value: values.glissando },
    ];

    return (
        <div className="h-32 min-w-0 flex-1 [&_.recharts-surface]:outline-none [&_.recharts-wrapper]:outline-none">
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
