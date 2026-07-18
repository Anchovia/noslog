import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

import type {
    BingoSortDirection,
    BingoStatusCounts,
    BingoStatusFilter,
} from "./bingoListTypes";
import { BINGO_STATUS_FILTERS } from "./bingoListUtils";

interface BingoListFiltersProps {
    filter: BingoStatusFilter;
    sortDirection: BingoSortDirection;
    counts: BingoStatusCounts;
    onFilterChange: (filter: BingoStatusFilter) => void;
    onSortDirectionChange: () => void;
}

// 빙고 상태 필터와 진행률 정렬 방향을 변경함
export default function BingoListFilters({
    filter,
    sortDirection,
    counts,
    onFilterChange,
    onSortDirectionChange,
}: BingoListFiltersProps) {
    return (
        <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1 overflow-x-auto">
                {BINGO_STATUS_FILTERS.map((item) => {
                    const count =
                        item.value === "all" ? null : counts[item.value];

                    return (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => onFilterChange(item.value)}
                            className={cn(
                                "h-8 shrink-0 rounded-md px-3 text-xs font-semibold transition-colors",
                                filter === item.value
                                    ? "bg-text-primary text-bg"
                                    : "bg-surface text-text-secondary"
                            )}
                        >
                            {item.label}
                            {count !== null ? ` ${count}` : ""}
                        </button>
                    );
                })}
            </div>
            <button
                type="button"
                onClick={onSortDirectionChange}
                className="text-caption hover:text-text-primary flex h-8 shrink-0 items-center gap-1 px-1 transition-colors"
                aria-label={`진행률 ${sortDirection === "desc" ? "낮은 순" : "높은 순"}으로 변경`}
                title={
                    sortDirection === "desc"
                        ? "진행률 높은 순"
                        : "진행률 낮은 순"
                }
            >
                진행순
                {sortDirection === "desc" ? (
                    <ArrowDown className="size-3.5" />
                ) : (
                    <ArrowUp className="size-3.5" />
                )}
            </button>
        </div>
    );
}
