import {
    getCachedUserRankingPage,
    getCurrentUserRankingRow,
    normalizeRankingMode,
    normalizeRankingRegion,
} from "@/lib/rankings";
import { getUser } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 7;

export async function GET(request: NextRequest) {
    const mode = normalizeRankingMode(request.nextUrl.searchParams.get("mode"));
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
        getCachedUserRankingPage(mode, region, page, PAGE_SIZE),
        getUser(),
    ]);
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);

    if (currentPage !== page) {
        const rankingPage = await getCachedUserRankingPage(
            mode,
            region,
            currentPage,
            PAGE_SIZE
        );
        return NextResponse.json({
            page: currentPage,
            totalCount: rankingPage.totalCount,
            rows: rankingPage.rows,
            currentUser: await getCurrentUserRankingRow(user, mode, region),
        });
    }

    return NextResponse.json({
        page,
        totalCount,
        rows,
        currentUser: await getCurrentUserRankingRow(user, mode, region),
    });
}
