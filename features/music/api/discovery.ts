import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import type { DiscoveryQuery } from "@/features/music/schemas/discovery-schema";
import {
    discoveryCountsSchema,
    discoveryPageSchema,
    discoverySearchParams,
} from "@/features/music/schemas/discovery-schema";
import { readApiResponse } from "@/lib/api/response";
import type { Locale } from "@/lib/i18n/routing";

async function fetchDiscovery(
    query: DiscoveryQuery,
    offset: number,
    locale: Locale,
    signal: AbortSignal
) {
    const params = discoverySearchParams(query);
    params.set("offset", String(offset));
    params.set("locale", locale);
    const response = await fetch(`/api/discovery?${params}`, { signal });
    return discoveryPageSchema.parse(await readApiResponse(response));
}

export function discoveryOptions(
    query: DiscoveryQuery,
    accountId: number | null,
    locale: Locale
) {
    return infiniteQueryOptions({
        queryKey: ["discovery", accountId, locale, query],
        initialPageParam: 0,
        queryFn: ({ pageParam, signal }) =>
            fetchDiscovery(query, pageParam, locale, signal),
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
        queryFn: async ({ signal }) => {
            const params = discoverySearchParams(query);
            params.set("counts", "1");
            const response = await fetch(`/api/discovery?${params}`, {
                signal,
            });
            return discoveryCountsSchema.parse(await readApiResponse(response));
        },
        staleTime: 60_000,
        retry: false,
    });
}
