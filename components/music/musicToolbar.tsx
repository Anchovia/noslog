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
                        "flex items-center gap-1 px-3 text-xs leading-none transition-colors",
                        sortMode === "name"
                            ? "bg-border text-text-primary"
                            : "text-text-secondary"
                    )}
                >
                    <span>이름순</span>
                    {sortMode === "name" && <SortArrow size={12} />}
                </button>
                <button
                    type="button"
                    onClick={() => onSortModeChange("level")}
                    className={cn(
                        "flex items-center gap-1 px-3 text-xs leading-none transition-colors",
                        sortMode === "level"
                            ? "bg-border text-text-primary"
                            : "text-text-secondary"
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
                        "flex w-7 items-center justify-center transition-colors",
                        viewMode === "list"
                            ? "bg-border text-text-primary"
                            : "text-text-secondary"
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
                        "flex w-7 items-center justify-center transition-colors",
                        viewMode === "grid"
                            ? "bg-border text-text-primary"
                            : "text-text-secondary"
                    )}
                >
                    <Grid2X2 size={14} />
                </button>
            </div>
        </section>
    );
}
