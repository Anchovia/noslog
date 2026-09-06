import { queryOptions } from "@tanstack/react-query";
import { readApiResponse } from "@/lib/api/response";
import {
    globalRankingPayloadSchema,
    serializeGlobalRankingQuery,
} from "@/features/rankings/schemas/globalRankingSchema";
import type { GlobalRankingQuery } from "@/features/rankings/schemas/globalRankingSchema";

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
