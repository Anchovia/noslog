"use client";

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
                        서열 상수별 최대 기여 점수
                    </h3>
                    <p className="text-micro mt-0.5">
                        Basic {goalLabel} · 1곡 기준
                    </p>
                </div>
                <span className="text-caption shrink-0">
                    총 {BASIC_RATING_MAX.toLocaleString("ko-KR")}점
                </span>
            </div>

            <div
                className="mt-3 h-48 w-full"
                aria-label="서열 상수 1.0부터 14.5까지의 최대 레이팅 기여 점수 그래프"
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
                                Math.round(Number(value)).toLocaleString(
                                    "ko-KR"
                                )
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
                                `서열 ${Number(value).toFixed(1)}`
                            }
                            formatter={(value) => [
                                `${Number(value).toFixed(2)}점`,
                                `${goalLabel} 최대 기여`,
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
                서열 상수² ÷ 상위 {BASIC_RATING_TOP_COUNT}곡 이론값 ×{" "}
                {BASIC_RATING_MAX.toLocaleString("ko-KR")}
            </p>

            {goal === "pianist" ? (
                <div className="border-divider mt-3 border-t pt-3">
                    <p className="text-micro mb-2">점수별 반영 비율</p>
                    <dl className="grid grid-cols-3 gap-2">
                        {scoreAnchors.map(([score, coefficient]) => (
                            <div key={score}>
                                <dt className="text-micro tabular-nums">
                                    {score === 1_000_000
                                        ? "Pianist"
                                        : score.toLocaleString("ko-KR")}
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
                        ? "S 달성 기준은 950,000점 이상입니다."
                        : "Full Combo 달성 여부를 기준으로 합니다."}
                </p>
            )}
        </section>
    );
}
