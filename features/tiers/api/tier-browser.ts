import { queryOptions } from "@tanstack/react-query";

import type { TierBrowserQuery } from "@/features/tiers/schemas/tier-browser-schema";
import {
    serializeTierBrowserQuery,
    tierBrowserListSchema,
    tierBrowserOverviewSchema,
    tierBrowserRecordsSchema,
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

function tierBrowserFilterParams(
    filters: Pick<TierBrowserQuery, "mode" | "goal" | "difficulties" | "levels">
) {
    return serializeTierBrowserQuery({
        ...filters,
        q: "",
        bands: [],
        view: "grid",
        sort: "position",
        strip: "grade",
    });
}

// 서열표 전체 공개 본문(CDN) — 검색어 · 구간 · 정렬은 받아 둔 목록에서 브라우저가 처리한다
export function tierBrowserListOptions(
    query: TierBrowserQuery,
    locale: Locale,
    showLocalizedTitle: boolean
) {
    const { mode, goal, difficulties, levels } = query;
    const filters = { mode, goal, difficulties, levels };
    return queryOptions({
        queryKey: ["tier-browser-list", locale, showLocalizedTitle, filters],
        queryFn: async ({ signal }) => {
            const params = tierBrowserFilterParams(filters);
            params.set("part", "list");
            params.set("locale", locale);
            params.set("localized", showLocalizedTitle ? "1" : "0");
            const response = await fetch(`/api/tier-browser?${params}`, {
                signal,
            });
            return tierBrowserListSchema.parse(await readApiResponse(response));
        },
        staleTime: 60_000,
        retry: false,
    });
}

// 서열표 전체의 내 기록 — 로그인했을 때만 공개 목록과 따로 한 번 받는다
export function tierBrowserRecordsOptions(
    query: TierBrowserQuery,
    viewerId: number | null
) {
    const { mode, goal, difficulties, levels } = query;
    const filters = { mode, goal, difficulties, levels };
    return queryOptions({
        queryKey: ["tier-browser-records", viewerId, filters],
        queryFn: async ({ signal }) => {
            const params = tierBrowserFilterParams(filters);
            params.set("part", "records");
            const response = await fetch(`/api/tier-browser?${params}`, {
                signal,
            });
            return tierBrowserRecordsSchema.parse(
                await readApiResponse(response)
            );
        },
        enabled: viewerId !== null,
        staleTime: 60_000,
        retry: false,
    });
}
