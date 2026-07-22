"use client";

import { cn } from "@/lib/utils";
import { formatTierDate, tierModeStyles } from "@/lib/tiers";
import Link from "next/link";
import { useMemo, useState } from "react";

type TierMode = "all" | "basic" | "recital";
type TierSort = "default" | "recent";

interface TierListSummary {
    id: number;
    slug: string;
    title: string;
    mode: string;
    updatedAt: string;
    totalCount: number;
}

interface TierListProgress {
    tierListId: number;
    pianistCount: number;
    fcCount: number;
    sCount: number;
    clearedCount: number;
}

interface TierListBrowserProps {
    initialMode: TierMode;
    initialSort: TierSort;
    tierLists: TierListSummary[];
    progress: TierListProgress[];
    isAuthenticated: boolean;
}

const modes: { value: TierMode; label: string }[] = [
    { value: "all", label: "전체" },
    { value: "basic", label: "Basic" },
    { value: "recital", label: "Recital" },
];

const defaultTierOrder = new Map([
    ["basic-real", 0],
    ["recital-real", 1],
    ["basic-expert", 2],
    ["recital-expert", 3],
]);

export default function TierListBrowser({
    initialMode,
    initialSort,
    tierLists,
    progress,
    isAuthenticated,
}: TierListBrowserProps) {
    const [mode, setMode] = useState(initialMode);
    const [sort, setSort] = useState(initialSort);
    const progressByTierListId = useMemo(
        () => new Map(progress.map((item) => [item.tierListId, item])),
        [progress]
    );
    const visibleTierLists = useMemo(() => {
        const filtered =
            mode === "all"
                ? tierLists
                : tierLists.filter((tierList) => tierList.mode === mode);

        return [...filtered].sort((a, b) => {
            if (sort === "recent") {
                return (
                    new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime() || b.id - a.id
                );
            }

            return (
                (defaultTierOrder.get(a.slug) ?? Number.MAX_SAFE_INTEGER) -
                    (defaultTierOrder.get(b.slug) ?? Number.MAX_SAFE_INTEGER) ||
                a.title.localeCompare(b.title, "ko")
            );
        });
    }, [mode, sort, tierLists]);

    function updateUrl(nextMode: TierMode, nextSort: TierSort) {
        const url = new URL(window.location.href);

        if (nextMode === "all") url.searchParams.delete("mode");
        else url.searchParams.set("mode", nextMode);

        if (nextSort === "default") url.searchParams.delete("sort");
        else url.searchParams.set("sort", nextSort);

        window.history.replaceState(null, "", url);
    }

    function selectMode(nextMode: TierMode) {
        setMode(nextMode);
        updateUrl(nextMode, sort);
    }

    function selectSort(nextSort: TierSort) {
        setSort(nextSort);
        updateUrl(mode, nextSort);
    }

    return (
        <>
            <div className="flex items-center justify-between gap-3">
                <nav className="flex gap-2" aria-label="서열표 모드">
                    {modes.map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => selectMode(item.value)}
                            aria-pressed={item.value === mode}
                            className={cn(
                                "focus-visible:ring-focus/40 flex h-9 cursor-pointer items-center justify-center rounded-md px-3 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none",
                                item.value === mode
                                    ? "bg-text-primary text-bg hover:bg-text-primary/90"
                                    : "bg-surface text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                            )}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                <nav
                    className="border-border rounded-card flex h-7 shrink-0 overflow-hidden border"
                    aria-label="서열표 정렬"
                >
                    {(
                        [
                            { value: "default", label: "기본순" },
                            { value: "recent", label: "최신순" },
                        ] as const
                    ).map((item) => (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => selectSort(item.value)}
                            aria-pressed={item.value === sort}
                            className={cn(
                                "focus-visible:ring-focus/40 flex cursor-pointer items-center px-2.5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none",
                                item.value === sort
                                    ? "bg-border text-text-primary hover:bg-border/80"
                                    : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                            )}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            <section className="flex flex-col gap-3" aria-label="서열표 목록">
                {visibleTierLists.length > 0 ? (
                    visibleTierLists.map((tierList) => {
                        const tierProgress = progressByTierListId.get(
                            tierList.id
                        );
                        const pianistCount = tierProgress?.pianistCount ?? 0;
                        const fcCount = tierProgress?.fcCount ?? 0;
                        const sCount = tierProgress?.sCount ?? 0;
                        const clearedCount = tierProgress?.clearedCount ?? 0;
                        const totalCount = tierList.totalCount;

                        return (
                            <Link
                                key={tierList.id}
                                href={`/tiers/${tierList.slug}`}
                                className="bg-surface rounded-card hover:bg-surface-muted flex flex-col gap-3 p-4 transition-colors"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <span
                                            className={cn(
                                                "shrink-0 rounded px-2 py-1 text-xs font-bold capitalize",
                                                tierModeStyles[tierList.mode] ??
                                                    "bg-border text-text-secondary"
                                            )}
                                        >
                                            {tierList.mode}
                                        </span>
                                        <h2 className="text-section truncate">
                                            {tierList.title}
                                        </h2>
                                    </div>
                                    <span
                                        className="text-text-disabled text-lg"
                                        aria-hidden
                                    >
                                        ›
                                    </span>
                                </div>

                                <div className="text-text-secondary flex items-center gap-3 text-xs">
                                    <span>{totalCount}곡</span>
                                    <span>
                                        업데이트{" "}
                                        {formatTierDate(tierList.updatedAt)}
                                    </span>
                                </div>

                                {isAuthenticated && totalCount > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="text-text-secondary flex items-center gap-3 text-xs">
                                            <span className="text-score">
                                                P {pianistCount}
                                            </span>
                                            <span className="text-rank-fc">
                                                FC {fcCount}
                                            </span>
                                            <span className="text-rank-s">
                                                S {sCount}
                                            </span>
                                            <span className="ml-auto tabular-nums">
                                                {clearedCount}/{totalCount}
                                            </span>
                                        </div>
                                        <div className="bg-divider flex h-1 overflow-hidden rounded-full">
                                            <span
                                                className="bg-score"
                                                style={{
                                                    width: `${(pianistCount / totalCount) * 100}%`,
                                                }}
                                            />
                                            <span
                                                className="bg-rank-fc"
                                                style={{
                                                    width: `${(fcCount / totalCount) * 100}%`,
                                                }}
                                            />
                                            <span
                                                className="bg-rank-s"
                                                style={{
                                                    width: `${(sCount / totalCount) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : null}
                            </Link>
                        );
                    })
                ) : (
                    <div className="bg-surface text-text-disabled rounded-card flex h-32 items-center justify-center text-sm">
                        공개된 서열표가 없습니다.
                    </div>
                )}
            </section>
        </>
    );
}
