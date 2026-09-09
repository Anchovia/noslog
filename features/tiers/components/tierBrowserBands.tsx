"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import ResultState from "@/components/ui/resultState";
import { tierBrowserBandOptions } from "@/features/tiers/api/tierBrowser";
import type {
    TierBrowserBand,
    TierBrowserBandSummary,
    TierBrowserOverview,
    TierBrowserQuery,
} from "@/features/tiers/schemas/tierBrowserSchema";
import { formatTierValue } from "@/lib/tiers";
import TierBrowserCard from "./tierBrowserCard";

function TierBrowserBandSection({
    summary,
    query,
    overview,
    initialBand,
    pending,
}: {
    summary: TierBrowserBandSummary;
    query: TierBrowserQuery;
    overview: TierBrowserOverview;
    initialBand: TierBrowserBand | null;
    pending: boolean;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const ref = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);
    const band = useQuery({
        ...tierBrowserBandOptions(
            query,
            summary.id,
            locale,
            overview.viewerId,
            overview.showLocalizedTitle
        ),
        initialData: initialBand?.id === summary.id ? initialBand : undefined,
        enabled: visible && !pending,
    });
    useEffect(() => {
        if (!ref.current || visible) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "240px 0px" }
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [visible]);
    return (
        <section
            ref={ref}
            className="nl-tier-band"
            aria-label={formatTierValue(summary.value)}
            aria-busy={pending || (visible && band.isPending)}
        >
            <header className="nl-tier-band__header">
                <h2 className="nl-section-title">
                    {formatTierValue(summary.value)}
                </h2>
                {overview.viewerId !== null ? (
                    <span className="nl-control nl-muted">
                        {t("tiers.achieved", {
                            count: summary.achievedCount ?? "—",
                            total: summary.totalCount,
                        })}
                    </span>
                ) : null}
            </header>
            {band.isError ? (
                <ResultState
                    message={t("tiers.loadError")}
                    action={
                        <ActionButton
                            variant="secondary"
                            busy={band.isFetching}
                            onClick={() => void band.refetch()}
                        >
                            {t("tiers.retry")}
                        </ActionButton>
                    }
                />
            ) : null}
            <div className="nl-tier-grid" data-detailed={query.detailed}>
                {band.data
                    ? band.data.entries.map((entry) => (
                          <TierBrowserCard
                              key={entry.id}
                              entry={entry}
                              query={query}
                              signedIn={overview.viewerId !== null}
                              pending={pending}
                          />
                      ))
                    : !band.isError
                      ? Array.from(
                            { length: summary.totalCount },
                            (_, index) => (
                                <div
                                    key={index}
                                    className="nl-tier-card nl-tier-card--skeleton"
                                    data-detailed={query.detailed}
                                    aria-hidden
                                >
                                    <span className="nl-tier-card__jacket" />
                                    {overview.viewerId !== null ||
                                    query.detailed ? (
                                        <span className="nl-tier-skeleton-line" />
                                    ) : null}
                                    {query.detailed ? (
                                        <>
                                            <span className="nl-tier-skeleton-line" />
                                            <span className="nl-tier-skeleton-line" />
                                            <span className="nl-tier-skeleton-line" />
                                        </>
                                    ) : null}
                                </div>
                            )
                        )
                      : null}
            </div>
            {visible && band.isPending ? (
                <span className="sr-only" role="status">
                    {t("tiers.loading")}
                </span>
            ) : null}
        </section>
    );
}

export default function TierBrowserBands({
    query,
    overview,
    initialBand,
    pending,
}: {
    query: TierBrowserQuery;
    overview: TierBrowserOverview;
    initialBand: TierBrowserBand | null;
    pending: boolean;
}) {
    const t = useTranslations();
    const bands =
        overview.list?.bands.filter(
            (band) =>
                band.totalCount > 0 &&
                (!query.bands.length || query.bands.includes(band.value))
        ) ?? [];
    return (
        <div className="nl-tier-bands" aria-label={t("tiers.bands")}>
            {bands.map((summary) => (
                <TierBrowserBandSection
                    key={`${overview.list!.id}:${summary.id}`}
                    summary={summary}
                    query={query}
                    overview={overview}
                    initialBand={initialBand}
                    pending={pending}
                />
            ))}
        </div>
    );
}
