"use client";

import { useTranslations } from "@/components/i18n/localeProvider";
import UserRankingTable from "@/components/rankings/userRankingTable";
import {
    userRankingsQueryKey,
    userRankingsQueryOptions,
} from "@/features/rankings/api/userRankings";
import type {
    UserRankingMetric,
    UserRankingMode,
    UserRankingPayload,
    UserRankingRegion,
} from "@/lib/rankings";
import { cn } from "@/lib/utils";
import { Globe2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 7;

const rankingModes: { value: UserRankingMode; label: string }[] = [
    { value: "basic", label: "Basic" },
    { value: "recital", label: "Recital" },
];

const rankingRegions: {
    value: UserRankingRegion;
    icon?: "kr" | "jp" | "global";
}[] = [
    { value: "all" },
    { value: "kr", icon: "kr" },
    { value: "jp", icon: "jp" },
    { value: "global", icon: "global" },
];

interface RankingBrowserProps {
    initialMode: UserRankingMode;
    initialMetric: UserRankingMetric;
    initialRegion: UserRankingRegion;
    initialData: UserRankingPayload;
}

function RegionIcon({ icon }: { icon?: "kr" | "jp" | "global" }) {
    if (icon === "kr") {
        return (
            <Image
                src="/flag/ko-KR.svg"
                alt=""
                width={16}
                height={12}
                className="h-3 w-4 shrink-0 rounded-[2px]"
            />
        );
    }
    if (icon === "jp") {
        return (
            <span className="relative h-3 w-4 rounded-[2px] bg-white">
                <span className="bg-danger absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
            </span>
        );
    }
    if (icon === "global") return <Globe2 size={13} aria-hidden />;
    return null;
}

export default function RankingBrowser({
    initialMode,
    initialMetric,
    initialRegion,
    initialData,
}: RankingBrowserProps) {
    const t = useTranslations();
    const queryClient = useQueryClient();
    const rankingMetrics: { value: UserRankingMetric; label: string }[] = [
        { value: "grade", label: t("rankings.metric.grade") },
        { value: "rating", label: t("rankings.metric.rating") },
    ];
    const [view, setView] = useState({
        mode: initialMode,
        metric: initialMetric,
        region: initialRegion,
        data: initialData,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const requestId = useRef(0);

    useEffect(() => {
        queryClient.setQueryData(
            userRankingsQueryKey({
                mode: initialMode,
                metric: initialMetric,
                region: initialRegion,
                page: initialData.page,
            }),
            initialData
        );
    }, [initialData, initialMetric, initialMode, initialRegion, queryClient]);

    function updateUrl(
        mode: UserRankingMode,
        metric: UserRankingMetric,
        region: UserRankingRegion,
        page: number
    ) {
        const url = new URL(window.location.href);
        url.searchParams.set("mode", mode);
        if (metric === "rating") {
            url.searchParams.set("metric", metric);
        } else {
            url.searchParams.delete("metric");
        }
        url.searchParams.set("region", region);
        url.searchParams.set("page", String(page));
        window.history.replaceState(null, "", url);
    }

    async function load(
        mode: UserRankingMode,
        metric: UserRankingMetric,
        region: UserRankingRegion,
        page: number
    ) {
        const query = { mode, metric, region, page };
        const queryKey = userRankingsQueryKey(query);
        const cached = queryClient.getQueryData<UserRankingPayload>(queryKey);
        const currentRequestId = ++requestId.current;

        setError(null);
        if (cached) {
            setView({ mode, metric, region, data: cached });
            updateUrl(mode, metric, region, cached.page);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const result = await queryClient.fetchQuery(
                userRankingsQueryOptions(query)
            );
            queryClient.setQueryData(
                userRankingsQueryKey({ ...query, page: result.page }),
                result
            );
            if (currentRequestId !== requestId.current) return;

            setView({ mode, metric, region, data: result });
            updateUrl(mode, metric, region, result.page);
        } catch {
            if (currentRequestId === requestId.current) {
                setError(t("rankings.loadError"));
            }
        } finally {
            if (currentRequestId === requestId.current) setIsLoading(false);
        }
    }

    return (
        <>
            <nav
                className="bg-surface-muted rounded-card grid grid-cols-2 p-1"
                aria-label={t("rankings.modeNav")}
            >
                {rankingModes.map((item) => (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() =>
                            load(
                                item.value,
                                item.value === "recital"
                                    ? "grade"
                                    : view.metric,
                                view.region,
                                1
                            )
                        }
                        aria-pressed={item.value === view.mode}
                        className={cn(
                            "focus-visible:ring-focus/40 flex h-10 cursor-pointer items-center justify-center rounded-md text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none",
                            item.value === view.mode
                                ? "bg-border text-text-primary hover:bg-border/80"
                                : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                        )}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>

            <nav
                className="border-border rounded-card grid grid-cols-2 overflow-hidden border"
                aria-label={t("rankings.metricNav")}
            >
                {rankingMetrics.map((item) => (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() =>
                            load(
                                item.value === "rating" ? "basic" : view.mode,
                                item.value,
                                view.region,
                                1
                            )
                        }
                        aria-pressed={item.value === view.metric}
                        className={cn(
                            "border-divider focus-visible:ring-focus/40 flex h-9 cursor-pointer items-center justify-center border-l text-xs font-semibold transition-colors first:border-l-0 focus-visible:ring-2 focus-visible:outline-none",
                            item.value === view.metric
                                ? "bg-surface-muted text-text-primary hover:bg-border"
                                : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                        )}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>

            {view.metric === "rating" ? (
                <p className="text-caption px-1">{t("rankings.ratingBasis")}</p>
            ) : null}

            <nav
                className="border-border rounded-card grid grid-cols-4 overflow-hidden border"
                aria-label={t("rankings.regionNav")}
            >
                {rankingRegions.map((item) => (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() =>
                            load(view.mode, view.metric, item.value, 1)
                        }
                        aria-pressed={item.value === view.region}
                        className={cn(
                            "border-divider focus-visible:ring-focus/40 flex h-9 cursor-pointer items-center justify-center gap-1.5 border-l text-xs font-semibold transition-colors first:border-l-0 focus-visible:ring-2 focus-visible:outline-none",
                            item.value === view.region
                                ? "bg-surface-muted text-text-primary hover:bg-border"
                                : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                        )}
                    >
                        <RegionIcon icon={item.icon} />
                        {item.value === "all"
                            ? t("rankings.region.all")
                            : item.value === "global"
                              ? "GLO"
                              : item.value.toUpperCase()}
                    </button>
                ))}
            </nav>

            {error ? (
                <p className="text-danger text-center text-sm" role="alert">
                    {error}
                </p>
            ) : null}

            <div
                className={cn(
                    "transition-opacity",
                    isLoading && "pointer-events-none opacity-50"
                )}
                aria-busy={isLoading}
            >
                <UserRankingTable
                    mode={view.mode}
                    metric={view.metric}
                    page={view.data.page}
                    pageSize={PAGE_SIZE}
                    totalCount={view.data.totalCount}
                    rows={view.data.rows}
                    currentUser={view.data.currentUser}
                    onPageChange={(page) =>
                        load(view.mode, view.metric, view.region, page)
                    }
                />
            </div>
        </>
    );
}
