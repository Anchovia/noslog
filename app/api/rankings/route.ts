import { NextRequest, NextResponse } from "next/server";
import { createApiFailure, createApiSuccess } from "@/lib/api/response";
import { logServerError } from "@/lib/observability/server";
import { getUser } from "@/lib/user";
import { parseGlobalRankingQuery } from "@/features/rankings/schemas/globalRankingSchema";
import { getGlobalRankingPage } from "@/features/rankings/server/globalRankingData";

export async function GET(request: NextRequest) {
    try {
        const query = parseGlobalRankingQuery(request.nextUrl.searchParams);
        const user = await getUser();
        return NextResponse.json(
            createApiSuccess(
                await getGlobalRankingPage(query, user?.id ?? null)
            ),
            { headers: { "Cache-Control": "private, no-store" } }
        );
    } catch (error) {
        logServerError(error, {
            event: "rankings.fetch.failed",
            method: "GET",
            path: request.nextUrl.pathname,
            routePath: "/api/rankings",
            routeType: "route",
        });
        return NextResponse.json(
            createApiFailure({
                code: "RANKINGS_FETCH_FAILED",
                message: "Unable to load rankings.",
            }),
            { status: 500, headers: { "Cache-Control": "private, no-store" } }
        );
    }
}
