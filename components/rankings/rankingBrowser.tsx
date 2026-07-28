"use client";

import UserRankingTable from "@/components/rankings/userRankingTable";
import type {
    UserRankingMetric,
    UserRankingMode,
    UserRankingPayload,
    UserRankingRegion,
} from "@/lib/rankings";
import { cn } from "@/lib/utils";
import { Globe2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

const PAGE_SIZE = 7;

const rankingModes: { value: UserRankingMode; label: string }[] = [
    { value: "basic", label: "Basic" },
    { value: "recital", label: "Recital" },
];

const rankingMetrics: { value: UserRankingMetric; label: string }[] = [
    { value: "grade", label: "공식 Grd" },
    { value: "rating", label: "NosLog 레이팅" },
];

const rankingRegions: {
    value: UserRankingRegion;
    label: string;
    icon?: "kr" | "jp" | "global";
}[] = [
    { value: "all", label: "전체" },
    { value: "kr", label: "KR", icon: "kr" },
    { value: "jp", label: "JP", icon: "jp" },
    { value: "global", label: "GLO", icon: "global" },
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

function cacheKey(
    mode: UserRankingMode,
    metric: UserRankingMetric,
    region: UserRankingRegion,
    page: number
) {
    return `${mode}:${metric}:${region}:${page}`;
}

export default function RankingBrowser({
    initialMode,
    initialMetric,
    initialRegion,
    initialData,
}: RankingBrowserProps) {
    const [view, setView] = useState({
        mode: initialMode,
        metric: initialMetric,
        region: initialRegion,
        data: initialData,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const requestId = useRef(0);
    const cache = useRef(
        new Map<string, UserRankingPayload>([
            [
                cacheKey(
                    initialMode,
                    initialMetric,
                    initialRegion,
                    initialData.page
                ),
                initialData,
            ],
        ])
    );

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
        const key = cacheKey(mode, metric, region, page);
        const cached = cache.current.get(key);
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
            const params = new URLSearchParams({
                mode,
                metric,
                region,
                page: String(page),
            });
            const response = await fetch(`/api/rankings?${params}`, {
                cache: "no-store",
            });
            if (!response.ok) throw new Error("랭킹을 불러오지 못했습니다.");

            const result = (await response.json()) as UserRankingPayload;
            cache.current.set(
                cacheKey(mode, metric, region, result.page),
                result
            );
            if (currentRequestId !== requestId.current) return;

            setView({ mode, metric, region, data: result });
            updateUrl(mode, metric, region, result.page);
        } catch {
            if (currentRequestId === requestId.current) {
                setError("랭킹을 불러오지 못했습니다. 다시 시도해주세요.");
            }
        } finally {
            if (currentRequestId === requestId.current) setIsLoading(false);
        }
    }

    return (
        <>
            <nav
                className="bg-surface-muted rounded-card grid grid-cols-2 p-1"
                aria-label="랭킹 모드"
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
                aria-label="랭킹 평가 기준"
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
                <p className="text-caption px-1">
                    현재 Basic Pianist 서열 상수 · 상위 70곡 · 10,000점 만점
                </p>
            ) : null}

            <nav
                className="border-border rounded-card grid grid-cols-4 overflow-hidden border"
                aria-label="랭킹 지역"
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
                        {item.label}
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
