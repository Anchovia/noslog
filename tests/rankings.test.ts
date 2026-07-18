import { beforeEach, describe, expect, it, vi } from "vitest";

const { count } = vi.hoisted(() => ({ count: vi.fn() }));

vi.mock("@/lib/db", () => ({
    default: { user: { count } },
}));

vi.mock("next/cache", () => ({
    unstable_cache: (callback: unknown) => callback,
}));

import { getUserRankingPosition } from "@/lib/rankings";
import {
    formatRankingGrade,
    getPaginationItems,
    getRankingPageHref,
} from "@/components/rankings/table/rankingTableUtils";

describe("getUserRankingPosition", () => {
    beforeEach(() => {
        count.mockReset();
    });

    it("자신보다 앞선 사용자 수에 1을 더해 순위를 계산한다", async () => {
        count.mockResolvedValue(4);

        await expect(
            getUserRankingPosition({
                userId: 10,
                grade: 568300,
                mode: "basic",
            })
        ).resolves.toBe(5);
    });

    it("동점이면 ID가 작은 사용자를 앞선 순위로 계산한다", async () => {
        count.mockResolvedValue(0);

        await getUserRankingPosition({
            userId: 10,
            grade: 568300,
            mode: "basic",
            scope: { country: "ko-KR" },
        });

        expect(count).toHaveBeenCalledWith({
            where: {
                AND: [
                    { country: "ko-KR" },
                    { grade_basic: { gt: 0 } },
                    {
                        OR: [
                            { grade_basic: { gt: 568300 } },
                            {
                                AND: [
                                    { grade_basic: 568300 },
                                    { id: { lt: 10 } },
                                ],
                            },
                        ],
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
        expect(count).not.toHaveBeenCalled();
    });
});

describe("ranking table utilities", () => {
    it("Grd 저장값을 화면 표시 단위로 변환한다", () => {
        expect(formatRankingGrade(568300)).toBe("5,683");
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
    });
});
