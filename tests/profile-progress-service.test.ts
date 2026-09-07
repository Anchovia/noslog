import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    user: vi.fn(),
    grades: vi.fn(),
    history: vi.fn(),
    rating: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({
    default: {
        user: { findUnique: mocks.user },
        userBestGrade: { findMany: mocks.grades },
        userRatingHistory: { findMany: mocks.history },
    },
}));
vi.mock("@/features/profile/server/profilePlaysService", () => ({
    getProfileRating: mocks.rating,
}));
import { getPublicProfileProgress } from "@/features/profile/server/profileProgressService";
import { profileProgressQuerySchema } from "@/features/profile/schemas/publicProfileSchema";

describe("profile progress sources", () => {
    const now = new Date("2026-09-07T12:00:00Z");
    beforeEach(() => {
        vi.resetAllMocks();
        mocks.user.mockResolvedValue({ grade_basic: 568300, grade_recital: 0 });
        mocks.grades.mockResolvedValue([]);
        mocks.history.mockResolvedValue([]);
        mocks.rating.mockResolvedValue(null);
    });
    it("keeps current value separate when no historical observation exists", async () => {
        const result = await getPublicProfileProgress(
            1,
            profileProgressQuerySchema.parse({}),
            now
        );
        expect(result).toMatchObject({ current: 5683, points: [] });
    });
    it("filters the selected period in Korean calendar time and excludes absent modes and invalid dates", async () => {
        mocks.grades.mockResolvedValue([
            { besttime: "2025-08-01", grade_basic: 100, grade_recital: 0 },
            { besttime: "2026-08-20", grade_basic: 568301, grade_recital: 0 },
            { besttime: "invalid", grade_basic: 600000, grade_recital: 0 },
            { besttime: "2026-10-01", grade_basic: 700000, grade_recital: 0 },
        ]);
        const query = profileProgressQuerySchema.parse({ range: "30" });
        expect((await getPublicProfileProgress(1, query, now))?.points).toEqual(
            [{ date: "2026-08-19T15:00:00.000Z", value: 5683.01 }]
        );
        expect(
            (
                await getPublicProfileProgress(
                    1,
                    { ...query, mode: "recital" },
                    now
                )
            )?.points
        ).toEqual([]);
        expect(
            (await getPublicProfileProgress(1, { ...query, range: "all" }, now))
                ?.points
        ).toHaveLength(2);
    });
    it("queries only completed rating observations and never turns unavailable basis into zero", async () => {
        const result = await getPublicProfileProgress(
            1,
            profileProgressQuerySchema.parse({
                metric: "rating",
                range: "year",
            }),
            now
        );
        expect(result).toMatchObject({
            status: "unavailable",
            current: null,
            points: [],
        });
        expect(mocks.history).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    user_id: 1,
                    mode: "basic",
                    sync: { status: "completed" },
                    observed_at: {
                        gte: new Date("2025-09-07T12:00:00Z"),
                        lte: now,
                    },
                },
            })
        );
    });
    it("preserves observed rating values even when today's constants change the current rating", async () => {
        mocks.rating.mockResolvedValue({ rating: 3000.25 });
        mocks.history.mockResolvedValue([
            { observed_at: new Date("2026-09-01T01:23:00Z"), rating: 2900.5 },
        ]);
        const result = await getPublicProfileProgress(
            1,
            profileProgressQuerySchema.parse({ metric: "rating" }),
            now
        );
        expect(result).toMatchObject({
            current: 3000.25,
            points: [{ date: "2026-09-01T01:23:00.000Z", value: 2900.5 }],
        });
    });
    it("keeps the final Korean-day observation and preserves plateau boundaries", async () => {
        mocks.rating.mockResolvedValue({ rating: 2100 });
        mocks.history.mockResolvedValue([
            { observed_at: new Date("2026-08-31T16:00:00Z"), rating: 1900 },
            { observed_at: new Date("2026-09-01T10:00:00Z"), rating: 2000 },
            { observed_at: new Date("2026-09-02T10:00:00Z"), rating: 2000 },
            { observed_at: new Date("2026-09-03T10:00:00Z"), rating: 2000 },
            { observed_at: new Date("2026-09-04T10:00:00Z"), rating: 2100 },
        ]);
        const result = await getPublicProfileProgress(
            1,
            profileProgressQuerySchema.parse({ metric: "rating" }),
            now
        );
        expect(result?.points).toEqual([
            { date: "2026-09-01T10:00:00.000Z", value: 2000 },
            { date: "2026-09-03T10:00:00.000Z", value: 2000 },
            { date: "2026-09-04T10:00:00.000Z", value: 2100 },
        ]);
    });
    it("rejects unsupported periods and stops before history queries for missing users", async () => {
        expect(
            profileProgressQuerySchema.safeParse({ range: "7" }).success
        ).toBe(false);
        mocks.user.mockResolvedValue(null);
        expect(
            await getPublicProfileProgress(
                1,
                profileProgressQuerySchema.parse({}),
                now
            )
        ).toBeNull();
        expect(mocks.grades).not.toHaveBeenCalled();
    });
});
