import { queryOptions } from "@tanstack/react-query";

import type { TierBrowserQuery } from "@/features/tiers/schemas/tier-browser-schema";
import {
    serializeTierBrowserQuery,
    tierBrowserBandRecordsSchema,
    tierBrowserBandSchema,
    tierBrowserOverviewSchema,
} from "@/features/tiers/schemas/tier-browser-schema";
import { readApiResponse } from "@/lib/api/response";
import type { Locale } from "@/lib/i18n/routing";

export function tierBrowserOverviewOptions(
    query: TierBrowserQuery,
    viewerId: number | null
) {
    const { mode, goal, difficulties, levels, q } = query;
    const filters = { mode, goal, difficulties, levels, q };
    return queryOptions({
        queryKey: ["tier-browser", viewerId, filters],
        queryFn: async ({ signal }) => {
            const response = await fetch(
                `/api/tier-browser?${serializeTierBrowserQuery({
                    ...filters,
                    bands: [],
                    view: "grid",
                    sort: "position",
                    strip: "grade",
                })}`,
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
    const { mode, goal, difficulties, levels, q } = query;
    const filters = { mode, goal, difficulties, levels, q };
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
                view: "grid",
                sort: "position",
                strip: "grade",
            });
            params.set("bandId", String(bandId));
            // 공개 구간(CDN)과 내 기록(로그인 때만)을 따로 받아 합친다(2026-10-15 S7)
            const publicParams = new URLSearchParams(params);
            publicParams.set("locale", locale);
            publicParams.set("localized", showLocalizedTitle ? "1" : "0");
            const recordParams = new URLSearchParams(params);
            recordParams.set("part", "records");
            const [band, mine] = await Promise.all([
                fetch(`/api/tier-browser?${publicParams}`, { signal }).then(
                    async (response) =>
                        tierBrowserBandSchema.parse(
                            await readApiResponse(response)
                        )
                ),
                viewerId === null
                    ? null
                    : fetch(`/api/tier-browser?${recordParams}`, {
                          signal,
                      }).then(async (response) =>
                          tierBrowserBandRecordsSchema.parse(
                              await readApiResponse(response)
                          )
                      ),
            ]);
            if (!mine) return band;
            return {
                ...band,
                entries: band.entries.map((entry) => ({
                    ...entry,
                    record: mine.records[entry.chartId] ?? null,
                })),
            };
        },
        staleTime: 60_000,
        retry: false,
    });
}
