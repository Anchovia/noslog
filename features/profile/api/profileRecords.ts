import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
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

export type ProfileRecordsFilter = Omit<ProfileRecordsQuery, "offset" | "size">;

function recordsUrl(
    userId: number,
    filter: ProfileRecordsFilter,
    offset: number,
    size: number
) {
    const params = new URLSearchParams({
        view: filter.view,
        mode: filter.mode,
        sort: filter.sort,
        offset: String(offset),
        size: String(size),
    });
    if (filter.q) params.set("q", filter.q);
    for (const key of ["difficulty", "rank", "lamp"] as const)
        if (filter[key].length) params.set(key, filter[key].join(","));
    return `/api/profiles/${userId}/records?${params}`;
}

async function fetchRecords(
    userId: number,
    filter: ProfileRecordsFilter,
    offset: number,
    size: number,
    signal: AbortSignal
) {
    return profileRecordsPayloadSchema.parse(
        await readApiResponse(
            await fetch(recordsUrl(userId, filter, offset, size), {
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
            fetchRecords(
                userId,
                filter,
                pageParam,
                PROFILE_RECORDS_PAGE_SIZE,
                signal
            ),
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

/** 폰 필터 창 「기록 N곡 보기」 — 고르는 중인 조건의 개수만 */
export function profileRecordsCountOptions(
    userId: number,
    filter: ProfileRecordsFilter
) {
    return queryOptions({
        queryKey: ["public-profile-records-count", userId, filter],
        queryFn: async ({ signal }) =>
            (await fetchRecords(userId, filter, 0, 0, signal)).total,
        staleTime: 30_000,
        retry: false,
    });
}
