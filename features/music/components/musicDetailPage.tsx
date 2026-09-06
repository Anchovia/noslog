"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    useLocale,
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/localeProvider";
import PageContainer from "@/components/layout/pageContainer";
import type {
    DetailTab,
    Difficulty,
    MusicDetailProps,
} from "@/components/music/musicDetailTypes";
import MusicRecordPanel from "./musicRecordPanel";
import MusicRankingPanel from "./musicRankingPanel";
import MusicCommunityPanel from "./musicCommunityPanel";
import ActionButton from "@/components/ui/actionButton";
import AdaptiveAreaSwitcher from "@/components/ui/adaptiveAreaSwitcher";
import ResultState from "@/components/ui/resultState";
import {
    musicDetailQueryOptions,
    musicDetailQueryRootKey,
} from "../api/musicDetail";
import ChartInfoPanel from "./chartInfoPanel";
import DifficultySelector from "./difficultySelector";
import MusicEntityHeader from "./musicEntityHeader";

const areas: DetailTab[] = ["detail", "record", "ranking", "tier"];
const difficultyValues: Difficulty[] = ["Normal", "Hard", "Expert", "Real"];
const labels = {
    detail: "detail.info",
    record: "detail.record",
    ranking: "detail.ranking",
    tier: "detail.tier",
} as const;

export default function MusicDetailPage({
    initialData,
}: {
    initialData: MusicDetailProps;
}) {
    const locale = useLocale();
    const href = useLocalizedHref();
    const t = useTranslations();
    const client = useQueryClient();
    const [selection, setSelection] = useState({
        difficulty: initialData.difficulty,
        tab: initialData.activeTab,
        page: initialData.ranking.page,
    });
    const initialTarget =
        selection.difficulty === initialData.difficulty &&
        selection.tab === initialData.activeTab &&
        selection.page === initialData.ranking.page;
    const query = useQuery({
        ...musicDetailQueryOptions({
            index: initialData.music.index,
            ...selection,
            locale,
            accountId: initialData.accountId,
        }),
        initialData: initialTarget ? initialData : undefined,
    });
    const data = query.data;
    const focusRanking = useRef(false);
    const change = (difficulty: Difficulty, tab: DetailTab, page = 1) => {
        focusRanking.current =
            tab === "ranking" &&
            selection.tab === "ranking" &&
            page !== selection.page;
        const params = new URLSearchParams();
        const origin = new URLSearchParams(window.location.search);
        if (origin.get("source") === "tiers") {
            for (const key of ["source", "mode", "goal", "returnTo"]) {
                const value = origin.get(key);
                if (value) params.set(key, value);
            }
        }
        if (tab !== "detail") params.set("tab", tab);
        if (tab === "ranking" && page > 1) params.set("page", String(page));
        window.history.pushState(
            null,
            "",
            href(
                `/music/${encodeURIComponent(initialData.music.index)}/${difficulty.toLowerCase()}${params.size ? `?${params}` : ""}`
            )
        );
        setSelection({ difficulty, tab, page });
    };
    useEffect(() => {
        if (selection.tab !== "ranking" || !data) return;
        const url = new URL(window.location.href);
        const canonicalPage =
            data.ranking.page > 1 ? String(data.ranking.page) : null;
        if (url.searchParams.get("page") === canonicalPage) return;
        if (canonicalPage) url.searchParams.set("page", canonicalPage);
        else url.searchParams.delete("page");
        window.history.replaceState(null, "", `${url.pathname}${url.search}`);
    }, [data, selection.tab]);
    useEffect(() => {
        const pop = () => {
            const difficulty = difficultyValues.find(
                (item) =>
                    item.toLowerCase() ===
                    window.location.pathname.split("/").at(-1)
            );
            if (!difficulty) return;
            const params = new URLSearchParams(window.location.search);
            const tab =
                areas.find((area) => area === params.get("tab")) ?? "detail";
            const pageValue = Number(params.get("page"));
            const page =
                tab === "ranking" &&
                Number.isSafeInteger(pageValue) &&
                pageValue > 0
                    ? pageValue
                    : 1;
            setSelection({ difficulty, tab, page });
        };
        const invalidate = () =>
            void client.invalidateQueries({
                queryKey: musicDetailQueryRootKey(initialData.music.index),
            });
        window.addEventListener("popstate", pop);
        window.addEventListener("music-detail:invalidate", invalidate);
        return () => {
            window.removeEventListener("popstate", pop);
            window.removeEventListener("music-detail:invalidate", invalidate);
        };
    }, [client, initialData.music.index]);
    return (
        <PageContainer className="nl-music-detail">
            <MusicEntityHeader
                music={initialData.music}
                difficulty={selection.difficulty}
                chart={data?.chartDetail ?? null}
                pending={!data}
            />
            <DifficultySelector
                music={initialData.music}
                value={selection.difficulty}
                onValueChange={(difficulty) =>
                    change(difficulty, selection.tab)
                }
            />
            <AdaptiveAreaSwitcher
                value={selection.tab}
                onValueChange={(tab) => change(selection.difficulty, tab)}
                label={t("detail.area")}
                options={areas.map((value) => ({
                    value,
                    label: t(labels[value]),
                }))}
                busy={query.isFetching}
            >
                <span className="sr-only" role="status">
                    {t(
                        query.isError
                            ? "detail.error"
                            : query.isFetching
                              ? "detail.loading"
                              : "detail.ready",
                        {
                            difficulty: selection.difficulty,
                            area: t(labels[selection.tab]),
                        }
                    )}
                </span>
                {!data ? (
                    query.isError ? (
                        <ResultState
                            error
                            message={t("detail.error")}
                            action={
                                <ActionButton
                                    onClick={() => void query.refetch()}
                                >
                                    {t("common.retry")}
                                </ActionButton>
                            }
                        />
                    ) : (
                        <div className="nl-detail-loading" aria-hidden />
                    )
                ) : null}
                {data && selection.tab === "detail" ? (
                    <ChartInfoPanel chart={data.chartDetail} />
                ) : null}
                {data && selection.tab === "record" ? (
                    <MusicRecordPanel data={data} />
                ) : null}
                {data && selection.tab === "ranking" ? (
                    <MusicRankingPanel
                        data={data}
                        focusRequested={() => focusRanking.current}
                        onFocused={() => {
                            focusRanking.current = false;
                        }}
                        onPageChange={(page) =>
                            change(selection.difficulty, "ranking", page)
                        }
                        busy={query.isFetching}
                    />
                ) : null}
                {data && selection.tab === "tier" ? (
                    <MusicCommunityPanel
                        key={data.chartDetail.id}
                        music={data}
                    />
                ) : null}
            </AdaptiveAreaSwitcher>
        </PageContainer>
    );
}
