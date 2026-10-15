import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

import { searchPreviewQuerySchema } from "@/features/music/schemas/search-preview-schema";
import { getSearchPreview } from "@/features/music/server/search-preview-service";
import { createApiFailure, createApiSuccess } from "@/lib/api/response";
import { PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cache-policy";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { logServerError } from "@/lib/observability/server";

/*
 * 검색 미리보기는 세션을 읽지 않아 모두에게 같다(2026-10-15 S7).
 * 서버는 곡 · 번역 · 공개 채보가 바뀔 때 비워지는 태그로 캐시하고(결과가 언어와 무관해 키에 언어를 넣지 않음),
 * CDN 도 5분 둔다 — CDN 은 태그로 비우지 못해 새 곡 · 번역이 최대 5분 늦게 보일 수 있다
 */
const getCachedSearchPreview = unstable_cache(
    (q: string, scope: "music" | "chart") =>
        getSearchPreview({ q, scope, locale: "ko" }),
    ["search-preview-v1"],
    {
        tags: [CACHE_TAGS.musicCatalog, CACHE_TAGS.musicDetails],
        revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    }
);

export async function GET(request: Request) {
    const params = new URL(request.url).searchParams;
    const parsed = searchPreviewQuerySchema.safeParse(
        Object.fromEntries(params)
    );
    if (!parsed.success)
        return NextResponse.json(
            createApiFailure({
                code: "SEARCH_INVALID_REQUEST",
                message: "Invalid search request.",
            }),
            { status: 400 }
        );
    try {
        return NextResponse.json(
            createApiSuccess(
                await getCachedSearchPreview(parsed.data.q, parsed.data.scope)
            ),
            {
                headers: {
                    "Cache-Control": "public, max-age=0, s-maxage=300",
                },
            }
        );
    } catch (error) {
        logServerError(error, {
            event: "music-preview.fetch.failed",
            method: "GET",
            path: "/api/music-preview",
            routePath: "/api/music-preview",
            routeType: "route",
        });
        return NextResponse.json(
            createApiFailure({
                code: "SEARCH_UNAVAILABLE",
                message: "Search is unavailable.",
            }),
            { status: 500 }
        );
    }
}
