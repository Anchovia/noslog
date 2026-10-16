import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    history: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({
    default: {
        chartPlayHistory: { findMany: mocks.history },
    },
}));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));

import { playTier } from "@/features/profile/server/profile-stats-service";
import {
    currentStreak,
    getProfileActivity,
    playDay,
} from "@/features/profile/server/profile-activity-service";

describe("profile stats", () => {
    beforeEach(() => vi.clearAllMocks());
    it("one bar: Pianist > FC > rank, a failed play goes to its rank", () => {
        expect(playTier({ fcType: 3, rank: "S" })).toBe("pianist");
        expect(playTier({ fcType: 0, rank: "P" })).toBe("pianist");
        expect(playTier({ fcType: 2, rank: "A" })).toBe("fc");
        expect(
            ["S", "A2", "A", "B2", "C"].map((rank) =>
                playTier({ fcType: 0, rank })
            )
        ).toEqual(["S", "A+", "A", "B", "B"]);
    });
});

describe("profile activity", () => {
    beforeEach(() => vi.clearAllMocks());
    it("reads play times as Korean dates", () => {
        expect(playDay("2026/09/19 01:01")).toBe("2026-09-19");
        expect(playDay("2026-09-18T16:30:00Z")).toBe("2026-09-19");
        expect(playDay("bad")).toBeNull();
    });
    it("fills 53 weeks from a Sunday to today and summarises year, month, days played and the longest streak", async () => {
        mocks.history.mockResolvedValue(
            [
                "2026/09/24 20:00",
                "2026/09/24 21:00",
                "2026/09/25 20:00",
                "2026/09/26 08:00",
                "2026/08/30 10:00",
                "2024/01/01 10:00",
            ].map((time) => ({
                playedAt: new Date(`${time.replaceAll("/", "-")}:00+09:00`),
            }))
        );
        // 2026-09-26 (토) 12:00 KST
        const activity = await getProfileActivity(
            7,
            new Date("2026-09-26T03:00:00Z")
        );
        expect(activity.end).toBe("2026-09-26");
        expect(new Date(`${activity.start}T00:00:00Z`).getUTCDay()).toBe(0);
        expect(activity.days).toHaveLength(52 * 7 + 7);
        expect(activity.summary).toEqual({
            year: 5,
            month: 4,
            currentStreak: 3,
            longestStreak: 3,
        });
    });
    it("current streak runs back from today, or from yesterday when today has no play yet", () => {
        const days = (counts: number[]) => counts.map((count) => ({ count }));
        expect(currentStreak(days([1, 0, 2, 3, 1]))).toBe(3);
        expect(currentStreak(days([1, 2, 3, 0]))).toBe(3);
        expect(currentStreak(days([1, 0, 0]))).toBe(0);
        expect(currentStreak([])).toBe(0);
    });
});
