import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    user: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    ranks: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({
    default: {
        user: { findUnique: mocks.user },
        playData: { findMany: mocks.findMany, count: mocks.count },
        $queryRaw: mocks.ranks,
    },
}));

import {
    getPublicProfileRecords,
    recordPlayedAt,
} from "@/features/profile/server/profileRecordsService";
import { profileRecordsQuerySchema } from "@/features/profile/schemas/publicProfileSchema";

function play(id: number) {
    return {
        id,
        music_idx: String(id),
        difficulty: "Real",
        level: 3,
        score: 970000,
        rank: "S",
        fc_type: 2,
        besttime: "2026-09-19 01:01",
        grade_basic: 12000,
        grade_recital: 0,
        music: { title: `Music ${id}`, background: null },
    };
}

describe("profile records tab", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.user.mockResolvedValue({ id: 7 });
        mocks.count.mockResolvedValue(0);
        mocks.ranks.mockResolvedValue([]);
    });

    it("rejects unknown views and sorts", () => {
        expect(profileRecordsQuerySchema.parse({}).view).toBe("best");
        expect(
            profileRecordsQuerySchema.safeParse({ sort: "level" }).success
        ).toBe(false);
        expect(
            profileRecordsQuerySchema.safeParse({ view: "recent" }).success
        ).toBe(false);
    });

    it("keeps best membership to fifty, sorts inside it and keeps best positions", async () => {
        mocks.findMany
            .mockResolvedValueOnce([{ id: 11 }, { id: 12 }, { id: 13 }])
            .mockResolvedValueOnce([play(13), play(11)]);
        mocks.count.mockResolvedValue(3);
        mocks.ranks.mockResolvedValue([{ id: 13, position: 4 }]);
        const result = await getPublicProfileRecords(
            7,
            profileRecordsQuerySchema.parse({ view: "best", sort: "score" })
        );
        expect(mocks.findMany.mock.calls[0][0]).toMatchObject({
            where: { user_id: 7, grade_basic: { gt: 0 } },
            take: 50,
        });
        const second = mocks.findMany.mock.calls[1][0];
        expect(second.where).toEqual({
            user_id: 7,
            score: { gt: 0 },
            id: { in: [11, 12, 13] },
        });
        expect(second.orderBy[0]).toEqual({ score: "desc" });
        expect(second.take).toBe(20);
        expect(result?.items.map((item) => item.position)).toEqual([3, 1]);
        expect(result?.items[0].chartRank).toBe(4);
        expect(result?.items[0].contribution).toBe(120);
        expect(result?.total).toBe(3);
        expect(result?.hasMore).toBe(true);
    });

    it("lists every scored chart for all records without best positions", async () => {
        mocks.findMany.mockResolvedValueOnce([play(21)]);
        mocks.count.mockResolvedValue(1);
        const result = await getPublicProfileRecords(
            7,
            profileRecordsQuerySchema.parse({ view: "all", sort: "recent" })
        );
        expect(mocks.findMany).toHaveBeenCalledTimes(1);
        expect(mocks.findMany.mock.calls[0][0].where).toEqual({
            user_id: 7,
            score: { gt: 0 },
        });
        expect(mocks.findMany.mock.calls[0][0].orderBy[0]).toEqual({
            besttime: "desc",
        });
        expect(result?.items[0].position).toBeNull();
    });

    it("treats the never-played placeholder time as no date", () => {
        expect(recordPlayedAt("1970-01-01 09:00")).toBeNull();
        expect(recordPlayedAt(" 2025-03-13 20:34 ")).toBe("2025-03-13 20:34");
        expect(recordPlayedAt("")).toBeNull();
    });
});
