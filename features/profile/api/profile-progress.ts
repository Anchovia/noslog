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
        // 서버가 그린 첫 그래프를 곧바로 다시 받지 않는다 — 지표 · 기간 · 모드를 바꾸면 새 요청(기록 탭과 같은 30초)
        staleTime: 30_000,
        retry: false,
    });
}
