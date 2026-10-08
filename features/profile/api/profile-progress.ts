import { queryOptions } from "@tanstack/react-query";

import type { ProfileProgressQuery } from "@/features/profile/schemas/public-profile-schema";
import { profileProgressPayloadSchema } from "@/features/profile/schemas/public-profile-schema";
import { readApiResponse } from "@/lib/api/response";

export function profileProgressOptions(
    userId: number,
    query: ProfileProgressQuery
) {
    return queryOptions({
        queryKey: ["public-profile-progress", userId, query],
        queryFn: async ({ signal }) =>
            profileProgressPayloadSchema.parse(
                await readApiResponse(
                    await fetch(
                        `/api/profiles/${userId}/progress?${new URLSearchParams(query)}`,
                        { signal, cache: "no-store" }
                    )
                )
            ),
        staleTime: 0,
        retry: false,
    });
}
