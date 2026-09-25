import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    charts: vi.fn(),
    plays: vi.fn(),
    history: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({
    default: {
        musicChart: { groupBy: mocks.charts },
        playData: { findMany: mocks.plays },
        chartPlayHistory: { findMany: mocks.history },
    },
}));

import {
    getProfileStats,
    playTier,
} from "@/features/profile/server/profileStatsService";
import {
    getProfileActivity,
    playDay,
} from "@/features/profile/server/profileActivityService";

function play(
    difficulty: string,
    level: number,
    values: Partial<{
        rank: string;
        fc_type: number;
        clear_count: number | null;
        note_rate_trill: number | null;
    }> = {}
) {
    return {
        rank: "S",
        fc_type: 0,
        clear_count: 1,
        judge_sjust: 90,
        judge_just: 5,
        judge_good: 3,
        judge_near: 0,
        judge_miss: 2,
        note_rate_standard: 9800,
        note_rate_tenuto: null,
        note_rate_glissando: null,
        note_rate_trill: null,
        chart: { difficulty, level },
        ...values,
    };
}

describe("profile stats", () => {
    beforeEach(() => vi.clearAllMocks());
    it("one bar: Pianist > FC > rank, a failed play goes to its rank", () => {
        expect(playTier({ fc_type: 3, rank: "S" })).toBe("pianist");
        expect(playTier({ fc_type: 0, rank: "P" })).toBe("pianist");
        expect(playTier({ fc_type: 2, rank: "A" })).toBe("fc");
        expect(
            ["S", "A2", "A", "B2", "C"].map((rank) =>
                playTier({ fc_type: 0, rank })
            )
        ).toEqual(["S", "A+", "A", "B", "B"]);
    });
    it("counts one-bar groups per difficulty level against every listed chart, REAL rows last", async () => {
        mocks.charts.mockResolvedValue([
            { difficulty: "Real", level: 3, _count: { _all: 4 } },
            { difficulty: "Expert", level: 12, _count: { _all: 10 } },
        ]);
        mocks.plays.mockResolvedValue([
            play("Expert", 12, { fc_type: 3, rank: "P" }),
            play("Expert", 12, { fc_type: 2, note_rate_trill: 9000 }),
            play("Expert", 12, { clear_count: 0, rank: "A2" }),
            play("Real", 3, { note_rate_trill: 10000 }),
        ]);
        const stats = await getProfileStats(7);
        expect(
            stats.levels.map((row) => `${row.difficulty}:${row.level}`)
        ).toEqual(["expert:12", "real:3"]);
        expect(stats.levels[0]).toMatchObject({
            total: 10,
            tiers: { pianist: 1, fc: 1, S: 0, "A+": 1, A: 0, B: 0 },
        });
        expect(stats.judgement.chartCount).toBe(4);
        expect(stats.judgement.counts.sjust).toBe(360);
        expect(stats.played).toBe(4);
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
            ].map((source_play_time) => ({ source_play_time }))
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
            activeDays: 4,
            longestStreak: 3,
        });
    });
});
