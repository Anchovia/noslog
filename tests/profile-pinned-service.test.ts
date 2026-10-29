import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    user: vi.fn(),
    pins: vi.fn(),
    plays: vi.fn(),
    count: vi.fn(),
    deleteMany: vi.fn(),
    createMany: vi.fn(),
    transaction: vi.fn(),
    ranks: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({
    default: {
        user: { findUnique: mocks.user },
        userPinnedRecord: {
            findMany: mocks.pins,
            deleteMany: mocks.deleteMany,
            createMany: mocks.createMany,
        },
        playData: { findMany: mocks.plays, count: mocks.count },
        $transaction: mocks.transaction,
        $queryRaw: mocks.ranks,
    },
}));

import { pinnedRecordsValueSchema } from "@/features/profile/schemas/pinned-record-schema";
import {
    getProfilePinnedRecords,
    setPinnedRecords,
} from "@/features/profile/server/profile-pinned-service";

function play(chart: number) {
    return {
        id: chart * 10,
        chartId: chart,
        level: 3,
        score: 950000,
        rank: "S",
        fcType: 2,
        bestAt: new Date("2026-09-12T12:00:00Z"),
        chart: {
            musicIdx: `m${chart}`,
            difficulty: "Real",
            music: { title: `Song ${chart}`, background: null },
        },
    };
}

describe("profile pinned records", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.user.mockResolvedValue({ hidePlayActivity: false });
        mocks.ranks.mockResolvedValue([]);
        mocks.transaction.mockResolvedValue([]);
    });
    it("form value = JSON in pick order, at most three distinct charts, notes trimmed to 80", () => {
        expect(pinnedRecordsValueSchema.parse("")).toEqual([]);
        expect(
            pinnedRecordsValueSchema.parse(
                JSON.stringify([
                    { chartId: 3, comment: "  처음   985k  " },
                    { chartId: 1, comment: "" },
                ])
            )
        ).toEqual([
            { chartId: 3, comment: "처음 985k" },
            { chartId: 1, comment: null },
        ]);
        for (const bad of [
            "{",
            JSON.stringify([
                { chartId: 1, comment: null },
                { chartId: 1, comment: null },
            ]),
            JSON.stringify(
                [1, 2, 3, 4].map((chartId) => ({ chartId, comment: null }))
            ),
            JSON.stringify([{ chartId: 1, comment: "a".repeat(81) }]),
            JSON.stringify([{ chartId: -1, comment: null }]),
        ])
            expect(pinnedRecordsValueSchema.safeParse(bad).success).toBe(false);
    });
    it("shows the chosen charts' current records in pinned order with notes", async () => {
        mocks.pins.mockResolvedValue([
            { chartId: 2, comment: "좋아하는 곡" },
            { chartId: 1, comment: null },
            { chartId: 9, comment: "기록이 사라진 채보" },
        ]);
        mocks.plays.mockResolvedValue([play(1), play(2)]);
        const result = await getProfilePinnedRecords(7);
        expect(result.auto).toBe(false);
        expect(result.items.map((item) => [item.title, item.comment])).toEqual([
            ["Song 2", "좋아하는 곡"],
            ["Song 1", null],
        ]);
    });
    it("플레이 활동을 숨긴 사람의 고정 기록은 남에게 달성일 없이, 본인에게는 그대로", async () => {
        mocks.user.mockResolvedValue({ hidePlayActivity: true });
        mocks.pins.mockResolvedValue([{ chartId: 1, comment: null }]);
        mocks.plays.mockResolvedValue([play(1)]);
        const other = await getProfilePinnedRecords(7);
        expect(other.items[0].playedAt).toBeNull();
        expect(other.items[0].score).toBe(950000);
        mocks.user.mockClear();
        const owner = await getProfilePinnedRecords(7, { owner: true });
        expect(owner.items[0].playedAt).toBe("2026-09-12 21:00");
        expect(mocks.user).not.toHaveBeenCalled();
    });
    it("플레이 활동이 공개면 남에게도 고정 기록 달성일을 준다", async () => {
        mocks.pins.mockResolvedValue([]);
        mocks.plays.mockResolvedValue([play(5)]);
        const result = await getProfilePinnedRecords(7);
        expect(result.items[0].playedAt).toBe("2026-09-12 21:00");
    });
    it("falls back to the Basic best top three when nothing is pinned", async () => {
        mocks.pins.mockResolvedValue([]);
        mocks.plays.mockResolvedValue([play(5), play(6), play(7)]);
        const result = await getProfilePinnedRecords(7);
        expect(result.auto).toBe(true);
        expect(result.items).toHaveLength(3);
        expect(mocks.plays).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { userId: 7, gradeBasic: { gt: 0 } },
                take: 3,
            })
        );
    });
    it("saves only charts the player has a score on, replacing the whole set", async () => {
        mocks.count.mockResolvedValue(1);
        expect(
            await setPinnedRecords(7, [
                { chartId: 1, comment: null },
                { chartId: 2, comment: "x" },
            ])
        ).toEqual({ status: "not-played" });
        expect(mocks.transaction).not.toHaveBeenCalled();
        mocks.count.mockResolvedValue(2);
        expect(
            await setPinnedRecords(7, [
                { chartId: 1, comment: null },
                { chartId: 2, comment: "x" },
            ])
        ).toEqual({ status: "ok" });
        expect(mocks.createMany).toHaveBeenCalledWith({
            data: [
                { userId: 7, chartId: 1, position: 1, comment: null },
                { userId: 7, chartId: 2, position: 2, comment: "x" },
            ],
        });
        expect(await setPinnedRecords(7, [])).toEqual({ status: "ok" });
        expect(mocks.createMany).toHaveBeenLastCalledWith({ data: [] });
    });
});
