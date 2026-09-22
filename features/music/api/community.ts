import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { readApiResponse } from "@/lib/api/response";
import {
    communityDataSchema,
    opinionPageSchema,
    opinionReplyListSchema,
    patternDataSchema,
} from "@/features/music/schemas/communitySchema";
import type { OpinionQuery } from "@/features/music/schemas/communitySchema";

async function getCommunity(params: URLSearchParams, signal: AbortSignal) {
    return readApiResponse<unknown>(
        await fetch(`/api/music-community?${params}`, {
            signal,
            credentials: "same-origin",
            cache: "no-store",
        })
    );
}

export function communityPatternOptions(chartId: number) {
    return queryOptions({
        queryKey: ["music-community", chartId, "pattern"],
        staleTime: 60_000,
        retry: false,
        queryFn: async ({ signal }) =>
            patternDataSchema.parse(
                await getCommunity(
                    new URLSearchParams({
                        chartId: String(chartId),
                        area: "pattern",
                    }),
                    signal
                )
            ),
    });
}

export function communityOptions(chartId: number, accountId?: number) {
    return queryOptions({
        queryKey: ["music-community", chartId, "detail", accountId ?? "guest"],
        staleTime: 60_000,
        retry: false,
        queryFn: async ({ signal }) =>
            communityDataSchema.parse(
                await getCommunity(
                    new URLSearchParams({ chartId: String(chartId) }),
                    signal
                )
            ),
    });
}

export function communityOpinionOptions(
    query: Omit<OpinionQuery, "offset">,
    accountId?: number
) {
    return infiniteQueryOptions({
        queryKey: [
            "music-community",
            query.chartId,
            "opinions",
            query.sort,
            accountId ?? "guest",
        ],
        initialPageParam: 0,
        staleTime: 60_000,
        retry: false,
        queryFn: async ({ pageParam, signal }) =>
            opinionPageSchema.parse(
                await getCommunity(
                    new URLSearchParams({
                        area: "opinions",
                        chartId: String(query.chartId),
                        sort: query.sort,
                        offset: String(pageParam),
                    }),
                    signal
                )
            ),
        getNextPageParam: (page) => page.nextOffset,
    });
}

// 의견 하나의 답글(2026-09-22) — 펼칠 때 받는다
export function communityReplyOptions(
    chartId: number,
    evaluationId: number,
    accountId?: number
) {
    return queryOptions({
        queryKey: [
            "music-community",
            chartId,
            "replies",
            evaluationId,
            accountId ?? "guest",
        ],
        staleTime: 60_000,
        retry: false,
        queryFn: async ({ signal }) =>
            opinionReplyListSchema.parse(
                await getCommunity(
                    new URLSearchParams({
                        area: "replies",
                        chartId: String(chartId),
                        evaluationId: String(evaluationId),
                    }),
                    signal
                )
            ),
    });
}
