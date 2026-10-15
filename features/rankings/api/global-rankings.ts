import { queryOptions } from "@tanstack/react-query";

import type { GlobalRankingQuery } from "@/features/rankings/schemas/global-ranking-schema";
import {
    globalRankingPayloadSchema,
    serializeGlobalRankingQuery,
} from "@/features/rankings/schemas/global-ranking-schema";
import { readApiResponse } from "@/lib/api/response";

export function globalRankingOptions(
    query: GlobalRankingQuery,
    viewerId: number | null
) {
    return queryOptions({
        queryKey: ["global-rankings", viewerId, query],
        queryFn: async ({ signal }) => {
            const response = await fetch(
                `/api/rankings?${serializeGlobalRankingQuery(query)}`,
                { cache: "no-store", signal }
            );
            return globalRankingPayloadSchema.parse(
                await readApiResponse(response)
            );
        },
        staleTime: 60_000,
        gcTime: 10 * 60_000,
        retry: false,
    });
}
