"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
    formatTierValue,
    getTierRecordStatus,
    type PublicTierBandPayload,
    type TierRecordStatus,
} from "@/lib/tiers";
import { cn } from "@/lib/utils";
import TierChartCard from "./tierChartCard";

type TierFilter = "all" | "pianist" | "fc" | "unplayed";

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
    status: TierFilter;
    showRecords: boolean;
    recommendationEnabled: boolean;
    recommendationTarget: number | null;
}

function getRecommendationStrength(value: number, target: number | null) {
    if (target === null) return "outside";
    const distance = Math.round(Math.abs(value - target) * 10) / 10;
    if (distance === 0) return "center";
    if (distance <= 0.1) return "near";
    if (distance <= 0.2) return "edge";
    return "outside";
}

function TierBandSection({
    slug,
    summary,
    initialData,
    status,
    showRecords,
    recommendationEnabled,
    recommendationTarget,
}: {
    slug: string;
    summary: TierBandSummary;
    initialData: PublicTierBandPayload | null;
    status: TierFilter;
    showRecords: boolean;
    recommendationEnabled: boolean;
    recommendationTarget: number | null;
}) {
    const containerRef = useRef<HTMLElement>(null);
    const [band, setBand] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const loadBand = useCallback(async () => {
        if (band || isLoading) return;

        setIsLoading(true);
        setHasError(false);
        try {
            const response = await fetch(
                `/api/tiers/${encodeURIComponent(slug)}/bands/${summary.id}`,
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
    }, [band, isLoading, slug, summary.id]);

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

    const recommendationStrength = getRecommendationStrength(
        summary.value,
        recommendationTarget
    );
    const entries =
        band?.entries.map((entry) => ({
            ...entry,
            recordStatus: getTierRecordStatus(entry.record),
        })) ?? [];
    const visibleEntries = entries.filter(
        (entry) => status === "all" || entry.recordStatus === status
    );
    const countStatus = (recordStatus: TierRecordStatus) =>
        entries.filter((entry) => entry.recordStatus === recordStatus).length;

    return (
        <section
            ref={containerRef}
            className={cn(
                "bg-surface rounded-card min-h-40 overflow-hidden transition-[opacity,box-shadow]",
                recommendationEnabled &&
                    recommendationStrength === "center" &&
                    "ring-real ring-2",
                recommendationEnabled &&
                    recommendationStrength === "near" &&
                    "ring-real/70 ring-1",
                recommendationEnabled &&
                    recommendationStrength === "edge" &&
                    "ring-real/35 ring-1"
            )}
        >
            <header className="bg-surface-muted flex min-h-11 items-center gap-3 px-3">
                <h2 className="text-section font-bold tabular-nums">
                    {formatTierValue(summary.value)}
                </h2>
                {showRecords && band ? (
                    <div className="text-caption ml-auto flex items-center gap-2">
                        <span className="text-rank-s">
                            S {countStatus("s")}
                        </span>
                        <span className="text-rank-fc">
                            FC {countStatus("fc")}
                        </span>
                        <span>미플레이 {countStatus("unplayed")}</span>
                    </div>
                ) : (
                    <span className="text-caption ml-auto">
                        {summary.totalCount}곡
                    </span>
                )}
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
            ) : visibleEntries.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 p-3">
                    {visibleEntries.map((entry) => (
                        <TierChartCard
                            key={entry.id}
                            chart={entry.chart}
                            record={entry.record ?? undefined}
                            showRecord={showRecords}
                        />
                    ))}
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
    status,
    showRecords,
    recommendationEnabled,
    recommendationTarget,
}: TierBandBrowserProps) {
    if (bands.length === 0) {
        return (
            <div className="bg-surface text-text-disabled rounded-card flex h-32 items-center justify-center text-sm">
                등록된 상수 구간이 없습니다.
            </div>
        );
    }

    return (
        <section className="flex flex-col gap-4" aria-label="서열표 구간">
            {bands.map((band) => (
                <TierBandSection
                    key={band.id}
                    slug={slug}
                    summary={band}
                    initialData={
                        initialBand?.id === band.id ? initialBand : null
                    }
                    status={status}
                    showRecords={showRecords}
                    recommendationEnabled={recommendationEnabled}
                    recommendationTarget={recommendationTarget}
                />
            ))}
        </section>
    );
}
