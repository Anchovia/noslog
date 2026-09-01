import { queryOptions } from "@tanstack/react-query";

import type {
    DetailTab,
    Difficulty,
    MusicDetailProps,
} from "@/components/music/musicDetailTypes";
import { readApiResponse } from "@/lib/api/response";
import type { Locale } from "@/lib/i18n/routing";

export type MusicDetailQuery = {
    index: string;
    difficulty: Difficulty;
    tab: DetailTab;
    page: number;
    locale: Locale;
};

function normalizeMusicDetailPage(tab: DetailTab, page: number) {
    return tab === "ranking" ? Math.max(1, page) : 1;
}

export function musicDetailQueryRootKey(index: string) {
    return ["music-detail", index] as const;
}

export function musicDetailQueryKey(query: MusicDetailQuery) {
    return [
        ...musicDetailQueryRootKey(query.index),
        query.difficulty,
        query.tab,
        normalizeMusicDetailPage(query.tab, query.page),
        query.locale,
    ] as const;
}

export async function fetchMusicDetail(
    query: MusicDetailQuery,
    signal?: AbortSignal
) {
    const params = new URLSearchParams({
        index: query.index,
        difficulty: query.difficulty.toLowerCase(),
        tab: query.tab,
        page: String(normalizeMusicDetailPage(query.tab, query.page)),
        locale: query.locale,
    });
    const response = await fetch(`/api/music-detail?${params}`, {
        cache: "no-store",
        credentials: "same-origin",
        signal,
    });

    return readApiResponse<MusicDetailProps>(response);
}

export function musicDetailQueryOptions(query: MusicDetailQuery) {
    return queryOptions({
        queryKey: musicDetailQueryKey(query),
        queryFn: ({ signal }) => fetchMusicDetail(query, signal),
    });
}
