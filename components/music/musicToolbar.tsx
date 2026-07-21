"use client";

import { ArrowDown, ArrowUp, Grid2X2, List } from "lucide-react";

import { cn } from "@/lib/utils";

export type SortMode = "name" | "level";
export type SortOrder = "asc" | "desc";
export type ViewMode = "list" | "grid";

interface MusicToolbarProps {
    sortMode: SortMode;
    sortOrder: SortOrder;
    viewMode: ViewMode;
    onSortModeChange: (mode: SortMode) => void;
    onViewModeChange: (mode: ViewMode) => void;
}

export default function MusicToolbar({
    sortMode,
    sortOrder,
    viewMode,
    onSortModeChange,
    onViewModeChange,
}: MusicToolbarProps) {
    const SortArrow = sortOrder === "asc" ? ArrowUp : ArrowDown;

    return (
        <section className="flex items-center justify-between">
            <div className="border-border rounded-card flex h-6 overflow-hidden border">
                <button
                    type="button"
                    onClick={() => onSortModeChange("name")}
                    className={cn(
                        "focus-visible:ring-focus/40 flex cursor-pointer items-center gap-1 px-3 text-xs leading-none transition-colors focus-visible:ring-2 focus-visible:outline-none",
                        sortMode === "name"
                            ? "bg-border text-text-primary hover:bg-border/80"
                            : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                    )}
                >
                    <span>이름순</span>
                    {sortMode === "name" && <SortArrow size={12} />}
                </button>
                <button
                    type="button"
                    onClick={() => onSortModeChange("level")}
                    className={cn(
                        "focus-visible:ring-focus/40 flex cursor-pointer items-center gap-1 px-3 text-xs leading-none transition-colors focus-visible:ring-2 focus-visible:outline-none",
                        sortMode === "level"
                            ? "bg-border text-text-primary hover:bg-border/80"
                            : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                    )}
                >
                    <span>레벨순</span>
                    {sortMode === "level" && <SortArrow size={12} />}
                </button>
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
