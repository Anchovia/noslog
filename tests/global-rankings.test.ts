import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    users: vi.fn(),
    records: vi.fn(),
    basis: vi.fn(),
}));
vi.mock("next/cache", () => ({
    unstable_cache: (callback: unknown) => callback,
}));
vi.mock("@/lib/db", () => ({
    default: {
        user: { findMany: mocks.users },
        playData: { findMany: mocks.records },
    },
}));
vi.mock("@/features/tiers/server/tierBrowserData", () => ({
    getModePianistRatingBasis: mocks.basis,
}));
import { getGlobalRankingPage } from "@/features/rankings/server/globalRankingData";
import {
    parseGlobalRankingQuery,
    serializeGlobalRankingQuery,
} from "@/features/rankings/schemas/globalRankingSchema";
import type { GlobalRankingQuery } from "@/features/rankings/schemas/globalRankingSchema";
import { BASIC_RATING_TOP_COUNT } from "@/lib/tiers/basicRating";

const query: GlobalRankingQuery = {
    mode: "basic",
    metric: "grade",
    region: "all",
    page: 1,
};
const users = Array.from({ length: 29 }, (_, index) => ({
    id: index + 1,
    username: `Player ${index + 1}`,
    avatar: null,
    country: index < 27 ? "ko-KR" : index === 27 ? "ja-JP" : "global",
    grade_basic:
        index === 0
            ? 600_000
            : index === 28
              ? 0
              : index === 27
                ? 400_000
                : 500_049 - index,
    grade_recital: 450_000,
    exam_basic: 2,
    exam_recital: 3,
}));

beforeEach(() => {
    vi.resetAllMocks();
    mocks.users.mockResolvedValue(users.filter((user) => user.grade_basic > 0));
    mocks.records.mockResolvedValue([]);
    mocks.basis.mockResolvedValue({
        entries: Array.from({ length: 70 }, (_, index) => ({
            chartId: index + 1,
            value: 14.5,
        })),
        theoreticalMax: 70 * 14.5 ** 2,
    });
});

describe("Basic NosLog rating population", () => {
    beforeEach(() => {
        mocks.users.mockResolvedValue([
            users[0],
            { ...users[1], country: "ja-JP" },
        ]);
        mocks.records.mockResolvedValue([
            ...Array.from({ length: BASIC_RATING_TOP_COUNT }, (_, index) => ({
                user_id: 1,
                chart_id: index + 1,
                score: 1_000_000,
            })),
            { user_id: 2, chart_id: 1, score: 990_000 },
        ]);
    });

    it("calculates the top songs from the current published Pianist basis", async () => {
        const page = await getGlobalRankingPage(
            { ...query, metric: "rating" },
            null
        );
        expect(mocks.basis).toHaveBeenCalledWith("basic");
        expect(page.totalCount).toBe(2);
        expect(page.rows[0]).toMatchObject({
            id: 1,
            rank: 1,
            value: 10000,
            rating: 10000,
            filledSlots: BASIC_RATING_TOP_COUNT,
        });
        expect(page.rows[1]).toMatchObject({
            id: 2,
            rank: 2,
            value: 103,
            rating: 103,
            filledSlots: 1,
        });
    });

    it("recalculates rating rank within the selected region", async () => {
        const page = await getGlobalRankingPage(
            { ...query, metric: "rating", region: "jp" },
            null
        );
        expect(page.totalCount).toBe(1);
        expect(page.rows[0]).toMatchObject({ id: 2, rank: 1, rating: 103 });
    });
});

describe("global ranking contract", () => {
    it("normalizes malformed URL values and keeps Recital Rating", () => {
        expect(
            parseGlobalRankingQuery(
                new URLSearchParams("mode=other&metric=no&region=bad&page=1x")
            )
        ).toEqual(query);
        for (const page of [
            "0",
            "-1",
            "NaN",
            "Infinity",
            "1.2",
            "9007199254740992",
        ])
            expect(
                parseGlobalRankingQuery(new URLSearchParams({ page })).page
            ).toBe(1);
        const recital = {
            ...query,
            mode: "recital" as const,
            metric: "rating" as const,
            region: "jp" as const,
            page: 2,
        };
        expect(
            parseGlobalRankingQuery(serializeGlobalRankingQuery(recital))
        ).toEqual(recital);
        expect(serializeGlobalRankingQuery(query).has("metric")).toBe(false);
    });
    it("shares published Grd across page boundaries and finds the containing row rather than its shared rank", async () => {
        const first = await getGlobalRankingPage(query, 27);
        const second = await getGlobalRankingPage({ ...query, page: 2 }, 27);
        expect(first.rows).toHaveLength(25);
        expect(first.rows[0]).toMatchObject({ id: 1, rank: 1, value: 6000 });
        expect(first.rows.at(-1)).toMatchObject({ rank: 2, value: 5000 });
        expect(second.rows.map((row) => row.rank)).toEqual([2, 2, 28]);
        expect(first.currentUser).toMatchObject({ id: 27, rank: 2, page: 2 });
        expect(first.rows[0]).not.toHaveProperty("rawValue");
    });
    it("recalculates region rank and suppresses ineligible personal positions", async () => {
        expect(
            await getGlobalRankingPage({ ...query, region: "jp" }, 1)
        ).toMatchObject({
            totalCount: 1,
            currentUser: null,
            rows: [{ id: 28, rank: 1 }],
        });
        expect(
            await getGlobalRankingPage({ ...query, region: "global" }, 1)
        ).toMatchObject({ totalCount: 0, currentUser: null, rows: [] });
        expect(
            (await getGlobalRankingPage(query, null)).currentUser
        ).toBeNull();
    });
    it("clamps pages to the last valid page and preserves a one-page empty population", async () => {
        expect(
            await getGlobalRankingPage({ ...query, page: 200 }, null)
        ).toMatchObject({ page: 2, query: { page: 2 } });
        mocks.users.mockResolvedValue([]);
        expect(
            await getGlobalRankingPage({ ...query, page: 200 }, null)
        ).toMatchObject({ page: 1, totalCount: 0, status: "available" });
    });
    it("uses each mode's Pianist basis and requires a Recital record for Recital Rating", async () => {
        mocks.users.mockResolvedValue(users.slice(0, 2));
        mocks.records.mockResolvedValue([
            { user_id: 1, chart_id: 1, score: 990_000 },
            { user_id: 2, chart_id: 1, score: 990_001 },
        ]);
        const result = await getGlobalRankingPage(
            { ...query, mode: "recital", metric: "rating" },
            1
        );
        expect(mocks.basis).toHaveBeenCalledWith("recital");
        expect(mocks.records.mock.calls[0][0].where.grade_recital).toEqual({
            gt: 0,
        });
        expect(
            result.rows.map((row) => [row.id, row.rank, row.value, row.exam])
        ).toEqual([
            [2, 1, 103, 3],
            [1, 1, 103, 3],
        ]);
        expect(result.currentUser?.rank).toBe(1);
    });
    it("distinguishes unavailable source from a valid source without eligible players", async () => {
        mocks.basis.mockResolvedValueOnce({
            entries: [],
            theoreticalMax: null,
        });
        expect(
            await getGlobalRankingPage({ ...query, metric: "rating" }, 1)
        ).toMatchObject({ status: "unavailable", rows: [], totalCount: 0 });
        expect(mocks.records).not.toHaveBeenCalled();
        expect(
            await getGlobalRankingPage({ ...query, metric: "rating" }, 1)
        ).toMatchObject({ status: "available", rows: [], totalCount: 0 });
    });
    it("rejects invalid published constants instead of repairing the source", async () => {
        mocks.basis.mockResolvedValue({
            entries: [{ chartId: 1, value: -1 }],
            theoreticalMax: 1000,
        });
        expect(
            (await getGlobalRankingPage({ ...query, metric: "rating" }, null))
                .status
        ).toBe("unavailable");
        expect(mocks.records).not.toHaveBeenCalled();
    });
});
