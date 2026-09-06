import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { readApiResponse } from "@/lib/api/response";
import {
    discoveryPageSchema,
    discoverySearchParams,
} from "@/features/music/schemas/discoverySchema";
import type { DiscoveryQuery } from "@/features/music/schemas/discoverySchema";

async function fetchDiscovery(
    query: DiscoveryQuery,
    offset: number,
    signal: AbortSignal
) {
    const params = discoverySearchParams(query);
    params.set("offset", String(offset));
    const response = await fetch(`/api/discovery?${params}`, { signal });
    return discoveryPageSchema.parse(await readApiResponse(response));
}

export function discoveryOptions(
    query: DiscoveryQuery,
    accountId: number | null
) {
    return infiniteQueryOptions({
        queryKey: ["discovery", accountId, query],
        initialPageParam: 0,
        queryFn: ({ pageParam, signal }) =>
            fetchDiscovery(query, pageParam, signal),
        getNextPageParam: (page) => page.nextOffset,
        staleTime: 60_000,
        retry: false,
    });
}

export function discoveryPreviewOptions(
    query: DiscoveryQuery,
    accountId: number | null
) {
    return queryOptions({
        queryKey: ["discovery-count", accountId, query],
        queryFn: ({ signal }) => fetchDiscovery(query, 0, signal),
        staleTime: 60_000,
        retry: false,
    });
}
