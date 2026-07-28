"use client";

import { useMemo, useState } from "react";

import { useTranslations } from "@/components/i18n/localeProvider";
import BingoListCard from "./list/bingoListCard";
import BingoListFilters from "./list/bingoListFilters";
import type {
    BingoListItem,
    BingoSortDirection,
    BingoStatusFilter,
} from "./list/bingoListTypes";
import {
    getBingoStatusCounts,
    getContinueBingo,
    getVisibleBingos,
} from "./list/bingoListUtils";
import ContinueBingoCard from "./list/continueBingoCard";

export type { BingoListItem } from "./list/bingoListTypes";

// 빙고 목록의 상태 필터와 진행순 정렬을 관리함
export default function BingoList({ bingos }: { bingos: BingoListItem[] }) {
    const t = useTranslations();
    const [filter, setFilter] = useState<BingoStatusFilter>("all");
    const [sortDirection, setSortDirection] =
        useState<BingoSortDirection>("desc");
    const counts = useMemo(() => getBingoStatusCounts(bingos), [bingos]);
    const continueBingo = useMemo(() => getContinueBingo(bingos), [bingos]);
    const visibleBingos = useMemo(
        () => getVisibleBingos(bingos, filter, sortDirection),
        [bingos, filter, sortDirection]
    );

    return (
        <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex items-end justify-between">
                <h1 className="text-title">{t("bingo.title")}</h1>
                <p className="text-caption">
                    {t("bingo.completedCount", { count: counts.completed })}
                </p>
            </div>

            {continueBingo ? <ContinueBingoCard bingo={continueBingo} /> : null}

            <BingoListFilters
                filter={filter}
                sortDirection={sortDirection}
                counts={counts}
                onFilterChange={setFilter}
                onSortDirectionChange={() =>
                    setSortDirection((current) =>
                        current === "desc" ? "asc" : "desc"
                    )
                }
            />

            {visibleBingos.length > 0 ? (
                <section className="grid grid-cols-2 gap-2">
                    {visibleBingos.map((bingo) => (
                        <BingoListCard key={bingo.id} bingo={bingo} />
                    ))}
                </section>
            ) : (
                <div className="bg-surface rounded-card text-caption flex min-h-32 items-center justify-center text-center">
                    {t("bingo.empty")}
                </div>
            )}
        </div>
    );
}
