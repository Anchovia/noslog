"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { tierBandQueryOptions } from "@/features/tiers/api/tierBands";

import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import {
    formatTierValue,
    isTierGoalAchieved,
    type PublicTierBandPayload,
    type TierDifficulty,
    type TierGoal,
} from "@/lib/tiers";
import TierChartCard from "./tierChartCard";
import TierRecordDetail from "./tierRecordDetail";

interface TierBandSummary {
    id: number;
    value: number;
    position: number;
    totalCount: number;
}

interface TierBandBrowserProps {
    slug: string;
    bands: TierBandSummary[];
    initialBand: PublicTierBandPayload | null;
    goal: TierGoal;
    difficulties: TierDifficulty[];
    levels: string[];
    showRecords: boolean;
    viewerId: number | null;
    showLocalizedTitle: boolean;
}

function TierBandSection({
    slug,
    summary,
    initialData,
    goal,
    difficulties,
    levels,
    showRecords,
    viewerId,
    showLocalizedTitle,
}: {
    slug: string;
    summary: TierBandSummary;
    initialData: PublicTierBandPayload | null;
    goal: TierGoal;
    difficulties: TierDifficulty[];
    levels: string[];
    showRecords: boolean;
    viewerId: number | null;
    showLocalizedTitle: boolean;
}) {
    const locale = useLocale();
    const t = useTranslations();
    const containerRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const {
        data: band,
        isError: hasError,
        refetch,
    } = useQuery({
        ...tierBandQueryOptions({
            slug,
            bandId: summary.id,
            difficulties,
            levels,
            locale,
            viewerId,
            showLocalizedTitle,
        }),
        initialData: initialData ?? undefined,
        enabled: isVisible,
    });
    const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);

    useEffect(() => {
        if (band || isVisible || !containerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "240px 0px" }
        );
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [band, isVisible]);

    const achievedCount =
        band?.entries.filter((entry) => isTierGoalAchieved(entry.record, goal))
            .length ?? 0;

    return (
        <section
            ref={containerRef}
            className="bg-surface rounded-card min-h-36 overflow-hidden"
        >
            <header className="bg-surface-muted border-real/70 flex min-h-11 items-center gap-3 border-l-3 px-3">
                <h2 className="text-section font-bold tabular-nums">
                    {formatTierValue(summary.value)}
                </h2>
                <span className="text-caption ml-auto">
                    {showRecords && band
                        ? t("tiers.achieved", {
                              count: achievedCount,
                              total: band.entries.length,
                          })
                        : t("tiers.songCount", {
                              count: summary.totalCount,
                          })}
                </span>
            </header>

            {!band ? (
                <div className="text-text-disabled flex h-28 items-center justify-center px-4 text-center text-sm">
                    {hasError ? (
                        <button
                            type="button"
                            onClick={() => void refetch()}
                            className="border-border bg-surface-muted text-text-secondary cursor-pointer rounded-md border px-3 py-2 font-semibold"
                        >
                            {t("tiers.retry")}
                        </button>
                    ) : (
                        t("tiers.loading")
                    )}
                </div>
            ) : band.entries.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 p-3">
                    {Array.from(
                        { length: Math.ceil(band.entries.length / 3) },
                        (_, rowIndex) =>
                            band.entries.slice(rowIndex * 3, rowIndex * 3 + 3)
                    ).map((row, rowIndex) => {
                        const selectedEntry = row.find(
                            (entry) => entry.id === selectedEntryId
                        );
                        const panelId = selectedEntry
                            ? `tier-record-detail-${selectedEntry.id}`
                            : undefined;

                        return (
                            <Fragment key={`tier-row-${rowIndex}`}>
                                {row.map((entry) => (
                                    <TierChartCard
                                        key={entry.id}
                                        entryId={entry.id}
                                        chart={entry.chart}
                                        record={entry.record ?? undefined}
                                        goal={goal}
                                        showRecord={showRecords}
                                        selected={entry.id === selectedEntryId}
                                        detailPanelId={
                                            entry.id === selectedEntryId
                                                ? panelId
                                                : undefined
                                        }
                                        onSelect={() =>
                                            setSelectedEntryId((current) =>
                                                current === entry.id
                                                    ? null
                                                    : entry.id
                                            )
                                        }
                                    />
                                ))}
                                {selectedEntry && panelId ? (
                                    <TierRecordDetail
                                        entry={selectedEntry}
                                        panelId={panelId}
                                    />
                                ) : null}
                            </Fragment>
                        );
                    })}
                </div>
            ) : (
                <div className="text-text-disabled flex h-24 items-center justify-center px-4 text-center text-sm">
                    {t("tiers.noCharts")}
                </div>
            )}
        </section>
    );
}

export default function TierBandBrowser({
    slug,
    bands,
    initialBand,
    goal,
    difficulties,
    levels,
    showRecords,
    viewerId,
    showLocalizedTitle,
}: TierBandBrowserProps) {
    const t = useTranslations();
    const locale = useLocale();
    if (bands.length === 0) {
        return (
            <div className="bg-surface text-text-disabled rounded-card flex h-32 items-center justify-center px-4 text-center text-sm">
                {t("tiers.noCharts")}
            </div>
        );
    }

    return (
        <section className="flex flex-col gap-4" aria-label={t("tiers.bands")}>
            {bands.map((band) => (
                <TierBandSection
                    key={`${slug}:${band.id}:${difficulties.join(",")}:${levels.join(",")}:${locale}:${viewerId}:${showLocalizedTitle}`}
                    slug={slug}
                    summary={band}
                    initialData={
                        initialBand?.id === band.id ? initialBand : null
                    }
                    goal={goal}
                    difficulties={difficulties}
                    levels={levels}
                    showRecords={showRecords}
                    viewerId={viewerId}
                    showLocalizedTitle={showLocalizedTitle}
                />
            ))}
        </section>
    );
}
