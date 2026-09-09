"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "@/components/i18n/localeProvider";
import useElementWidth from "@/lib/hooks/useElementWidth";
import type { CommunityData } from "@/features/music/schemas/communitySchema";

export default function TierVoteDistribution({
    scope,
}: {
    scope: CommunityData["scopes"][number];
}) {
    const t = useTranslations();
    const { ref, width } = useElementWidth<HTMLDivElement>();
    const [shift, setShift] = useState(0);
    const capacity = Math.max(1, Math.min(5, Math.floor((width + 8) / 40)));
    const values = scope.distribution;
    const max = Math.max(1, ...values.map((entry) => entry.count));
    const counts = [...new Set(values.map((entry) => entry.count))].sort(
        (a, b) => b - a
    );
    const center = values.reduce(
        (nearest, entry, index) =>
            Math.abs(entry.value - (scope.average ?? 0)) <
            Math.abs(values[nearest].value - (scope.average ?? 0))
                ? index
                : nearest,
        0
    );
    const end = Math.max(0, values.length - capacity);
    const initial = Math.max(
        0,
        Math.min(end, center - Math.floor(capacity / 2))
    );
    const start = Math.max(0, Math.min(end, initial + shift));
    const visible = values.slice(start, start + capacity);
    const name = `${scope.mode === "basic" ? "Basic" : "Recital"} ${t(`community.goal.${scope.goal}`)}`;
    return (
        <section
            className="nl-vote-distribution"
            aria-label={t("community.distribution", { scope: name })}
        >
            <div className="nl-vote-distribution__header">
                <h3 className="nl-control">
                    {t("community.distribution", { scope: name })}
                </h3>
                <p>
                    <span className="nl-metadata nl-muted">
                        {t("community.voteCount", { count: scope.count })}
                    </span>
                    <span className="nl-metadata nl-muted">
                        {t("community.mean")}
                    </span>
                    <span className="nl-metric-value">
                        {scope.average?.toFixed(1)}
                    </span>
                </p>
            </div>
            <div className="nl-vote-distribution__window">
                <button
                    className="nl-icon-button"
                    type="button"
                    aria-label={t("community.previousValue")}
                    disabled={start === 0}
                    onClick={() => setShift(start - initial - 1)}
                >
                    <ChevronLeft className="nl-icon" aria-hidden />
                </button>
                <div
                    ref={ref}
                    className="nl-vote-distribution__values"
                    aria-hidden
                >
                    {visible.map((entry) => (
                        <div
                            key={entry.value}
                            className="nl-vote-distribution__value"
                        >
                            <span className="nl-metric-value">
                                {entry.count}
                            </span>
                            <div className="nl-vote-distribution__slot">
                                <span
                                    data-rank={Math.min(
                                        2,
                                        counts.indexOf(entry.count)
                                    )}
                                    style={{
                                        height: `${(entry.count / max) * 100}%`,
                                    }}
                                />
                            </div>
                            <span className="nl-metadata nl-muted">
                                {entry.value.toFixed(1)}
                            </span>
                        </div>
                    ))}
                </div>
                <button
                    className="nl-icon-button"
                    type="button"
                    aria-label={t("community.nextValue")}
                    disabled={start === end}
                    onClick={() => setShift(start - initial + 1)}
                >
                    <ChevronRight className="nl-icon" aria-hidden />
                </button>
            </div>
            <p className="sr-only" role="status">
                {visible.length
                    ? t("community.valueRange", {
                          first: visible[0].value.toFixed(1),
                          last: visible.at(-1)!.value.toFixed(1),
                      })
                    : null}
            </p>
            <table className="sr-only">
                <caption>
                    {t("community.distribution", { scope: name })}
                </caption>
                <thead>
                    <tr>
                        <th scope="col">{t("community.voteValue")}</th>
                        <th scope="col">{t("ranking.playerCount")}</th>
                    </tr>
                </thead>
                <tbody>
                    {values.map((entry) => (
                        <tr key={entry.value}>
                            <th scope="row">{entry.value.toFixed(1)}</th>
                            <td>{entry.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
