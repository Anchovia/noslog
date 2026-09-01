import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    getCachedUserRankingPage: vi.fn(),
    getCurrentUserRankingRow: vi.fn(),
    getUser: vi.fn(),
    logServerError: vi.fn(),
}));

vi.mock("@/lib/rankings", () => ({
    getCachedUserRankingPage: mocks.getCachedUserRankingPage,
    getCurrentUserRankingRow: mocks.getCurrentUserRankingRow,
    normalizeRankingMode: (value: string | null) =>
        value === "recital" ? "recital" : "basic",
    normalizeRankingMetric: (value: string | null, mode: string) =>
        value === "rating" && mode === "basic" ? "rating" : "grade",
    normalizeRankingRegion: (value: string | null) =>
        value === "kr" || value === "jp" || value === "global" ? value : "all",
}));

vi.mock("@/lib/user", () => ({
    getUser: mocks.getUser,
}));

vi.mock("@/lib/observability/server", () => ({
    logServerError: mocks.logServerError,
}));

import { GET } from "@/app/api/rankings/route";

describe("GET /api/rankings", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.getUser.mockResolvedValue({ id: 1 });
        mocks.getCachedUserRankingPage.mockResolvedValue({
            totalCount: 1,
            rows: [
                {
                    id: 2,
                    rank: 1,
                    username: "PIANIST",
                    avatar: null,
                    country: "ko-KR",
                    grade: 5_683_000,
                    exam: 1,
                },
            ],
        });
        mocks.getCurrentUserRankingRow.mockResolvedValue(null);
    });

    it("랭킹 데이터를 공통 API 응답으로 감싼다", async () => {
        const response = await GET(
            new NextRequest(
                "https://noslog.app/api/rankings?mode=basic&region=all&page=1"
            )
        );

        expect(response.status).toBe(200);
        expect(response.headers.get("cache-control")).toBe("private, no-store");
        await expect(response.json()).resolves.toEqual({
            isSuccess: true,
            code: "SUCCESS",
            message: "",
            result: {
                page: 1,
                totalCount: 1,
                rows: [
                    expect.objectContaining({
                        id: 2,
                        username: "PIANIST",
                    }),
                ],
                currentUser: null,
            },
        });
    });

    it("내부 오류를 노출하지 않고 정규화한 실패 응답을 반환한다", async () => {
        const error = new Error("database secret");
        mocks.getCachedUserRankingPage.mockRejectedValue(error);

        const response = await GET(
            new NextRequest("https://noslog.app/api/rankings")
        );

        expect(response.status).toBe(500);
        await expect(response.json()).resolves.toEqual({
            isSuccess: false,
            code: "RANKINGS_FETCH_FAILED",
            message: "Unable to load rankings.",
            result: null,
        });
        expect(mocks.logServerError).toHaveBeenCalledWith(
            error,
            expect.objectContaining({ event: "rankings.fetch.failed" })
        );
    });
});
