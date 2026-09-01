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
import {
    musicDetailQueryKey,
    musicDetailQueryOptions,
    musicDetailQueryRootKey,
} from "@/features/music/api/musicDetail";
import { useQueryClient } from "@tanstack/react-query";

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
    const queryClient = useQueryClient();
    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const requestId = useRef(0);

    useEffect(() => {
        queryClient.setQueryData(
            musicDetailQueryKey({
                index: initialData.music.index,
                difficulty: initialData.difficulty,
                tab: initialData.activeTab,
                page: initialData.ranking.page,
                locale,
            }),
            initialData
        );
    }, [initialData, locale, queryClient]);

    const load = useCallback(
        async (
            difficulty: Difficulty,
            tab: DetailTab,
            page = 1,
            options?: { replaceUrl?: boolean; force?: boolean }
        ) => {
            const index = initialData.music.index;
            const query = { index, difficulty, tab, page, locale };
            const key = musicDetailQueryKey(query);
            const url = detailUrl(index, difficulty, tab, page, locale);

            if (options?.replaceUrl !== false) {
                window.history.pushState(null, "", url);
            }

            if (options?.force) {
                queryClient.removeQueries({ queryKey: key, exact: true });
            }
            const cached = options?.force
                ? undefined
                : queryClient.getQueryData<MusicDetailProps>(key);
            if (cached) {
                setData(cached);
                return;
            }

            const currentRequest = ++requestId.current;
            setIsLoading(true);

            try {
                const nextData = await queryClient.fetchQuery(
                    musicDetailQueryOptions(query)
                );
                if (currentRequest === requestId.current) setData(nextData);
            } finally {
                if (currentRequest === requestId.current) setIsLoading(false);
            }
        },
        [initialData.music.index, locale, queryClient]
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
            queryClient.removeQueries({
                queryKey: musicDetailQueryRootKey(initialData.music.index),
            });
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
        queryClient,
    ]);

    return <MusicDetail {...data} isLoading={isLoading} onNavigate={load} />;
}
