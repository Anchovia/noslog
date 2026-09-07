import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    user: vi.fn(),
    plays: vi.fn(),
    recent: vi.fn(),
    basis: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({
    default: {
        user: { findUnique: mocks.user },
        playData: { findMany: mocks.plays },
        chartPlayHistory: { findMany: mocks.recent },
    },
}));
vi.mock("@/features/tiers/server/tierBrowserData", () => ({
    getModePianistRatingBasis: mocks.basis,
}));

import { getPublicProfilePlays } from "@/features/profile/server/profilePlaysService";
import { profileListQuerySchema } from "@/features/profile/schemas/publicProfileSchema";

function play(id: number) {
    return {
        id,
        chart_id: id,
        music_idx: String(id),
        difficulty: "expert",
        level: 12,
        score: 940000,
        rank: "A",
        fc_type: 0,
        grade_basic: 10000,
        grade_recital: 20000,
        music: { title: `Music ${id}`, background: null },
    };
}
describe("profile incremental public plays", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.user.mockResolvedValue({ hide_play_activity: false });
        mocks.plays.mockResolvedValue([]);
        mocks.recent.mockResolvedValue([]);
        mocks.basis.mockResolvedValue({ theoreticalMax: null, entries: [] });
    });
    it("returns only five initial grade rows while retaining More and applying the active mode", async () => {
        mocks.plays.mockResolvedValue(
            Array.from({ length: 6 }, (_, index) => play(index + 1))
        );
        const result = await getPublicProfilePlays(
            7,
            profileListQuerySchema.parse({ mode: "recital" })
        );
        expect(result?.items).toHaveLength(5);
        expect(result?.hasMore).toBe(true);
        expect(result?.items[0].contribution).toBe(200);
        expect(mocks.plays).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { user_id: 7, grade_recital: { gt: 0 } },
                orderBy: [
                    { grade_recital: "desc" },
                    { score: "desc" },
                    { chart_id: "asc" },
                    { id: "asc" },
                ],
                skip: 0,
                take: 6,
            })
        );
        // Official Grd does not inherit the Rating floor.
        expect(result?.items[0].score).toBe(940000);
    });
    it("caps grade membership at fifty without retrieving a fifty-first chart", async () => {
        mocks.plays.mockResolvedValue(
            Array.from({ length: 5 }, (_, index) => play(index + 46))
        );
        const result = await getPublicProfilePlays(
            7,
            profileListQuerySchema.parse({ offset: 45 })
        );
        expect(result?.hasMore).toBe(false);
        expect(mocks.plays).toHaveBeenCalledWith(
            expect.objectContaining({ skip: 45, take: 5 })
        );
        mocks.plays.mockClear();
        expect(
            (
                await getPublicProfilePlays(
                    7,
                    profileListQuerySchema.parse({ offset: 50 })
                )
            )?.items
        ).toEqual([]);
        expect(mocks.plays).not.toHaveBeenCalled();
    });
    it("distinguishes assisted clear from Full Combo in best-play rows", async () => {
        mocks.plays.mockResolvedValue(
            [1, 2, 3].map((fc_type) => ({ ...play(fc_type), fc_type }))
        );
        const result = await getPublicProfilePlays(
            7,
            profileListQuerySchema.parse({})
        );
        expect(result?.items.map((item) => item.fullCombo)).toEqual([
            false,
            true,
            true,
        ]);
    });
    it("checks current privacy before any expanded history query", async () => {
        mocks.user.mockResolvedValue({ hide_play_activity: true });
        const result = await getPublicProfilePlays(
            7,
            profileListQuerySchema.parse({ kind: "recent", offset: 5 })
        );
        expect(result?.status).toBe("hidden");
        expect(result?.items).toEqual([]);
        expect(result?.hasMore).toBe(false);
        expect(mocks.recent).not.toHaveBeenCalled();
    });
    it("reports unavailable rating source rather than a zero-valued list", async () => {
        const result = await getPublicProfilePlays(
            7,
            profileListQuerySchema.parse({ metric: "rating" })
        );
        expect(result?.status).toBe("unavailable");
        expect(mocks.plays).not.toHaveBeenCalled();
    });
    it("sorts Rating by calculated contributions and queries only the selected five record details", async () => {
        mocks.basis.mockResolvedValue({
            theoreticalMax: 7000,
            entries: Array.from({ length: 70 }, (_, index) => ({
                chartId: index + 1,
                value: 10,
            })),
        });
        mocks.plays
            .mockResolvedValueOnce(
                Array.from({ length: 7 }, (_, index) => ({
                    chart_id: index + 1,
                    score: 950000 + index * 5000,
                }))
            )
            .mockResolvedValueOnce(
                [7, 6, 5, 4, 3].map((id) => ({
                    ...play(id),
                    score: 950000 + (id - 1) * 5000,
                }))
            );
        const result = await getPublicProfilePlays(
            7,
            profileListQuerySchema.parse({ metric: "rating", mode: "recital" })
        );
        expect(result?.items.map((item) => item.id)).toEqual([7, 6, 5, 4, 3]);
        expect(result?.hasMore).toBe(true);
        expect(mocks.plays.mock.calls[0][0].where).toEqual(
            expect.objectContaining({
                score: { gte: 950000 },
                grade_recital: { gt: 0 },
            })
        );
        expect(mocks.plays.mock.calls[1][0].where.chart_id.in).toHaveLength(5);
        expect(result!.items[0].contribution!).toBeGreaterThan(
            result!.items[1].contribution!
        );
    });
    it("rejects malformed offsets and returns missing users distinctly", async () => {
        for (const offset of [-1, 0.5, "bad", 100001])
            expect(profileListQuerySchema.safeParse({ offset }).success).toBe(
                false
            );
        mocks.user.mockResolvedValue(null);
        expect(
            await getPublicProfilePlays(7, profileListQuerySchema.parse({}))
        ).toBeNull();
        expect(mocks.plays).not.toHaveBeenCalled();
    });
});
