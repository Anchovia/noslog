import { describe, expect, it } from "vitest";

import {
    getBingoEditorCellLabel,
    getBingoEditorCellPrefix,
} from "@/features/bingos/components/bingo-editor-utils";
import { getBingoMissionLink } from "@/features/bingos/bingo-plate-utils";
import { getBingoProgress } from "@/features/bingos/bingo";

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

    it("한 칸만 남은 줄의 위치를 빙고 찬스 칸으로 반환한다", () => {
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

    it("악곡과 카테고리 미션 링크를 현재 검색 규격으로 만든다", () => {
        expect(getBingoMissionLink(cells[0])).toBe("/music/music-index/expert");
        expect(
            getBingoMissionLink({ ...cells[0], musicDifficulty: "real" })
        ).toBe("/music/music-index/real");
        expect(getBingoMissionLink(cells[1])).toBe("/music?categories=Var");
    });
});

describe("관리자 빙고 편집기 계산", () => {
    it("미션 위치를 A1부터 E5까지 표시한다", () => {
        expect(getBingoEditorCellLabel(1)).toBe("A1");
        expect(getBingoEditorCellLabel(13)).toBe("C3");
        expect(getBingoEditorCellLabel(25)).toBe("E5");
    });

    it("서버 액션이 사용하는 미션 필드 접두사를 만든다", () => {
        expect(getBingoEditorCellPrefix(1)).toBe("cell-1");
        expect(getBingoEditorCellPrefix(25)).toBe("cell-25");
    });
});
