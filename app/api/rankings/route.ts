import { NextRequest } from "next/server";

import { parseGlobalRankingQuery } from "@/features/rankings/schemas/global-ranking-schema";
import { getGlobalRankingPage } from "@/features/rankings/server/global-ranking-data";
import {
    apiFailureResponse,
    apiSuccessResponse,
    withRouteErrorLog,
} from "@/lib/api/route-response";
import { getUser } from "@/lib/user";

const headers = { "Cache-Control": "private, no-store" };

export async function GET(request: NextRequest) {
    return withRouteErrorLog(
        {
            event: "rankings.fetch.failed",
            method: "GET",
            path: request.nextUrl.pathname,
            routePath: "/api/rankings",
        },
        async () => {
            const query = parseGlobalRankingQuery(request.nextUrl.searchParams);
            const user = await getUser();
            return apiSuccessResponse(
                await getGlobalRankingPage(query, user?.id ?? null),
                headers
            );
        },
        () =>
            apiFailureResponse(
                {
                    code: "RANKINGS_FETCH_FAILED",
                    message: "Unable to load rankings.",
                    status: 500,
                },
                headers
            )
    );
}
