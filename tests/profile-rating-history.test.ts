import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ rating: vi.fn(), create: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({
    default: { userRatingHistory: { createMany: mocks.create } },
}));
vi.mock("@/features/profile/server/profilePlaysService", () => ({
    getProfileRating: mocks.rating,
}));
import { recordProfileRatings } from "@/features/profile/server/profileRatingHistoryService";

describe("profile rating observations", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("records the measured modes at the same import time without fabricating a missing mode", async () => {
        mocks.rating
            .mockResolvedValueOnce({ rating: 4123.45 })
            .mockResolvedValueOnce(null);
        const before = Date.now();
        await recordProfileRatings(7, 12);
        const options = mocks.create.mock.calls[0][0];
        expect(options.skipDuplicates).toBe(true);
        expect(options.data).toHaveLength(1);
        expect(options.data[0]).toMatchObject({
            user_id: 7,
            sync_id: 12,
            mode: "basic",
            rating: 4123.45,
        });
        expect(options.data[0].observed_at.getTime()).toBeGreaterThanOrEqual(
            before
        );
        expect(options.data[0].observed_at.getTime()).toBeLessThanOrEqual(
            Date.now()
        );
    });

    it("does not manufacture zero history when both rating bases are unavailable", async () => {
        mocks.rating.mockResolvedValue(null);
        await recordProfileRatings(7, 12);
        expect(mocks.create).not.toHaveBeenCalled();
    });

    it("propagates a write failure so an incomplete import cannot claim full completion", async () => {
        mocks.rating.mockResolvedValue({ rating: 200 });
        mocks.create.mockRejectedValue(new Error("storage unavailable"));
        await expect(recordProfileRatings(7, 12)).rejects.toThrow(
            "storage unavailable"
        );
    });
});
