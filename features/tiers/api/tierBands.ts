import { queryOptions } from "@tanstack/react-query";

import { readApiResponse } from "@/lib/api/response";
import type { Locale } from "@/lib/i18n/routing";
import type { PublicTierBandPayload, TierDifficulty } from "@/lib/tiers";

export type TierBandQuery = {
    slug: string;
    bandId: number;
    difficulties: TierDifficulty[];
    levels: string[];
    locale: Locale;
    viewerId: number | null;
    showLocalizedTitle: boolean;
};

export function tierBandQueryKey(query: TierBandQuery) {
    return ["tier-band", query] as const;
}

export async function fetchTierBand(
    query: TierBandQuery,
    signal?: AbortSignal
) {
    const params = new URLSearchParams({ locale: query.locale });
    if (query.difficulties.length)
        params.set("difficulty", query.difficulties.join(","));
    if (query.levels.length) params.set("level", query.levels.join(","));
    // Identity and title preference are resolved by the server, never trusted from the URL.
    const response = await fetch(
        `/api/tiers/${encodeURIComponent(query.slug)}/bands/${query.bandId}?${params}`,
        { cache: "no-store", signal }
    );
    const { band } = await readApiResponse<{ band: PublicTierBandPayload }>(
        response
    );
    return band;
}

export function tierBandQueryOptions(query: TierBandQuery) {
    return queryOptions({
        queryKey: tierBandQueryKey(query),
        queryFn: ({ signal }) => fetchTierBand(query, signal),
        // Match the existing mount-local lazy load; no background polling or retained personal data.
        staleTime: Infinity,
        gcTime: 0,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}
