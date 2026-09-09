"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "@/components/i18n/localeProvider";
import type { ChartDetail } from "@/components/music/musicDetailTypes";
import ActionButton from "@/components/ui/actionButton";
import PatternRadar from "./patternRadar";
import ResultState from "@/components/ui/resultState";
import { communityPatternOptions } from "../api/community";

export default function ChartInfoPanel({ chart }: { chart: ChartDetail }) {
    const t = useTranslations();
    const query = useQuery(communityPatternOptions(chart.id));
    const bpm =
        chart.bpm_min === null
            ? "—"
            : chart.bpm_max !== null && chart.bpm_max !== chart.bpm_min
              ? `${chart.bpm_min}–${chart.bpm_max}`
              : String(chart.bpm_min);
    const duration =
        chart.duration_seconds === null
            ? "—"
            : `${Math.floor(chart.duration_seconds / 60)}:${String(chart.duration_seconds % 60).padStart(2, "0")}`;
    const facts = [
        { label: "BPM", value: bpm },
        {
            label: t("music.info.noteCount"),
            value: chart.note_count?.toLocaleString() ?? "—",
        },
        { label: t("detail.duration"), value: duration },
        ...(chart.released_at
            ? [
                  {
                      label: t("music.info.releaseDate"),
                      value: chart.released_at.slice(0, 10),
                  },
              ]
            : []),
        ...(chart.unlock_condition
            ? [{ label: t("music.info.unlock"), value: chart.unlock_condition }]
            : []),
    ];
    return (
        <>
            <h2 className="nl-section-title">{t("detail.info")}</h2>
            <div className="nl-detail-columns">
                <div aria-busy={query.isFetching || undefined}>
                    {query.data ? (
                        <PatternRadar data={query.data.pattern} />
                    ) : query.isError ? (
                        <ResultState
                            error
                            message={t("detail.error")}
                            action={
                                <ActionButton
                                    onClick={() => void query.refetch()}
                                >
                                    {t("common.retry")}
                                </ActionButton>
                            }
                        />
                    ) : (
                        <div
                            className="nl-pattern-skeleton"
                            role="status"
                            aria-label={t("pattern.loading")}
                        />
                    )}
                </div>
                <section className="nl-detail-panel">
                    <h3 className="nl-section-title">{t("detail.basic")}</h3>
                    <dl className="nl-facts nl-body-secondary">
                        {facts.map((fact) => (
                            <div key={fact.label}>
                                <dt>{fact.label}</dt>
                                <dd className="nl-metric-value">
                                    {fact.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>
            </div>
        </>
    );
}
