import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

interface BingoImportItem {
    sourceVersion: string;
    title: string;
    requiredLines: number;
    lineRewardNos: number;
    completionRewardNos: number;
    rewardNos: number;
    cells: { position: number; title: string }[];
}

const bingos = JSON.parse(
    fs.readFileSync(
        path.join(process.cwd(), "prisma/data/op3-bingos.json"),
        "utf8"
    )
) as BingoImportItem[];

describe("Op.3 미션 빙고 가져오기 데이터", () => {
    it("FORTE부터 Op.3까지 44개 빙고를 포함한다", () => {
        const counts = Object.groupBy(bingos, (bingo) => bingo.sourceVersion);

        expect(bingos).toHaveLength(44);
        expect(counts.FORTE).toHaveLength(10);
        expect(counts["Op.2"]).toHaveLength(7);
        expect(counts["Op.3"]).toHaveLength(27);
        expect(new Set(bingos.map((bingo) => bingo.title)).size).toBe(44);
    });

    it("모든 빙고가 1부터 25까지의 미션을 한 번씩 가진다", () => {
        for (const bingo of bingos) {
            expect(bingo.cells, bingo.title).toHaveLength(25);
            expect(
                bingo.cells.map((cell) => cell.position).sort((a, b) => a - b),
                bingo.title
            ).toEqual(Array.from({ length: 25 }, (_, index) => index + 1));
            expect(
                bingo.cells.every((cell) => cell.title.trim().length > 0),
                bingo.title
            ).toBe(true);
        }
    });

    it("모든 빙고가 유효한 해금 줄과 보상 정보를 가진다", () => {
        for (const bingo of bingos) {
            expect(bingo.requiredLines, bingo.title).toBeGreaterThan(0);
            expect(bingo.requiredLines, bingo.title).toBeLessThanOrEqual(12);
            expect(bingo.lineRewardNos, bingo.title).toBeGreaterThan(0);
            expect(bingo.completionRewardNos, bingo.title).toBeGreaterThan(0);
            expect(bingo.rewardNos, bingo.title).toBeGreaterThan(0);
        }
    });
});
