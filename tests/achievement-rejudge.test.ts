import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    users: vi.fn(),
}));
vi.mock("@/lib/db", () => ({
    default: { user: { findMany: mocks.users } },
}));

import * as service from "@/features/achievements/server/achievementService";

describe("업적 다시 판정 묶음(2026-09-25 B1)", () => {
    beforeEach(() => vi.clearAllMocks());

    it("판정할 거리가 있는 사용자를 id 순으로 한 묶음 — 가득 차면 다음 시작점을 준다", async () => {
        mocks.users.mockResolvedValue([{ id: 3 }, { id: 8 }]);
        const evaluate = vi
            .fn()
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([
                { key: "s-rank", tier: 1 },
                { key: "s-rank", tier: 2 },
            ]);
        const batch = await service.rejudgeAchievementsBatch(0, 2, evaluate);
        expect(mocks.users).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({ id: { gt: 0 } }),
                orderBy: { id: "asc" },
                take: 2,
            })
        );
        expect(evaluate.mock.calls).toEqual([[3], [8]]);
        expect(batch).toEqual({
            judged: 2,
            awarded: 2,
            awardedUserIds: [8],
            nextCursor: 8,
        });
    });

    it("묶음이 덜 차면 끝(nextCursor = null)", async () => {
        mocks.users.mockResolvedValue([]);
        expect(await service.rejudgeAchievementsBatch(8, 2)).toEqual({
            judged: 0,
            awarded: 0,
            awardedUserIds: [],
            nextCursor: null,
        });
    });
});
