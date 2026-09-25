import { infiniteQueryOptions } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";

import { readApiResponse } from "@/lib/api/response";
import {
    PROFILE_RECORDS_PAGE_SIZE,
    profileRecordsPayloadSchema,
} from "@/features/profile/schemas/publicProfileSchema";
import type {
    ProfileRecordsPayload,
    ProfileRecordsQuery,
} from "@/features/profile/schemas/publicProfileSchema";

export type ProfileRecordsFilter = Omit<ProfileRecordsQuery, "offset">;

async function fetchRecords(
    userId: number,
    filter: ProfileRecordsFilter,
    offset: number,
    signal: AbortSignal
) {
    const params = new URLSearchParams({ ...filter, offset: String(offset) });
    return profileRecordsPayloadSchema.parse(
        await readApiResponse(
            await fetch(`/api/profiles/${userId}/records?${params}`, {
                cache: "no-store",
                signal,
            })
        )
    );
}

/** 「기록」 탭 목록 — 20개씩 「더 보기」 */
export function profileRecordsOptions(
    userId: number,
    filter: ProfileRecordsFilter
) {
    return infiniteQueryOptions<
        ProfileRecordsPayload,
        Error,
        InfiniteData<ProfileRecordsPayload, number>,
        readonly unknown[],
        number
    >({
        queryKey: ["public-profile-records", userId, filter],
        queryFn: ({ signal, pageParam }) =>
            fetchRecords(userId, filter, pageParam, signal),
        initialPageParam: 0,
        getNextPageParam: (last) =>
            last.hasMore
                ? last.query.offset + PROFILE_RECORDS_PAGE_SIZE
                : undefined,
        // 서버가 공개 여부를 확인해 그린 첫 목록을 곧바로 다시 받지 않는다 — 조건을 바꿀 때마다 새 요청(API 가 매번 다시 확인)
        staleTime: 30_000,
        retry: false,
    });
}
