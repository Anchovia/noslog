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
} from "@/features/profile/server/profile-records-service";
import { profileRecordsQuerySchema } from "@/features/profile/schemas/public-profile-schema";

function play(id: number) {
    return {
        id,
        level: 3,
        score: 970000,
        rank: "S",
        fcType: 2,
        bestAt: new Date("2026-09-18T16:01:00Z"),
        gradeBasic: 12000,
        gradeRecital: 0,
        chart: {
            musicIdx: String(id),
            difficulty: "Real",
            music: { title: `Music ${id}`, background: null },
        },
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
            where: { userId: 7, gradeBasic: { gt: 0 } },
            take: 50,
        });
        const second = mocks.findMany.mock.calls[1][0];
        expect(second.where).toEqual({
            userId: 7,
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
            userId: 7,
            score: { gt: 0 },
        });
        // 최근순은 기록 시각 best_at(2026-10-16 P4), 시각 모름은 맨 뒤
        expect(mocks.findMany.mock.calls[0][0].orderBy[0]).toEqual({
            bestAt: { sort: "desc", nulls: "last" },
        });
        expect(result?.items[0].position).toBeNull();
    });

    it("플레이 활동을 숨긴 사람의 달성일은 남에게 주지 않고, 최근 달성 순은 기본 순으로 바꾼다", async () => {
        mocks.user.mockResolvedValue({ hidePlayActivity: true });
        mocks.findMany.mockResolvedValueOnce([play(21)]);
        mocks.count.mockResolvedValue(1);
        const result = await getPublicProfileRecords(
            7,
            profileRecordsQuerySchema.parse({ view: "all", sort: "recent" })
        );
        expect(mocks.findMany.mock.calls[0][0].orderBy).toEqual([
            { gradeBasic: "desc" },
            { score: "desc" },
            { chartId: "asc" },
            { id: "asc" },
        ]);
        expect(result?.query.sort).toBe("value");
        expect(result?.items[0].playedAt).toBeNull();
        expect(JSON.stringify(result)).not.toContain("2026-09-19");
    });

    it("플레이 활동을 숨겨도 본인에게는 달성일과 최근 달성 순을 그대로 준다", async () => {
        mocks.user.mockResolvedValue({ hidePlayActivity: true });
        mocks.findMany.mockResolvedValueOnce([play(21)]);
        mocks.count.mockResolvedValue(1);
        const result = await getPublicProfileRecords(
            7,
            profileRecordsQuerySchema.parse({ view: "all", sort: "recent" }),
            { owner: true }
        );
        expect(mocks.findMany.mock.calls[0][0].orderBy[0]).toEqual({
            bestAt: { sort: "desc", nulls: "last" },
        });
        expect(result?.query.sort).toBe("recent");
        expect(result?.items[0].playedAt).toBe("2026-09-19 01:01");
    });

    it("플레이 활동이 공개면 남에게도 달성일을 준다", async () => {
        mocks.user.mockResolvedValue({ hidePlayActivity: false });
        mocks.findMany
            .mockResolvedValueOnce([{ id: 11 }])
            .mockResolvedValueOnce([play(11)]);
        mocks.count.mockResolvedValue(1);
        const result = await getPublicProfileRecords(
            7,
            profileRecordsQuerySchema.parse({})
        );
        expect(result?.items[0].playedAt).toBe("2026-09-19 01:01");
    });

    it("shows the KST minute and treats an unknown record time as no date", () => {
        // 옛 「1970-01-01 09:00」 자리표시는 best_at 이 NULL(2026-10-16 P5-1)
        expect(recordPlayedAt(null)).toBeNull();
        expect(recordPlayedAt(new Date("2025-03-13T11:34:00Z"))).toBe(
            "2025-03-13 20:34"
        );
    });
});
