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

    it("parses comma lists and rejects unknown values", () => {
        const query = profileRecordsQuerySchema.parse({
            difficulty: "real,expert",
            rank: "P,S",
        });
        expect(query.difficulty).toEqual(["real", "expert"]);
        expect(query.rank).toEqual(["P", "S"]);
        expect(
            profileRecordsQuerySchema.safeParse({ difficulty: "extreme" })
                .success
        ).toBe(false);
    });

    it("keeps best membership to fifty and applies conditions inside it with best positions", async () => {
        mocks.findMany
            .mockResolvedValueOnce([{ id: 11 }, { id: 12 }, { id: 13 }])
            .mockResolvedValueOnce([play(13), play(11)]);
        mocks.count.mockResolvedValue(2);
        mocks.ranks.mockResolvedValue([{ id: 13, position: 4 }]);
        const result = await getPublicProfileRecords(
            7,
            profileRecordsQuerySchema.parse({
                view: "best",
                difficulty: "real",
                lamp: "fullCombo",
                q: "moon",
                sort: "score",
            })
        );
        expect(mocks.findMany.mock.calls[0][0]).toMatchObject({
            where: { user_id: 7, grade_basic: { gt: 0 } },
            take: 50,
        });
        const where = mocks.findMany.mock.calls[1][0].where;
        expect(where.id).toEqual({ in: [11, 12, 13] });
        expect(where.AND).toEqual(
            expect.arrayContaining([
                { difficulty: { in: ["Real"] } },
                { OR: [{ fc_type: 2 }] },
            ])
        );
        expect(mocks.findMany.mock.calls[1][0].orderBy[0]).toEqual({
            score: "desc",
        });
        expect(result?.items.map((item) => item.position)).toEqual([3, 1]);
        expect(result?.items[0].chartRank).toBe(4);
        expect(result?.items[0].contribution).toBe(120);
        expect(result?.total).toBe(2);
        expect(result?.hasMore).toBe(false);
    });

    it("counts only when size is zero (phone filter results button)", async () => {
        mocks.count.mockResolvedValue(94);
        const result = await getPublicProfileRecords(
            7,
            profileRecordsQuerySchema.parse({ view: "all", size: 0 })
        );
        expect(mocks.findMany).not.toHaveBeenCalled();
        expect(result?.total).toBe(94);
        expect(result?.items).toEqual([]);
    });

    it("treats the never-played placeholder time as no date", () => {
        expect(recordPlayedAt("1970-01-01 09:00")).toBeNull();
        expect(recordPlayedAt(" 2025-03-13 20:34 ")).toBe("2025-03-13 20:34");
        expect(recordPlayedAt("")).toBeNull();
    });
});
