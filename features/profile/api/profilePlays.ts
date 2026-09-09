import { infiniteQueryOptions } from "@tanstack/react-query";
import { readApiResponse } from "@/lib/api/response";
import {
    PROFILE_BATCH_SIZE,
    profileListPayloadSchema,
} from "@/features/profile/schemas/publicProfileSchema";
import type {
    ProfileListPayload,
    ProfileListQuery,
} from "@/features/profile/schemas/publicProfileSchema";
import type { InfiniteData } from "@tanstack/react-query";

export function profilePlaysOptions(
    userId: number,
    query: Omit<ProfileListQuery, "offset">,
    visit = 0
) {
    return infiniteQueryOptions<
        ProfileListPayload,
        Error,
        InfiniteData<ProfileListPayload, number>,
        readonly unknown[],
        number
    >({
        queryKey: ["public-profile-plays", userId, query, visit],
        queryFn: async ({ signal, pageParam }) =>
            profileListPayloadSchema.parse(
                await readApiResponse(
                    await fetch(
                        `/api/profiles/${userId}/plays?${new URLSearchParams({ ...query, offset: String(pageParam) })}`,
                        {
                            cache: "no-store",
                            signal,
                        }
                    )
                )
            ),
        initialPageParam: 0,
        getNextPageParam: (last) =>
            last.hasMore ? last.query.offset + PROFILE_BATCH_SIZE : undefined,
        // Every visit/expansion rechecks current privacy; do not reuse hidden history.
        staleTime: 0,
        retry: false,
    });
}
