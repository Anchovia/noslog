"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";

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
}

function TierBandSection({
    slug,
    summary,
    initialData,
    goal,
    difficulties,
    levels,
    showRecords,
}: {
    slug: string;
    summary: TierBandSummary;
    initialData: PublicTierBandPayload | null;
    goal: TierGoal;
    difficulties: TierDifficulty[];
    levels: string[];
    showRecords: boolean;
}) {
    const containerRef = useRef<HTMLElement>(null);
    const [band, setBand] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);

    const loadBand = useCallback(async () => {
        if (band || isLoading) return;

        setIsLoading(true);
        setHasError(false);
        try {
            const query = new URLSearchParams();
            if (difficulties.length > 0) {
                query.set("difficulty", difficulties.join(","));
            }
            if (levels.length > 0) query.set("level", levels.join(","));
            const response = await fetch(
                `/api/tiers/${encodeURIComponent(slug)}/bands/${summary.id}${query.size > 0 ? `?${query}` : ""}`,
                { cache: "no-store" }
            );
            if (!response.ok) throw new Error("Tier band request failed");
            const data = (await response.json()) as {
                band: PublicTierBandPayload;
            };
            setBand(data.band);
        } catch {
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    }, [band, difficulties, isLoading, levels, slug, summary.id]);

    useEffect(() => {
        if (band || !containerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    void loadBand();
                    observer.disconnect();
                }
            },
            { rootMargin: "240px 0px" }
        );
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [band, loadBand]);

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
                        ? `달성 ${achievedCount}/${band.entries.length}`
                        : `${summary.totalCount}곡`}
                </span>
            </header>

            {!band ? (
                <div className="text-text-disabled flex h-28 items-center justify-center px-4 text-center text-sm">
                    {hasError ? (
                        <button
                            type="button"
                            onClick={() => void loadBand()}
                            className="border-border bg-surface-muted text-text-secondary cursor-pointer rounded-md border px-3 py-2 font-semibold"
                        >
                            다시 불러오기
                        </button>
                    ) : (
                        "서열 데이터를 불러오는 중입니다."
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
                    이 조건에 해당하는 채보가 없습니다.
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
}: TierBandBrowserProps) {
    if (bands.length === 0) {
        return (
            <div className="bg-surface text-text-disabled rounded-card flex h-32 items-center justify-center px-4 text-center text-sm">
                선택한 조건에 해당하는 채보가 없습니다.
            </div>
        );
    }

    return (
        <section className="flex flex-col gap-4" aria-label="서열표 구간">
            {bands.map((band) => (
                <TierBandSection
                    key={`${band.id}:${difficulties.join(",")}:${levels.join(",")}`}
                    slug={slug}
                    summary={band}
                    initialData={
                        initialBand?.id === band.id ? initialBand : null
                    }
                    goal={goal}
                    difficulties={difficulties}
                    levels={levels}
                    showRecords={showRecords}
                />
            ))}
        </section>
    );
}
