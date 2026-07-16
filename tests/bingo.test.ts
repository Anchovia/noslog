import { describe, expect, it } from "vitest";

import { getBingoProgress } from "@/lib/bingo";

function board(completedPositions: number[]) {
    const completed = new Set(completedPositions);
    return Array.from({ length: 25 }, (_, index) => ({
        id: index + 1,
        position: index + 1,
        isCompleted: completed.has(index + 1),
    }));
}

describe("getBingoProgress", () => {
    it("빈 빙고판의 진행률을 0으로 계산한다", () => {
        const result = getBingoProgress(board([]));

        expect(result.completedCells).toBe(0);
        expect(result.completedLines).toBe(0);
        expect(result.richLines).toBe(0);
        expect(result.progressPercent).toBe(0);
    });

    it("가로 한 줄을 완성하면 완성 줄로 계산한다", () => {
        const result = getBingoProgress(board([1, 2, 3, 4, 5]));

        expect(result.completedLines).toBe(1);
        expect(result.completedLinePositions).toContainEqual([1, 2, 3, 4, 5]);
        expect(result.progressPercent).toBe(20);
    });

    it("한 칸만 남은 줄의 위치를 리치 칸으로 반환한다", () => {
        const result = getBingoProgress(board([1, 2, 3, 4]));

        expect(result.richLines).toBe(1);
        expect(result.richPositions).toEqual(new Set([5]));
    });

    it("25칸을 모두 채우면 12줄과 100%를 반환한다", () => {
        const result = getBingoProgress(
            board(Array.from({ length: 25 }, (_, index) => index + 1))
        );

        expect(result.completedCells).toBe(25);
        expect(result.completedLines).toBe(12);
        expect(result.progressPercent).toBe(100);
    });
});
