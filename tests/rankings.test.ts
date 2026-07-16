import { beforeEach, describe, expect, it, vi } from "vitest";

const { count } = vi.hoisted(() => ({ count: vi.fn() }));

vi.mock("@/lib/db", () => ({
    default: { user: { count } },
}));

vi.mock("next/cache", () => ({
    unstable_cache: (callback: unknown) => callback,
}));

import { getUserRankingPosition } from "@/lib/rankings";

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
