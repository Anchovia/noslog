import { describe, expect, it } from "vitest";

import {
    filterBingoMissions,
    getBingoCellLabel,
    getBingoLineCoordinates,
    getBingoMissionLink,
} from "@/components/bingo/plate/bingoPlateUtils";
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

describe("빙고판 UI 계산", () => {
    const cells = [
        {
            id: 10,
            challenge: "악곡 플레이",
            missionType: "music",
            musicIndex: "music-index",
            position: 1,
            categoryShort: null,
        },
        {
            id: 20,
            challenge: "BM 플레이",
            missionType: "category",
            musicIndex: null,
            position: 2,
            categoryShort: "var · variety",
        },
    ];

    it("빙고 위치를 A1부터 E5까지 표시한다", () => {
        expect(getBingoCellLabel(1)).toBe("A1");
        expect(getBingoCellLabel(13)).toBe("C3");
        expect(getBingoCellLabel(25)).toBe("E5");
    });

    it("완성 줄의 시작점과 끝점 좌표를 계산한다", () => {
        expect(getBingoLineCoordinates([1, 2, 3, 4, 5])).toEqual({
            x1: 0.5,
            y1: 0.5,
            x2: 4.5,
            y2: 0.5,
        });
        expect(getBingoLineCoordinates([1, 7, 13, 19, 25])).toEqual({
            x1: 0.5,
            y1: 0.5,
            x2: 4.5,
            y2: 4.5,
        });
    });

    it("악곡과 카테고리 미션 링크를 현재 검색 규격으로 만든다", () => {
        expect(getBingoMissionLink(cells[0])).toBe("/music/music-index/normal");
        expect(getBingoMissionLink(cells[1])).toBe("/music?categories=Var");
    });

    it("선택한 상태에 맞는 미션만 반환한다", () => {
        expect(
            filterBingoMissions(cells, new Set([10]), new Set([2]), "completed")
        ).toEqual([cells[0]]);
        expect(
            filterBingoMissions(cells, new Set([10]), new Set([2]), "rich")
        ).toEqual([cells[1]]);
    });
});
