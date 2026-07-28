"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";

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
    const locale = useLocale();
    const t = useTranslations();
    const dataKey = mode === "basic" ? "grade_basic" : "grade_recital";
    const numberLocale =
        locale === "ja" ? "ja-JP" : locale === "en" ? "en-US" : "ko-KR";

    if (data.length < 2) {
        return (
            <div className="text-text-disabled flex h-24 items-center justify-center text-sm">
                {t("profile.gradeTrendEmpty")}
            </div>
        );
    }

    return (
        <div
            className="h-24 w-full"
            aria-label={t("profile.gradeTrendAria", { mode })}
        >
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
                            border: "1px solid var(--color-border)",
                            borderRadius: 8,
                            background: "var(--color-surface)",
                            color: "var(--color-text-primary)",
                            fontSize: 12,
                        }}
                        labelStyle={{ color: "var(--color-text-secondary)" }}
                        labelFormatter={(_, payload) => {
                            const point = payload[0]?.payload as
                                GradeHistoryPoint | undefined;
                            return point
                                ? formatGradeHistoryDate(point.besttime)
                                : "";
                        }}
                        formatter={(value) => [
                            Number(value).toLocaleString(numberLocale),
                            "Grd",
                        ]}
                    />
                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke="var(--color-score)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{
                            r: 4,
                            fill: "var(--color-score)",
                            strokeWidth: 0,
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
