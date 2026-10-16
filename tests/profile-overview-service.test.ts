import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
    record: vi.fn(),
    sync: vi.fn(),
    standing: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({
    default: {
        playData: { findFirst: mocks.record },
        dataSync: { findFirst: mocks.sync },
    },
}));
vi.mock("@/features/rankings/server/global-ranking-data", () => ({
    getProfileRatingStanding: mocks.standing,
}));
import {
    getProfileHeaderContext,
    getProfileOverviewContext,
} from "@/features/profile/server/profile-overview-service";

describe("profile overview", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        mocks.record.mockResolvedValue(null);
        mocks.sync.mockResolvedValue(null);
        mocks.standing.mockResolvedValue(null);
    });
    it("asks only whether any played record exists", async () => {
        mocks.record.mockResolvedValue({ id: 1 });
        expect(await getProfileOverviewContext(7)).toEqual({
            hasRecords: true,
        });
        expect(mocks.record).toHaveBeenCalledWith({
            where: { userId: 7, playCount: { gt: 0 } },
            select: { id: true },
        });
        mocks.record.mockResolvedValue(null);
        expect(await getProfileOverviewContext(7)).toEqual({
            hasRecords: false,
        });
    });
    it("never reads owner sync state for visitors", async () => {
        const result = await getProfileHeaderContext(7, false);
        expect(result.sync).toBeNull();
        expect(mocks.sync).not.toHaveBeenCalled();
        expect(mocks.standing).toHaveBeenCalledTimes(2);
    });
    it("maps partial imports to owner-safe status without exposing technical error text", async () => {
        mocks.sync.mockResolvedValue({
            status: "completed",
            startedAt: new Date("2026-09-07T00:00:00Z"),
            completedAt: new Date("2026-09-07T00:01:00Z"),
            errorMessage: "private-import-details",
        });
        const result = await getProfileHeaderContext(7, true);
        expect(result.sync?.status).toBe("partial");
        expect(JSON.stringify(result)).not.toContain("private-import-details");
    });
});
