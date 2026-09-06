import { queryOptions } from "@tanstack/react-query";
import { readApiResponse } from "@/lib/api/response";
import type { Locale } from "@/lib/i18n/routing";
import {
    serializeTierBrowserQuery,
    tierBrowserBandSchema,
    tierBrowserOverviewSchema,
} from "@/features/tiers/schemas/tierBrowserSchema";
import type { TierBrowserQuery } from "@/features/tiers/schemas/tierBrowserSchema";

export function tierBrowserOverviewOptions(
    query: TierBrowserQuery,
    viewerId: number | null
) {
    const { mode, goal, difficulties, levels } = query;
    const filters = { mode, goal, difficulties, levels };
    return queryOptions({
        queryKey: ["tier-browser", viewerId, filters],
        queryFn: async ({ signal }) => {
            const response = await fetch(
                `/api/tier-browser?${serializeTierBrowserQuery({ ...filters, bands: [], detailed: false })}`,
                { signal }
            );
            return tierBrowserOverviewSchema.parse(
                await readApiResponse(response)
            );
        },
        staleTime: 60_000,
        retry: false,
    });
}

export function tierBrowserBandOptions(
    query: TierBrowserQuery,
    bandId: number,
    locale: Locale,
    viewerId: number | null,
    showLocalizedTitle: boolean
) {
    const { mode, goal, difficulties, levels } = query;
    const filters = { mode, goal, difficulties, levels };
    return queryOptions({
        queryKey: [
            "tier-browser-band",
            viewerId,
            locale,
            showLocalizedTitle,
            filters,
            bandId,
        ],
        queryFn: async ({ signal }) => {
            const params = serializeTierBrowserQuery({
                ...filters,
                bands: [],
                detailed: false,
            });
            params.set("bandId", String(bandId));
            params.set("locale", locale);
            const response = await fetch(`/api/tier-browser?${params}`, {
                signal,
            });
            return tierBrowserBandSchema.parse(await readApiResponse(response));
        },
        staleTime: 60_000,
        retry: false,
    });
}
