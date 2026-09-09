import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
    rating: vi.fn(),
    records: vi.fn(),
    sync: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({
    default: {
        playData: { findMany: mocks.records },
        dataSync: { findFirst: mocks.sync },
    },
}));
vi.mock("@/features/profile/server/profilePlaysService", () => ({
    getProfileRating: mocks.rating,
}));
import { getProfileOverviewContext } from "@/features/profile/server/profileOverviewService";

describe("profile overview", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        mocks.rating.mockResolvedValue(null);
        mocks.records.mockResolvedValue([]);
        mocks.sync.mockResolvedValue(null);
    });
    it("publicly aggregates complete judgements while excluding incomplete charts and never reading owner sync state", async () => {
        mocks.records.mockResolvedValue([
            {
                judge_sjust: 90,
                judge_just: 5,
                judge_good: 3,
                judge_near: 1,
                judge_miss: 1,
            },
            {
                judge_sjust: 30,
                judge_just: 0,
                judge_good: 0,
                judge_near: 0,
                judge_miss: null,
            },
            {
                judge_sjust: 0,
                judge_just: 0,
                judge_good: 0,
                judge_near: 0,
                judge_miss: 0,
            },
        ]);
        const result = await getProfileOverviewContext(7, false);
        expect(result.judgement).toEqual({
            counts: { sjust: 90, just: 5, good: 3, near: 1, miss: 1 },
            chartCount: 1,
        });
        expect(result.hasRecords).toBe(true);
        expect(result.sync).toBeNull();
        expect(mocks.sync).not.toHaveBeenCalled();
    });
    it("maps partial imports to owner-safe status without exposing technical error text", async () => {
        mocks.sync.mockResolvedValue({
            status: "completed",
            started_at: new Date("2026-09-07T00:00:00Z"),
            completed_at: new Date("2026-09-07T00:01:00Z"),
            error_message: "private-import-details",
        });
        const result = await getProfileOverviewContext(7, true);
        expect(result.sync?.status).toBe("partial");
        expect(JSON.stringify(result)).not.toContain("private-import-details");
    });
});
