"use client";

import { useId } from "react";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import type { ChartDetail } from "@/components/music/musicDetailTypes";

export default function ScoreDistribution({
    distribution,
    participants,
}: {
    distribution: ChartDetail["scoreDistribution"];
    participants: number;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const id = useId();
    const denominator = distribution.reduce((sum, band) => sum + band.count, 0);
    const maximum = Math.max(1, ...distribution.map((band) => band.count));
    const description = t("ranking.highSkill", {
        count: denominator.toLocaleString(locale),
    });
    return (
        <figure
            className="nl-score-distribution"
            aria-label={`${t("music.info.scoreDistribution")} · ${description}`}
        >
            <figcaption className="nl-score-distribution__header">
                <h2 className="nl-component-title">
                    {t("music.info.scoreDistribution")}
                </h2>
                <span className="nl-metadata nl-muted">
                    {t("ranking.participants", {
                        count: participants.toLocaleString(locale),
                    })}
                </span>
            </figcaption>
            <p className="sr-only" id={id}>
                {description}
            </p>
            <table
                className="nl-score-distribution__table"
                aria-describedby={id}
            >
                <caption className="sr-only">{description}</caption>
                <thead className="sr-only">
                    <tr>
                        <th scope="col">{t("ranking.scoreBand")}</th>
                        <th scope="col">{t("ranking.playerCount")}</th>
                    </tr>
                </thead>
                <tbody>
                    {distribution.map((band, index) => (
                        <tr key={band.key}>
                            <th scope="row" className="nl-metadata nl-muted">
                                {band.label}
                            </th>
                            <td className="nl-score-distribution__count nl-metric-value">
                                {band.count.toLocaleString(locale)}
                            </td>
                            <td
                                className="nl-score-distribution__slot"
                                aria-hidden
                            >
                                <span
                                    className="nl-score-distribution__bar"
                                    data-bucket={index + 1}
                                    style={{
                                        height: `${(band.count / maximum) * 100}%`,
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="nl-score-distribution__baseline" aria-hidden />
        </figure>
    );
}
