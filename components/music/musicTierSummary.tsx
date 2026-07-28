"use client";

import { cn } from "@/lib/utils";
import { useMemo } from "react";
import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type {
    CommunityEvaluation,
    ConstantHistoryItem,
} from "./musicTierVoteTypes";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";

interface MusicTierSummaryProps {
    tierConstant: number | null;
    constantHistory: ConstantHistoryItem[];
    community: CommunityEvaluation;
}

function formatMonth(value: string) {
    return value.slice(0, 7).replace("-", ".");
}

export default function MusicTierSummary({
    tierConstant,
    constantHistory,
    community,
}: MusicTierSummaryProps) {
    const locale = useLocale();
    const t = useTranslations();
    const histogram = useMemo(() => {
        if (community.distribution.length === 0) return [];

        const distribution = new Map(
            community.distribution.map((item) => [
                Math.round(item.value * 10),
                item.count,
            ])
        );
        const values = [...distribution.keys()];
        const minimum = Math.min(...values);
        const maximum = Math.max(...values);

        return Array.from({ length: maximum - minimum + 1 }, (_, index) => {
            const tick = minimum + index;

            return {
                value: tick / 10,
                count: distribution.get(tick) ?? 0,
            };
        });
    }, [community.distribution]);
    const maximumHistogramCount = Math.max(
        1,
        ...histogram.map((item) => item.count)
    );
    const highlightedHistogramValue =
        community.average === null || community.distribution.length === 0
            ? null
            : community.distribution.reduce((closest, item) =>
                  Math.abs(item.value - community.average!) <
                  Math.abs(closest.value - community.average!)
                      ? item
                      : closest
              ).value;
    const constantDelta =
        constantHistory.length > 1
            ? constantHistory.at(-1)!.value - constantHistory[0].value
            : 0;

    return (
        <>
            <section className="bg-surface rounded-card p-4">
                <header className="flex items-center gap-2">
                    <h2 className="text-section">{t("music.tier.history")}</h2>
                    {tierConstant !== null ? (
                        <strong className="text-text-primary text-base tabular-nums">
                            {tierConstant.toFixed(1)}
                        </strong>
                    ) : null}
                    {constantDelta !== 0 ? (
                        <span
                            className={cn(
                                "rounded px-1.5 py-1 text-xs font-bold tabular-nums",
                                constantDelta > 0
                                    ? "bg-danger/15 text-danger"
                                    : "bg-chart/15 text-chart"
                            )}
                        >
                            {constantDelta > 0 ? "+" : ""}
                            {constantDelta.toFixed(1)}
                        </span>
                    ) : null}
                </header>

                {constantHistory.length > 0 ? (
                    <div className="mt-2 h-24 [&_.recharts-surface:focus:not(:focus-visible)]:outline-none">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={constantHistory}
                                margin={{
                                    top: 12,
                                    right: 8,
                                    bottom: 14,
                                    left: 8,
                                }}
                            >
                                <XAxis dataKey="effectiveAt" hide />
                                <YAxis
                                    domain={["dataMin - 0.1", "dataMax + 0.1"]}
                                    hide
                                />
                                <Tooltip
                                    contentStyle={{
                                        background:
                                            "var(--color-surface-muted)",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: 6,
                                        fontSize: 12,
                                    }}
                                    formatter={(value) => [
                                        Number(value).toFixed(1),
                                        t("music.tier.constant"),
                                    ]}
                                    labelFormatter={(value) =>
                                        formatMonth(String(value))
                                    }
                                />
                                <Line
                                    type="linear"
                                    dataKey="value"
                                    stroke="var(--color-text-secondary)"
                                    strokeWidth={3}
                                    dot={{
                                        r: 3,
                                        fill: "var(--color-text-disabled)",
                                        strokeWidth: 0,
                                    }}
                                    activeDot={{
                                        r: 5,
                                        fill: "var(--color-text-primary)",
                                        stroke: "var(--color-border)",
                                        strokeWidth: 3,
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="text-text-disabled -mt-4 flex justify-between text-xs">
                            <span>
                                {formatMonth(constantHistory[0].effectiveAt)}{" "}
                                {t("music.tier.listed")}
                            </span>
                            <span>
                                {formatMonth(
                                    constantHistory.at(-1)!.effectiveAt
                                )}{" "}
                                {t("music.tier.current")}
                            </span>
                        </div>
                    </div>
                ) : (
                    <p className="text-body-muted flex h-20 items-center justify-center">
                        {t("music.tier.noHistory")}
                    </p>
                )}
            </section>

            <section className="bg-surface rounded-card p-4">
                <header className="flex items-baseline gap-2">
                    <h2 className="text-section">
                        {t("music.tier.community")}
                    </h2>
                    <strong className="text-real text-xl font-extrabold tabular-nums">
                        {community.average?.toFixed(2) ?? "-"}
                    </strong>
                    <span className="text-caption ml-auto">
                        {t("music.tier.votes", {
                            count: community.count.toLocaleString(locale),
                        })}
                    </span>
                </header>
                {histogram.length > 0 ? (
                    <div className="mt-3 overflow-x-auto pb-1">
                        <div
                            className={cn(
                                "flex h-14 items-end gap-1",
                                histogram.length <= 6
                                    ? "justify-center"
                                    : "w-max"
                            )}
                        >
                            {histogram.map((item) => (
                                <div
                                    key={item.value}
                                    className="flex h-full w-12 shrink-0 flex-col items-center justify-end gap-1"
                                >
                                    <span
                                        className={cn(
                                            "min-h-1 w-full rounded-t-sm",
                                            highlightedHistogramValue !==
                                                null &&
                                                Math.round(item.value * 10) ===
                                                    Math.round(
                                                        highlightedHistogramValue *
                                                            10
                                                    )
                                                ? "bg-real"
                                                : "bg-border"
                                        )}
                                        style={{
                                            height: `${Math.max(
                                                item.count > 0 ? 10 : 4,
                                                (item.count /
                                                    maximumHistogramCount) *
                                                    34
                                            )}px`,
                                        }}
                                    />
                                    <span className="text-text-disabled text-xs tabular-nums">
                                        {item.value.toFixed(1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-body-muted flex h-14 items-center justify-center">
                        {t("music.tier.noVotes")}
                    </p>
                )}
            </section>
        </>
    );
}
