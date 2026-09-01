import {
    getCachedUserRankingPage,
    getCurrentUserRankingRow,
    normalizeRankingMetric,
    normalizeRankingMode,
    normalizeRankingRegion,
} from "@/lib/rankings";
import { createApiFailure, createApiSuccess } from "@/lib/api/response";
import { logServerError } from "@/lib/observability/server";
import { getUser } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 7;

export async function GET(request: NextRequest) {
    try {
        const mode = normalizeRankingMode(
            request.nextUrl.searchParams.get("mode")
        );
        const metric = normalizeRankingMetric(
            request.nextUrl.searchParams.get("metric"),
            mode
        );
        const region = normalizeRankingRegion(
            request.nextUrl.searchParams.get("region")
        );
        const requestedPage = Number.parseInt(
            request.nextUrl.searchParams.get("page") ?? "1",
            10
        );
        const page = Number.isFinite(requestedPage)
            ? Math.max(1, requestedPage)
            : 1;
        const [{ totalCount, rows }, user] = await Promise.all([
            getCachedUserRankingPage(mode, region, page, PAGE_SIZE, metric),
            getUser(),
        ]);
        const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
        const currentPage = Math.min(page, totalPages);

        if (currentPage !== page) {
            const rankingPage = await getCachedUserRankingPage(
                mode,
                region,
                currentPage,
                PAGE_SIZE,
                metric
            );
            return NextResponse.json(
                createApiSuccess({
                    page: currentPage,
                    totalCount: rankingPage.totalCount,
                    rows: rankingPage.rows,
                    currentUser: await getCurrentUserRankingRow(
                        user,
                        mode,
                        region,
                        metric
                    ),
                }),
                { headers: { "Cache-Control": "private, no-store" } }
            );
        }

        return NextResponse.json(
            createApiSuccess({
                page,
                totalCount,
                rows,
                currentUser: await getCurrentUserRankingRow(
                    user,
                    mode,
                    region,
                    metric
                ),
            }),
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
            {
                status: 500,
                headers: { "Cache-Control": "private, no-store" },
            }
        );
    }
}
