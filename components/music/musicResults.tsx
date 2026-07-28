"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { MusicSearchParams } from "@/app/(nevigation)/music/query";
import MusicList, { type MusicItem } from "./musicList";
import MusicToolbar, {
    type SortMode,
    type SortOrder,
    type ViewMode,
} from "./musicToolbar";

interface MusicResultsProps {
    initialPage: {
        items: MusicItem[];
        nextCursor: string | null;
    };
    searchParams: MusicSearchParams;
    isLoggedIn: boolean;
}

// 악곡 결과의 정렬과 보기 상태를 한곳에서 관리함
export default function MusicResults({
    initialPage,
    searchParams,
    isLoggedIn,
}: MusicResultsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const currentSearchParams = useSearchParams();
    const requestedSortMode: SortMode =
        searchParams.sort === "level" ||
        searchParams.sort === "recent" ||
        searchParams.sort === "weakness"
            ? searchParams.sort
            : "name";
    const initialSortMode: SortMode =
        isLoggedIn ||
        (requestedSortMode !== "recent" && requestedSortMode !== "weakness")
            ? requestedSortMode
            : "name";
    const initialSortOrder: SortOrder =
        searchParams.order === "asc" || searchParams.order === "desc"
            ? searchParams.order
            : initialSortMode === "name"
              ? "asc"
              : "desc";
    const [sortMode, setSortMode] = useState<SortMode>(initialSortMode);
    const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);
    const [viewMode, setViewMode] = useState<ViewMode>(
        searchParams.view === "grid" ? "grid" : "list"
    );

    const handleSortModeChange = (nextSortMode: SortMode) => {
        const nextSortOrder: SortOrder =
            nextSortMode === sortMode
                ? sortOrder === "asc"
                    ? "desc"
                    : "asc"
                : nextSortMode === "name"
                  ? "asc"
                  : "desc";
        const params = new URLSearchParams(currentSearchParams.toString());

        params.set("sort", nextSortMode);
        params.set("order", nextSortOrder);
        params.set("view", viewMode);

        setSortMode(nextSortMode);
        setSortOrder(nextSortOrder);
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleViewModeChange = (nextViewMode: ViewMode) => {
        const params = new URLSearchParams(currentSearchParams.toString());

        params.set("view", nextViewMode);
        setViewMode(nextViewMode);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <>
            <MusicToolbar
                sortMode={sortMode}
                sortOrder={sortOrder}
                viewMode={viewMode}
                isLoggedIn={isLoggedIn}
                onSortModeChange={handleSortModeChange}
                onViewModeChange={handleViewModeChange}
            />
            <MusicList
                initialPage={initialPage}
                searchParams={searchParams}
                viewMode={viewMode}
            />
        </>
    );
}
