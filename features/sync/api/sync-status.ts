import { queryOptions } from "@tanstack/react-query";

import { syncStatusSchema } from "@/features/sync/schemas/sync-status-schema";
import { readApiResponse } from "@/lib/api/response";

export function syncStatusOptions(userId: number | null) {
    return queryOptions({
        queryKey: ["own-sync-status", userId],
        queryFn: async ({ signal }) =>
            syncStatusSchema.parse(
                await readApiResponse(
                    await fetch("/api/sync/status", {
                        signal,
                        cache: "no-store",
                    })
                )
            ),
        staleTime: 0,
        retry: false,
        refetchOnWindowFocus: true,
    });
}
