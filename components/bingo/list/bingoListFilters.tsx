import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useTranslations } from "@/components/i18n/localeProvider";
import type { MessageKey } from "@/lib/i18n/messages";

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
    const t = useTranslations();
    const labelKeys: Record<BingoStatusFilter, MessageKey> = {
        all: "bingo.filter.all",
        progress: "bingo.filter.progress",
        rich: "bingo.filter.chance",
        completed: "bingo.filter.completed",
    };
    const nextOrder =
        sortDirection === "desc" ? t("bingo.sort.low") : t("bingo.sort.high");

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
                                "focus-visible:ring-focus/40 h-8 shrink-0 cursor-pointer rounded-md px-3 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none",
                                filter === item.value
                                    ? "bg-text-primary text-bg hover:bg-text-primary/90"
                                    : "bg-surface text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                            )}
                        >
                            {t(labelKeys[item.value])}
                            {count !== null ? ` ${count}` : ""}
                        </button>
                    );
                })}
            </div>
            <button
                type="button"
                onClick={onSortDirectionChange}
                className="text-caption hover:bg-surface-muted hover:text-text-primary focus-visible:ring-focus/40 flex h-8 shrink-0 cursor-pointer items-center gap-1 rounded px-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                aria-label={t("bingo.sort.changeAria", {
                    order: nextOrder,
                })}
                title={
                    sortDirection === "desc"
                        ? t("bingo.sort.high")
                        : t("bingo.sort.low")
                }
            >
                {t("bingo.sort.progress")}
                {sortDirection === "desc" ? (
                    <ArrowDown className="size-3.5" />
                ) : (
                    <ArrowUp className="size-3.5" />
                )}
            </button>
        </div>
    );
}
