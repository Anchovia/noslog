import { queryOptions } from "@tanstack/react-query";
import { readApiResponse } from "@/lib/api/response";
import { profileProgressPayloadSchema } from "@/features/profile/schemas/publicProfileSchema";
import type { ProfileProgressQuery } from "@/features/profile/schemas/publicProfileSchema";

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
