"use client";

import { ArrowDown, ArrowUp, Grid2X2, List } from "lucide-react";

import {
    useTranslations,
    type MessageKey,
} from "@/components/i18n/localeProvider";
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

const sortOptions: {
    value: SortMode;
    labelKey: MessageKey;
    personal?: boolean;
}[] = [
    { value: "name", labelKey: "music.sort.name" },
    { value: "level", labelKey: "music.sort.level" },
    { value: "recent", labelKey: "music.sort.recent", personal: true },
    { value: "weakness", labelKey: "music.sort.weakness", personal: true },
];

export default function MusicToolbar({
    sortMode,
    sortOrder,
    viewMode,
    isLoggedIn,
    onSortModeChange,
    onViewModeChange,
}: MusicToolbarProps) {
    const t = useTranslations();
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
                            <span>{t(option.labelKey)}</span>
                            {sortMode === option.value && (
                                <SortArrow size={12} />
                            )}
                        </button>
                    ))}
            </div>

            <div className="border-border rounded-card flex h-6 overflow-hidden border">
                <button
                    type="button"
                    aria-label={t("music.listView")}
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
                    aria-label={t("music.gridView")}
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
