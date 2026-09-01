import { queryOptions } from "@tanstack/react-query";

import type {
    UserRankingMetric,
    UserRankingMode,
    UserRankingPayload,
    UserRankingRegion,
} from "@/lib/rankings";
import { readApiResponse } from "@/lib/api/response";

export type UserRankingsQuery = {
    mode: UserRankingMode;
    metric: UserRankingMetric;
    region: UserRankingRegion;
    page: number;
};

export function userRankingsQueryKey({
    mode,
    metric,
    region,
    page,
}: UserRankingsQuery) {
    return ["user-rankings", mode, metric, region, page] as const;
}

export async function fetchUserRankings(
    query: UserRankingsQuery,
    signal?: AbortSignal
) {
    const params = new URLSearchParams({
        mode: query.mode,
        metric: query.metric,
        region: query.region,
        page: String(query.page),
    });
    const response = await fetch(`/api/rankings?${params}`, {
        cache: "no-store",
        signal,
    });

    return readApiResponse<UserRankingPayload>(response);
}

export function userRankingsQueryOptions(query: UserRankingsQuery) {
    return queryOptions({
        queryKey: userRankingsQueryKey(query),
        queryFn: ({ signal }) => fetchUserRankings(query, signal),
    });
}
