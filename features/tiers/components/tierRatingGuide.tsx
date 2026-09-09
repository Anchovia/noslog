"use client";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import Disclosure from "@/components/ui/disclosure";
import LineChart from "@/components/ui/lineChart";
import { tierGoalLabels, TIER_BAND_VALUES } from "@/lib/tiers";
import {
    BASIC_RATING_ACTIVE_CURVE,
    BASIC_RATING_CURVES,
    BASIC_RATING_MAX,
    BASIC_RATING_TOP_COUNT,
    getBasicRatingMaxContribution,
} from "@/lib/tiers/basicRating";
import type {
    TierBrowserOverview,
    TierBrowserQuery,
} from "@/features/tiers/schemas/tierBrowserSchema";

export default function TierRatingGuide({
    query,
    overview,
}: {
    query: TierBrowserQuery;
    overview: TierBrowserOverview;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const max = overview.theoreticalMax;
    const points = max
        ? [...TIER_BAND_VALUES].reverse().map((value) => ({
              id: value,
              dimension: value.toFixed(1),
              shortDimension: String(value),
              value: getBasicRatingMaxContribution(value, max),
          }))
        : [];
    return (
        <Disclosure
            compact
            className="nl-tier-guide-disclosure"
            title={t("tiers.guide", { goal: tierGoalLabels[query.goal] })}
        >
            <div className="nl-tier-guide nl-body-secondary nl-muted">
                <p>{t("tiers.filterHelp")}</p>
                {overview.list ? (
                    <p className="nl-metadata">
                        {t("tiers.updated", {
                            date: new Intl.DateTimeFormat(locale, {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                timeZone: "Asia/Seoul",
                            }).format(new Date(overview.list.updatedAt)),
                        })}
                    </p>
                ) : null}
                {query.goal === "pianist" && max ? (
                    <section className="nl-tier-weight">
                        <div className="nl-tier-weight__heading">
                            <div>
                                <h3 className="nl-component-title">
                                    {t("tiers.weight.title")}
                                </h3>
                                <p className="nl-metadata">
                                    {t("tiers.weight.modePerSong", {
                                        mode:
                                            query.mode === "basic"
                                                ? "Basic"
                                                : "Recital",
                                    })}
                                </p>
                            </div>
                            <span className="nl-control">
                                {t("tiers.weight.total", {
                                    score: BASIC_RATING_MAX.toLocaleString(
                                        locale
                                    ),
                                })}
                            </span>
                        </div>
                        <LineChart
                            points={points}
                            dimensionTickIndices={[
                                0, 20, 40, 60, 80, 100, 120, 135,
                            ]}
                            valueTickCount={5}
                            verticalInset={8}
                            showPoints={false}
                            tableVisibility="screen-reader"
                            label={t("tiers.weight.chartAria")}
                            dimensionLabel={t("tiers.bands")}
                            valueLabel={t("tiers.weight.maxContribution", {
                                goal: "Pianist",
                            })}
                            formatValue={(value) =>
                                value.toLocaleString(locale, {
                                    maximumFractionDigits: 2,
                                })
                            }
                            formatAxis={(value) =>
                                value.toLocaleString(locale, {
                                    maximumFractionDigits: 0,
                                })
                            }
                            domain={[
                                0,
                                Math.ceil(points.at(-1)!.value / 50) * 50,
                            ]}
                            emptyMessage=""
                            singleMessage=""
                        />
                        <p className="nl-metadata">
                            {t("tiers.weight.formula", {
                                count: BASIC_RATING_TOP_COUNT,
                                score: BASIC_RATING_MAX.toLocaleString(locale),
                            })}
                        </p>
                        <h4 className="nl-metadata">
                            {t("tiers.weight.scoreRatio")}
                        </h4>
                        <dl className="nl-tier-weight__ratios">
                            {BASIC_RATING_CURVES[
                                BASIC_RATING_ACTIVE_CURVE
                            ].anchors.map(([score, value]) => (
                                <div key={score}>
                                    <dt className="nl-metadata">
                                        {score === 1_000_000
                                            ? "Pianist"
                                            : score.toLocaleString(locale)}
                                    </dt>
                                    <dd className="nl-control">
                                        {Math.round(value * 100)}%
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                ) : query.goal !== "pianist" ? (
                    <p>
                        {t(
                            query.goal === "s"
                                ? "tiers.weight.sRequirement"
                                : "tiers.weight.fcRequirement"
                        )}
                    </p>
                ) : null}
            </div>
        </Disclosure>
    );
}
