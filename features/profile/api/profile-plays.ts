import type { InfiniteData } from "@tanstack/react-query";
import { infiniteQueryOptions } from "@tanstack/react-query";

import type {
    ProfileListPayload,
    ProfileListQuery,
} from "@/features/profile/schemas/public-profile-schema";
import {
    PROFILE_BATCH_SIZE,
    profileListPayloadSchema,
} from "@/features/profile/schemas/public-profile-schema";
import { readApiResponse } from "@/lib/api/response";

export function profilePlaysOptions(
    userId: number,
    query: Omit<ProfileListQuery, "offset" | "limit"> &
        Partial<Pick<ProfileListQuery, "limit">>,
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
                        `/api/profiles/${userId}/plays?${new URLSearchParams({ ...query, limit: String(query.limit ?? PROFILE_BATCH_SIZE), offset: String(pageParam) })}`,
                        {
                            cache: "no-store",
                            signal,
                        }
                    )
                )
            ),
        initialPageParam: 0,
        getNextPageParam: (last) =>
            last.hasMore ? last.query.offset + last.query.limit : undefined,
        // 서버가 공개 여부를 확인해 그린 첫 목록을 곧바로 다시 받지 않는다(기록 탭과 같은 30초, 2026-10-15 S5).
        // 지표 · 모드를 바꾸면 visit 키가 바뀌고 「더 보기」 는 다음 쪽을 받으므로 그때마다 API 가 공개 여부를 다시 확인한다
        staleTime: 30_000,
        retry: false,
    });
}
