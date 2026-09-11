import { describe, expect, it } from "vitest";
import {
    getBingoCatalog,
    getRecentBingo,
} from "@/features/bingos/bingoCatalog";
import {
    bingoCatalogQuerySchema,
    type BingoCatalogItem,
} from "@/features/bingos/schemas/publicBingoSchema";

const board = (id: number, cells: number, lines: number): BingoCatalogItem => ({
    id,
    title: `Bingo ${id}`,
    musicIndex: "music",
    background: null,
    sourceVersion: "FORTE",
    rewardNos: 6000,
    requiredLines: 2,
    completedPositions: Array.from({ length: cells }, (_, i) => i + 1),
    completedLines: lines,
    chanceLines: 0,
    lastModifiedAt: null,
});
describe("Bingo catalog truth and restoration", () => {
    it("distinguishes unlock from full-board completion", () => {
        const items = [
            board(1, 0, 0),
            board(2, 4, 0),
            board(3, 10, 2),
            board(4, 25, 12),
        ];
        const query = bingoCatalogQuerySchema.parse({});
        expect(
            getBingoCatalog(items, { ...query, status: "progress" }).map(
                (item) => item.id
            )
        ).toEqual([2]);
        expect(
            getBingoCatalog(items, { ...query, status: "unlocked" }).map(
                (item) => item.id
            )
        ).toEqual([3]);
        expect(
            getBingoCatalog(items, { ...query, status: "full" }).map(
                (item) => item.id
            )
        ).toEqual([4]);
    });
    it("drops a cleared board from recent records without hiding completed boards", () => {
        const items = [
            { ...board(1, 25, 12), lastModifiedAt: "2026-09-06T10:00:00Z" },
            { ...board(2, 0, 0), lastModifiedAt: "2026-09-07T10:00:00Z" },
        ];
        expect(getRecentBingo(items)?.id).toBe(1);
    });
    it("restores supported filters and stable ordering", () => {
        // 옛 공유 주소의 count 는 버린다 — 목록은 항상 전부 보인다
        expect(
            bingoCatalogQuerySchema.parse({
                status: "ended",
                sort: "unknown",
                count: 24,
            })
        ).toEqual({ status: "all", sort: "release" });
        expect(
            getBingoCatalog([board(1, 1, 0), board(2, 1, 0)], {
                status: "all",
                sort: "progress",
            }).map((item) => item.id)
        ).toEqual([1, 2]);
    });
});
