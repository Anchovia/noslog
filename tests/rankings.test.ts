import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    count: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
    default: { user: { count: mocks.count } },
}));

import { getUserRankingPosition } from "@/features/rankings/server/rankingPosition";

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
