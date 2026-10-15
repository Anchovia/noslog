import { queryOptions } from "@tanstack/react-query";

import type { SearchPreviewQuery } from "@/features/music/schemas/search-preview-schema";
import { searchPreviewSchema } from "@/features/music/schemas/search-preview-schema";
import { readApiResponse } from "@/lib/api/response";

export function searchPreviewOptions(query: SearchPreviewQuery) {
    return queryOptions({
        queryKey: ["music-preview", query],
        queryFn: async ({ signal }) => {
            const response = await fetch(
                `/api/music-preview?${new URLSearchParams(query)}`,
                { signal, credentials: "same-origin" }
            );
            return searchPreviewSchema.parse(
                await readApiResponse<unknown>(response)
            );
        },
        staleTime: 60_000,
        retry: false,
    });
}
