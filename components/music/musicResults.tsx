"use client";

import { useState } from "react";

import type { MusicSearchParams } from "@/app/(nevigation)/music/query";
import MusicList, { type MusicItem } from "./musicList";
import MusicToolbar, { type SortMode, type ViewMode } from "./musicToolbar";

interface MusicResultsProps {
    initialMusics: MusicItem[];
    searchParams: MusicSearchParams;
}

// 악곡 결과의 정렬과 보기 상태를 한곳에서 관리함
export default function MusicResults({
    initialMusics,
    searchParams,
}: MusicResultsProps) {
    const [sortMode, setSortMode] = useState<SortMode>("name");
    const [viewMode, setViewMode] = useState<ViewMode>("list");

    return (
        <>
            <MusicToolbar
                sortMode={sortMode}
                viewMode={viewMode}
                onSortModeChange={setSortMode}
                onViewModeChange={setViewMode}
            />
            <MusicList
                initialMusics={initialMusics}
                searchParams={searchParams}
                viewMode={viewMode}
            />
        </>
    );
}
