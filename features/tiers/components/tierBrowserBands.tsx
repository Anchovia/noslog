"use client";

import {
    startTransition,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import ActionButton from "@/components/ui/actionButton";
import ResultState from "@/components/ui/resultState";
import { tierBrowserBandOptions } from "@/features/tiers/api/tierBrowser";
import type {
    TierBrowserBand,
    TierBrowserBandSummary,
    TierBrowserEntry,
    TierBrowserOverview,
    TierBrowserQuery,
    TierBrowserSort,
} from "@/features/tiers/schemas/tierBrowserSchema";
import { formatTierValue } from "@/lib/tiers";
import TierBrowserCard, {
    TierBrowserCardSkeleton,
    TierBrowserRow,
    TierBrowserRowSkeleton,
} from "./tierBrowserCard";
import { tierValueColor } from "@/lib/music/tierValueColor";

export const TIER_BROWSER_BATCH_SIZE = 20;
const TIER_BROWSER_AUTO_BATCHES = 3;
const TIER_BROWSER_IDLE_SKELETONS = 6;

export function tierBrowserSkeletonCount(total: number, visible: boolean) {
    return Math.min(
        total,
        visible ? TIER_BROWSER_BATCH_SIZE : TIER_BROWSER_IDLE_SKELETONS
    );
}

/**
 * 구간 안 곡 순서(2026-09-22 ②). 구간은 곡 전체를 한 번에 받으므로 20개씩 자르기 전에 정렬한다.
 * 레벨 순 = 높은 레벨 먼저 · 읽기 순 = 일본어 읽기 가나다 · 점수 낮은 순 = 기록 없는 곡 먼저, 그다음 낮은 점수.
 * 같은 값끼리는 서열표 순
 */
export function sortTierBrowserEntries(
    entries: readonly TierBrowserEntry[],
    sort: TierBrowserSort
) {
    const byPosition = (a: TierBrowserEntry, b: TierBrowserEntry) =>
        a.position - b.position;
    const compare: Record<
        TierBrowserSort,
        (a: TierBrowserEntry, b: TierBrowserEntry) => number
    > = {
        position: () => 0,
        level: (a, b) => b.chart.level - a.chart.level,
        name: (a, b) =>
            (a.chart.music.reading ?? a.chart.music.title).localeCompare(
                b.chart.music.reading ?? b.chart.music.title,
                "ja"
            ),
        score: (a, b) => (a.record?.score ?? -1) - (b.record?.score ?? -1),
    };
    return [...entries].sort((a, b) => compare[sort](a, b) || byPosition(a, b));
}

export function nextTierBrowserVisibleCount(current: number, total: number) {
    return Math.min(total, current + TIER_BROWSER_BATCH_SIZE);
}

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
    const progress = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [visibleCount, setVisibleCount] = useState(TIER_BROWSER_BATCH_SIZE);
    const [announcement, setAnnouncement] = useState("");
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
    const list = query.view === "list";
    const signedIn = overview.viewerId !== null;
    // 점수 순은 로그인했을 때만 — 주소에 남아 있어도 로그아웃이면 서열표 순
    const sort = query.sort === "score" && !signedIn ? "position" : query.sort;
    const entries = useMemo(
        () => sortTierBrowserEntries(band.data?.entries ?? [], sort),
        [band.data, sort]
    );
    const total = entries.length;
    const shown = entries.slice(0, visibleCount);
    const nextAmount = Math.min(TIER_BROWSER_BATCH_SIZE, total - shown.length);
    const autoLimit = TIER_BROWSER_BATCH_SIZE * (TIER_BROWSER_AUTO_BATCHES + 1);
    const autoLoad = shown.length < Math.min(total, autoLimit);
    const appendNext = useCallback(() => {
        const next = nextTierBrowserVisibleCount(visibleCount, total);
        if (next === visibleCount) return;
        startTransition(() => {
            setVisibleCount(next);
            setAnnouncement(
                t("discovery.added", { count: next - visibleCount })
            );
        });
    }, [t, total, visibleCount]);
    useEffect(() => {
        const target = progress.current;
        if (!autoLoad || !target) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                appendNext();
            },
            { rootMargin: "240px 0px" }
        );
        observer.observe(target);
        return () => observer.disconnect();
    }, [appendNext, autoLoad]);
    return (
        <section
            ref={ref}
            className="nl-tier-band"
            aria-label={formatTierValue(summary.value)}
            aria-busy={pending || (visible && band.isPending)}
        >
            <header className="nl-tier-band__header">
                {/* 서열 값 = 악곡 상세 머리와 같은 구간 색 그라데이션 (2026-09-17 G1) */}
                <h2
                    className="nl-section-title"
                    style={{ color: tierValueColor(summary.value) }}
                >
                    {formatTierValue(summary.value)}
                </h2>
                {signedIn ? (
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
            <div className={list ? "nl-tier-list" : "nl-tier-grid"}>
                {band.data
                    ? shown.map((entry) =>
                          list ? (
                              <TierBrowserRow
                                  key={entry.id}
                                  entry={entry}
                                  query={query}
                                  signedIn={signedIn}
                                  pending={pending}
                              />
                          ) : (
                              <TierBrowserCard
                                  key={entry.id}
                                  entry={entry}
                                  query={query}
                                  signedIn={signedIn}
                                  pending={pending}
                              />
                          )
                      )
                    : !band.isError
                      ? Array.from(
                            {
                                length: tierBrowserSkeletonCount(
                                    summary.totalCount,
                                    visible
                                ),
                            },
                            (_, index) =>
                                list ? (
                                    <TierBrowserRowSkeleton
                                        key={index}
                                        signedIn={signedIn}
                                    />
                                ) : (
                                    <TierBrowserCardSkeleton
                                        key={index}
                                        signedIn={signedIn}
                                    />
                                )
                        )
                      : null}
            </div>
            {band.data && shown.length < total ? (
                <div className="nl-discovery__progress" ref={progress}>
                    <ActionButton variant="secondary" onClick={appendNext}>
                        {t("discovery.loadMore", { count: nextAmount })}
                    </ActionButton>
                    <p className="nl-metadata nl-muted">
                        {t("discovery.progress", {
                            count: shown.length,
                            total,
                        })}
                    </p>
                </div>
            ) : null}
            {announcement ? (
                <p className="sr-only" role="status">
                    {announcement}
                </p>
            ) : null}
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
                    key={`${overview.list!.id}:${query.mode}:${query.goal}:${query.difficulties.join(",")}:${query.levels.join(",")}:${summary.id}`}
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
