import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
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

import { pinnedRecordsValueSchema } from "@/features/profile/schemas/pinnedRecordSchema";
import {
    getProfilePinnedRecords,
    setPinnedRecords,
} from "@/features/profile/server/profilePinnedService";

function play(chart: number) {
    return {
        id: chart * 10,
        chart_id: chart,
        music_idx: `m${chart}`,
        difficulty: "Real",
        level: 3,
        score: 950000,
        rank: "S",
        fc_type: 2,
        besttime: "2026-09-12 21:00",
        music: { title: `Song ${chart}`, background: null },
    };
}

describe("profile pinned records", () => {
    beforeEach(() => {
        vi.clearAllMocks();
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
            { chart_id: 2, comment: "좋아하는 곡" },
            { chart_id: 1, comment: null },
            { chart_id: 9, comment: "기록이 사라진 채보" },
        ]);
        mocks.plays.mockResolvedValue([play(1), play(2)]);
        const result = await getProfilePinnedRecords(7);
        expect(result.auto).toBe(false);
        expect(result.items.map((item) => [item.title, item.comment])).toEqual([
            ["Song 2", "좋아하는 곡"],
            ["Song 1", null],
        ]);
    });
    it("falls back to the Basic best top three when nothing is pinned", async () => {
        mocks.pins.mockResolvedValue([]);
        mocks.plays.mockResolvedValue([play(5), play(6), play(7)]);
        const result = await getProfilePinnedRecords(7);
        expect(result.auto).toBe(true);
        expect(result.items).toHaveLength(3);
        expect(mocks.plays).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { user_id: 7, grade_basic: { gt: 0 } },
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
                { user_id: 7, chart_id: 1, position: 1, comment: null },
                { user_id: 7, chart_id: 2, position: 2, comment: "x" },
            ],
        });
        expect(await setPinnedRecords(7, [])).toEqual({ status: "ok" });
        expect(mocks.createMany).toHaveBeenLastCalledWith({ data: [] });
    });
});
