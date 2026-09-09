import { NextResponse } from "next/server";

import { searchPreviewQuerySchema } from "@/features/music/schemas/searchPreviewSchema";
import { getSearchPreview } from "@/features/music/server/searchPreviewService";
import { createApiFailure, createApiSuccess } from "@/lib/api/response";
import { logServerError } from "@/lib/observability/server";

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
            createApiSuccess(await getSearchPreview(parsed.data)),
            { headers: { "Cache-Control": "private, no-store" } }
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
