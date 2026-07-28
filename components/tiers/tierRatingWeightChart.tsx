"use client";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {
    BASIC_RATING_ACTIVE_CURVE,
    BASIC_RATING_CURVES,
    BASIC_RATING_MAX,
    BASIC_RATING_TOP_COUNT,
    getBasicRatingMaxContribution,
} from "@/lib/tiers/basicRating";
import { tierGoalLabels, type TierGoal } from "@/lib/tiers";

const tierConstants = Array.from({ length: 136 }, (_, index) =>
    Number((1 + index / 10).toFixed(1))
);
const xTicks = [1, 3, 5, 7, 9, 11, 13, 14.5];

export default function TierRatingWeightChart({
    theoreticalMax,
    goal,
}: {
    theoreticalMax: number;
    goal: TierGoal;
}) {
    const locale = useLocale();
    const t = useTranslations();
    const data = tierConstants.map((tierConstant) => ({
        tierConstant,
        maxContribution: Number(
            getBasicRatingMaxContribution(tierConstant, theoreticalMax).toFixed(
                3
            )
        ),
    }));
    const scoreAnchors = BASIC_RATING_CURVES[BASIC_RATING_ACTIVE_CURVE].anchors;
    const goalLabel = tierGoalLabels[goal];

    return (
        <section className="bg-bg rounded-md p-3">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-label font-semibold">
                        {t("tiers.weight.title")}
                    </h3>
                    <p className="text-micro mt-0.5">
                        {t("tiers.weight.perSong", { goal: goalLabel })}
                    </p>
                </div>
                <span className="text-caption shrink-0">
                    {t("tiers.weight.total", {
                        score: BASIC_RATING_MAX.toLocaleString(locale),
                    })}
                </span>
            </div>

            <div
                className="mt-3 h-48 w-full"
                aria-label={t("tiers.weight.chartAria")}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        accessibilityLayer={false}
                        margin={{ top: 6, right: 6, bottom: 0, left: -12 }}
                    >
                        <CartesianGrid
                            stroke="var(--color-divider)"
                            vertical={false}
                        />
                        <XAxis
                            type="number"
                            dataKey="tierConstant"
                            domain={[1, 14.5]}
                            ticks={xTicks}
                            tick={{
                                fill: "var(--color-text-disabled)",
                                fontSize: 10,
                            }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, "auto"]}
                            tickFormatter={(value) =>
                                Math.round(Number(value)).toLocaleString(locale)
                            }
                            tick={{
                                fill: "var(--color-text-disabled)",
                                fontSize: 10,
                            }}
                            axisLine={false}
                            tickLine={false}
                            width={46}
                        />
                        <Tooltip
                            cursor={{
                                stroke: "var(--color-border)",
                                strokeDasharray: "3 3",
                            }}
                            contentStyle={{
                                background: "var(--color-surface)",
                                border: "1px solid var(--color-border)",
                                borderRadius: 8,
                                color: "var(--color-text-primary)",
                                fontSize: 12,
                            }}
                            labelStyle={{
                                color: "var(--color-text-secondary)",
                            }}
                            labelFormatter={(value) =>
                                t("tiers.weight.tier", {
                                    value: Number(value).toFixed(1),
                                })
                            }
                            formatter={(value) => [
                                t("music.record.points", {
                                    count: Number(value).toFixed(2),
                                }),
                                t("tiers.weight.maxContribution", {
                                    goal: goalLabel,
                                }),
                            ]}
                        />
                        <Line
                            type="monotone"
                            dataKey="maxContribution"
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

            <p className="text-micro mt-1">
                {t("tiers.weight.formula", {
                    count: BASIC_RATING_TOP_COUNT,
                    score: BASIC_RATING_MAX.toLocaleString(locale),
                })}
            </p>

            {goal === "pianist" ? (
                <div className="border-divider mt-3 border-t pt-3">
                    <p className="text-micro mb-2">
                        {t("tiers.weight.scoreRatio")}
                    </p>
                    <dl className="grid grid-cols-3 gap-2">
                        {scoreAnchors.map(([score, coefficient]) => (
                            <div key={score}>
                                <dt className="text-micro tabular-nums">
                                    {score === 1_000_000
                                        ? "Pianist"
                                        : score.toLocaleString(locale)}
                                </dt>
                                <dd className="text-caption text-text-primary tabular-nums">
                                    {Math.round(coefficient * 100)}%
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            ) : (
                <p className="border-divider text-micro mt-3 border-t pt-3">
                    {goal === "s"
                        ? t("tiers.weight.sRequirement")
                        : t("tiers.weight.fcRequirement")}
                </p>
            )}
        </section>
    );
}
