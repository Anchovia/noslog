"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MusicDetail from "./musicDetail";
import type {
    DetailTab,
    Difficulty,
    MusicDetailProps,
} from "./musicDetailTypes";
import { useLocale } from "@/components/i18n/localeProvider";
import { getLocalizedHref, type Locale } from "@/lib/i18n/routing";

function cacheKey(
    index: string,
    difficulty: Difficulty,
    tab: DetailTab,
    page: number
) {
    return `${index}:${difficulty}:${tab}:${tab === "ranking" ? page : 1}`;
}

function detailUrl(
    index: string,
    difficulty: Difficulty,
    tab: DetailTab,
    page: number,
    locale: Locale
) {
    const query = new URLSearchParams();
    if (tab !== "record") query.set("tab", tab);
    if (tab === "ranking" && page > 1) query.set("page", String(page));
    const suffix = query.size ? `?${query}` : "";
    return getLocalizedHref(
        `/music/${index}/${difficulty.toLowerCase()}${suffix}`,
        locale
    );
}

interface MusicDetailBrowserProps {
    initialData: MusicDetailProps;
}

export default function MusicDetailBrowser({
    initialData,
}: MusicDetailBrowserProps) {
    const locale = useLocale();
    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const requestId = useRef(0);
    const detailCache = useRef(
        new Map<string, MusicDetailProps>([
            [
                cacheKey(
                    initialData.music.index,
                    initialData.difficulty,
                    initialData.activeTab,
                    initialData.ranking.page
                ),
                initialData,
            ],
        ])
    );

    const load = useCallback(
        async (
            difficulty: Difficulty,
            tab: DetailTab,
            page = 1,
            options?: { replaceUrl?: boolean; force?: boolean }
        ) => {
            const index = initialData.music.index;
            const key = cacheKey(index, difficulty, tab, page);
            const url = detailUrl(index, difficulty, tab, page, locale);

            if (options?.replaceUrl !== false) {
                window.history.pushState(null, "", url);
            }

            const cached = options?.force
                ? undefined
                : detailCache.current.get(key);
            if (cached) {
                setData(cached);
                return;
            }

            const currentRequest = ++requestId.current;
            setIsLoading(true);

            try {
                const query = new URLSearchParams({
                    index,
                    difficulty: difficulty.toLowerCase(),
                    tab,
                    page: String(page),
                    locale,
                });
                const response = await fetch(`/api/music-detail?${query}`, {
                    credentials: "same-origin",
                });

                if (!response.ok) {
                    throw new Error("악곡 상세 정보를 불러오지 못했습니다.");
                }

                const nextData = (await response.json()) as MusicDetailProps;
                detailCache.current.set(key, nextData);
                if (currentRequest === requestId.current) setData(nextData);
            } finally {
                if (currentRequest === requestId.current) setIsLoading(false);
            }
        },
        [initialData.music.index, locale]
    );

    useEffect(() => {
        const onPopState = () => {
            const parts = window.location.pathname.split("/");
            const difficulty = parts.at(-1);
            const selectedDifficulty = [
                "normal",
                "hard",
                "expert",
                "real",
            ].find((item) => item === difficulty);
            if (!selectedDifficulty) return;

            const params = new URLSearchParams(window.location.search);
            const tabValue = params.get("tab") ?? "record";
            const tab: DetailTab = [
                "record",
                "detail",
                "ranking",
                "tier",
            ].includes(tabValue)
                ? (tabValue as DetailTab)
                : "record";
            const page = Math.max(1, Number(params.get("page")) || 1);

            void load(
                (selectedDifficulty[0].toUpperCase() +
                    selectedDifficulty.slice(1)) as Difficulty,
                tab,
                page,
                { replaceUrl: false }
            );
        };

        const onInvalidate = () => {
            for (const key of detailCache.current.keys()) {
                if (key.startsWith(`${initialData.music.index}:`)) {
                    detailCache.current.delete(key);
                }
            }
            void load(data.difficulty, data.activeTab, data.ranking.page, {
                replaceUrl: false,
                force: true,
            });
        };

        window.addEventListener("popstate", onPopState);
        window.addEventListener("music-detail:invalidate", onInvalidate);
        return () => {
            window.removeEventListener("popstate", onPopState);
            window.removeEventListener("music-detail:invalidate", onInvalidate);
        };
    }, [
        data.activeTab,
        data.difficulty,
        data.ranking.page,
        initialData.music.index,
        load,
    ]);

    return <MusicDetail {...data} isLoading={isLoading} onNavigate={load} />;
}
