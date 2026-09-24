import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    earned: vi.fn(),
    deleteMany: vi.fn(),
    createMany: vi.fn(),
    transaction: vi.fn(),
}));
vi.mock("@/lib/db", () => ({
    default: {
        userAchievement: { findMany: mocks.earned },
        userAchievementShowcase: {
            deleteMany: mocks.deleteMany,
            createMany: mocks.createMany,
        },
        $transaction: mocks.transaction,
    },
}));

import { setAchievementShowcase } from "@/features/achievements/server/achievementService";

describe("프로필 업적 진열 저장(2026-09-25 D1)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.deleteMany.mockReturnValue("delete");
        mocks.createMany.mockReturnValue("create");
        mocks.transaction.mockResolvedValue([]);
    });

    it("고른 순서대로 칸 1–3 을 통째로 바꾼다(겹친 키는 한 번)", async () => {
        mocks.earned.mockResolvedValue([{ key: "pianist" }, { key: "s-rank" }]);
        expect(
            await setAchievementShowcase(7, ["pianist", "s-rank", "pianist"])
        ).toEqual({ status: "ok", keys: ["pianist", "s-rank"] });
        expect(mocks.deleteMany).toHaveBeenCalledWith({
            where: { user_id: 7 },
        });
        expect(mocks.createMany).toHaveBeenCalledWith({
            data: [
                { user_id: 7, position: 1, key: "pianist" },
                { user_id: 7, position: 2, key: "s-rank" },
            ],
        });
        expect(mocks.transaction).toHaveBeenCalledWith(["delete", "create"]);
    });

    it("빈 목록이면 칸을 비워 자동 진열로 돌아간다", async () => {
        expect(await setAchievementShowcase(7, [])).toEqual({
            status: "ok",
            keys: [],
        });
        expect(mocks.earned).not.toHaveBeenCalled();
        expect(mocks.transaction).toHaveBeenCalled();
    });

    it("4개 이상 · 모르는 키 · 얻지 않은 업적은 쓰지 않는다", async () => {
        expect(
            await setAchievementShowcase(7, [
                "pianist",
                "s-rank",
                "opinion",
                "bingo",
            ])
        ).toEqual({ status: "too-many" });
        expect(await setAchievementShowcase(7, ["gone"])).toEqual({
            status: "unknown",
        });
        mocks.earned.mockResolvedValue([{ key: "pianist" }]);
        expect(await setAchievementShowcase(7, ["pianist", "s-rank"])).toEqual({
            status: "not-earned",
        });
        expect(mocks.transaction).not.toHaveBeenCalled();
    });
});
