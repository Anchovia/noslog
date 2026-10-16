import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
    plays: vi.fn(),
    upsert: vi.fn(),
    user: vi.fn(),
    stats: vi.fn(),
}));
vi.mock("@/lib/db", () => ({
    default: {
        playData: { findMany: mocks.plays },
        $transaction: (operation: (tx: unknown) => unknown) =>
            operation({
                user: { update: mocks.user },
                playerStats: { upsert: mocks.stats },
                userBestGrade: { upsert: mocks.upsert },
            }),
    },
}));
import { updateGrade } from "@/lib/services/user/update-grade";

describe("profile Grd history retention", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-09-07T12:00:00Z"));
        vi.spyOn(console, "info").mockImplementation(() => {});
        mocks.plays.mockResolvedValue([]);
    });
    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });
    // 사람당 하루(서울 날짜) 한 줄은 유일 키 (userId, day) 가 지킨다 — 지난 날짜 줄은 읽지도 지우지도 않는다(2026-10-16 P5-1)
    it("writes only today's Korean-day row and keeps older history untouched", async () => {
        await updateGrade(7);
        const day = new Date("2026-09-07T00:00:00.000Z");
        expect(mocks.upsert).toHaveBeenCalledWith({
            where: { userId_day: { userId: 7, day } },
            create: {
                userId: 7,
                day,
                gradeBasic: 0,
                gradeRecital: null,
            },
            update: { gradeBasic: 0, gradeRecital: null },
        });
        expect(mocks.upsert).toHaveBeenCalledTimes(1);
    });
    it("stores the current Grd only in player_stats", async () => {
        mocks.plays.mockImplementation(({ where }) =>
            Promise.resolve(
                where.gradeRecital
                    ? [{ gradeRecital: 300 }]
                    : [{ gradeBasic: 500 }, { gradeBasic: 400 }]
            )
        );
        await expect(updateGrade(7)).resolves.toEqual({
            grade_basic: 900,
            grade_recital: 300,
        });
        expect(mocks.stats).toHaveBeenCalledWith({
            where: { userId: 7 },
            create: { userId: 7, gradeBasic: 900, gradeRecital: 300 },
            update: { gradeBasic: 900, gradeRecital: 300 },
        });
        expect(mocks.user).not.toHaveBeenCalled();
    });
});
