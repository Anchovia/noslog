"use client";

import { Grid2X2, List } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type SortMode = "name" | "level";
type ViewMode = "list" | "grid";

export default function MusicToolbar() {
    const [sortMode, setSortMode] = useState<SortMode>("name");
    const [viewMode, setViewMode] = useState<ViewMode>("list");

    return (
        <section className="flex items-center justify-between">
            <div className="border-border rounded-card flex h-6 overflow-hidden border">
                <button
                    type="button"
                    onClick={() => setSortMode("name")}
                    className={cn(
                        "px-3 text-xs leading-none transition-colors",
                        sortMode === "name"
                            ? "bg-border text-text-primary"
                            : "text-text-secondary"
                    )}
                >
                    이름순
                </button>
                <button
                    type="button"
                    onClick={() => setSortMode("level")}
                    className={cn(
                        "px-3 text-xs leading-none transition-colors",
                        sortMode === "level"
                            ? "bg-border text-text-primary"
                            : "text-text-secondary"
                    )}
                >
                    레벨순
                </button>
            </div>

            <div className="border-border rounded-card flex h-6 overflow-hidden border">
                <button
                    type="button"
                    aria-label="리스트 보기"
                    onClick={() => setViewMode("list")}
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
                    aria-label="카드 보기"
                    onClick={() => setViewMode("grid")}
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
