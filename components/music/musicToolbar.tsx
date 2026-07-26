"use client";

import { ArrowDown, ArrowUp, Grid2X2, List } from "lucide-react";

import type { MusicSort } from "@/app/(nevigation)/music/query";
import { cn } from "@/lib/utils";

export type SortMode = MusicSort;
export type SortOrder = "asc" | "desc";
export type ViewMode = "list" | "grid";

interface MusicToolbarProps {
    sortMode: SortMode;
    sortOrder: SortOrder;
    viewMode: ViewMode;
    isLoggedIn: boolean;
    onSortModeChange: (mode: SortMode) => void;
    onViewModeChange: (mode: ViewMode) => void;
}

const sortOptions: { value: SortMode; label: string; personal?: boolean }[] = [
    { value: "name", label: "이름" },
    { value: "level", label: "레벨" },
    { value: "recent", label: "최근", personal: true },
    { value: "weakness", label: "취약", personal: true },
];

export default function MusicToolbar({
    sortMode,
    sortOrder,
    viewMode,
    isLoggedIn,
    onSortModeChange,
    onViewModeChange,
}: MusicToolbarProps) {
    const SortArrow = sortOrder === "asc" ? ArrowUp : ArrowDown;

    return (
        <section className="flex items-center justify-between">
            <div className="border-border rounded-card flex h-6 overflow-hidden border">
                {sortOptions
                    .filter((option) => isLoggedIn || !option.personal)
                    .map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onSortModeChange(option.value)}
                            className={cn(
                                "focus-visible:ring-focus/40 flex cursor-pointer items-center gap-1 px-2.5 text-xs leading-none transition-colors focus-visible:ring-2 focus-visible:outline-none",
                                sortMode === option.value
                                    ? "bg-border text-text-primary hover:bg-border/80"
                                    : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                            )}
                        >
                            <span>{option.label}</span>
                            {sortMode === option.value && (
                                <SortArrow size={12} />
                            )}
                        </button>
                    ))}
            </div>

            <div className="border-border rounded-card flex h-6 overflow-hidden border">
                <button
                    type="button"
                    aria-label="리스트 보기"
                    aria-pressed={viewMode === "list"}
                    onClick={() => onViewModeChange("list")}
                    className={cn(
                        "focus-visible:ring-focus/40 flex w-7 cursor-pointer items-center justify-center transition-colors focus-visible:ring-2 focus-visible:outline-none",
                        viewMode === "list"
                            ? "bg-border text-text-primary hover:bg-border/80"
                            : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                    )}
                >
                    <List size={14} />
                </button>
                <button
                    type="button"
                    aria-label="그리드 보기"
                    aria-pressed={viewMode === "grid"}
                    onClick={() => onViewModeChange("grid")}
                    className={cn(
                        "focus-visible:ring-focus/40 flex w-7 cursor-pointer items-center justify-center transition-colors focus-visible:ring-2 focus-visible:outline-none",
                        viewMode === "grid"
                            ? "bg-border text-text-primary hover:bg-border/80"
                            : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                    )}
                >
                    <Grid2X2 size={14} />
                </button>
            </div>
        </section>
    );
}
