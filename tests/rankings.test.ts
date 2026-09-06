import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    count: vi.fn(),
    userFindMany: vi.fn(),
    tierListFindUnique: vi.fn(),
    playDataFindMany: vi.fn(),
    queryRaw: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
    default: {
        $queryRaw: mocks.queryRaw,
        user: { count: mocks.count, findMany: mocks.userFindMany },
        tierList: { findUnique: mocks.tierListFindUnique },
        playData: { findMany: mocks.playDataFindMany },
    },
}));

vi.mock("next/cache", () => ({
    unstable_cache: (callback: unknown) => callback,
}));

import {
    getCachedUserRankingPage,
    getUserRankingPosition,
    normalizeRankingMetric,
} from "@/lib/rankings";
import {
    formatRankingGrade,
    formatRankingRating,
    getPaginationItems,
    getRankingPageHref,
} from "@/components/rankings/table/rankingTableUtils";
import { BASIC_RATING_TOP_COUNT } from "@/lib/tiers/basicRating";

describe("getUserRankingPosition", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("자신보다 앞선 사용자 수에 1을 더해 순위를 계산한다", async () => {
        mocks.count.mockResolvedValue(4);

        await expect(
            getUserRankingPosition({
                userId: 10,
                grade: 568300,
                mode: "basic",
            })
        ).resolves.toBe(5);
    });

    it("공개 Grd 정수가 같은 사용자는 앞선 순위로 세지 않는다", async () => {
        mocks.count.mockResolvedValue(0);

        await getUserRankingPosition({
            userId: 10,
            grade: 568300,
            mode: "basic",
            scope: { country: "ko-KR" },
        });

        expect(mocks.count).toHaveBeenCalledWith({
            where: {
                AND: [
                    { country: "ko-KR" },
                    { grade_basic: { gt: 0 } },
                    {
                        grade_basic: { gte: 568350 },
                    },
                ],
            },
        });
    });

    it("Grd 기록이 없으면 DB를 조회하지 않는다", async () => {
        await expect(
            getUserRankingPosition({
                userId: 10,
                grade: null,
                mode: "recital",
            })
        ).resolves.toBeNull();
        expect(mocks.count).not.toHaveBeenCalled();
    });
});

describe("ranking table utilities", () => {
    it("Grd 저장값을 화면 표시 단위로 변환한다", () => {
        expect(formatRankingGrade(568300)).toBe("5,683");
        expect(formatRankingRating(4815.94)).toBe("4,816");
    });

    it("페이지가 적으면 모든 페이지 번호를 표시한다", () => {
        expect(getPaginationItems(2, 4)).toEqual([1, 2, 3, 4]);
    });

    it("페이지가 많으면 현재 페이지 주변과 양 끝만 표시한다", () => {
        expect(getPaginationItems(5, 10)).toEqual([
            1,
            "ellipsis",
            4,
            5,
            6,
            "ellipsis",
            10,
        ]);
    });

    it("랭킹 조건을 유지한 페이지 주소를 생성한다", () => {
        expect(getRankingPageHref("recital", "kr", 3)).toBe(
            "/rankings?mode=recital&region=kr&page=3"
        );
        expect(getRankingPageHref("basic", "all", 2, "rating")).toBe(
            "/rankings?mode=basic&metric=rating&region=all&page=2"
        );
    });

    it("NosLog 레이팅은 Basic 모드에서만 허용한다", () => {
        expect(normalizeRankingMetric("rating", "basic")).toBe("rating");
        expect(normalizeRankingMetric("rating", "recital")).toBe("grade");
    });
});

describe("Basic NosLog 레이팅 랭킹", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.queryRaw.mockResolvedValue([
            { id: 5, status: "published", revision: "revision-1" },
        ]);
        mocks.tierListFindUnique.mockResolvedValue({
            status: "published",
            entries: Array.from(
                { length: BASIC_RATING_TOP_COUNT },
                (_, index) => ({
                    chartId: index + 1,
                    tierBand: { value: 14.5 },
                })
            ),
        });
        mocks.playDataFindMany.mockResolvedValue([
            ...Array.from({ length: BASIC_RATING_TOP_COUNT }, (_, index) => ({
                user_id: 1,
                chart_id: index + 1,
                score: 1_000_000,
            })),
            {
                user_id: 2,
                chart_id: 1,
                score: 990_000,
            },
        ]);
        mocks.userFindMany.mockResolvedValue([
            {
                id: 1,
                username: "Pianist",
                avatar: null,
                country: "ko-KR",
                grade_basic: 600000,
                exam_basic: 1,
            },
            {
                id: 2,
                username: "Challenger",
                avatar: null,
                country: "ja-JP",
                grade_basic: 500000,
                exam_basic: null,
            },
        ]);
    });

    it("현재 공개 서열 상수로 상위 곡을 자동 계산한다", async () => {
        const page = await getCachedUserRankingPage(
            "basic",
            "all",
            1,
            7,
            "rating"
        );

        expect(page.totalCount).toBe(2);
        expect(page.rows[0]).toMatchObject({
            id: 1,
            rank: 1,
            rating: 10000,
            filledSlots: BASIC_RATING_TOP_COUNT,
        });
        expect(page.rows[1]).toMatchObject({
            id: 2,
            rank: 2,
            rating: 103,
            filledSlots: 1,
        });
    });

    it("지역을 바꾸면 해당 범위 안에서 순위를 다시 매긴다", async () => {
        const page = await getCachedUserRankingPage(
            "basic",
            "jp",
            1,
            7,
            "rating"
        );

        expect(page.totalCount).toBe(1);
        expect(page.rows[0]).toMatchObject({ id: 2, rank: 1 });
    });
});
