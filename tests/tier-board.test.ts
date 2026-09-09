import { describe, expect, it } from "vitest";

import type { TierBandData } from "@/features/tiers/components/tierBoard/tierBoardTypes";
import {
    getTierBoardChangeCount,
    getBandDropId,
    getEntryDragId,
    getTierDifficultyBorder,
    getTierEntryPlacements,
    moveTierEntryInBoard,
    resolveTierDropTarget,
} from "@/features/tiers/components/tierBoard/tierBoardUtils";

function bands(): TierBandData[] {
    return [
        {
            id: 10,
            value: 12.9,
            entries: [
                {
                    id: 101,
                    position: 1,
                    chart: {
                        id: 1,
                        difficulty: "expert",
                        level: 12,
                        music: {
                            index: "music-1",
                            title: "첫 곡",
                            artist: null,
                            background: null,
                        },
                    },
                },
                {
                    id: 102,
                    position: 2,
                    chart: {
                        id: 2,
                        difficulty: "real",
                        level: 3,
                        music: {
                            index: "music-2",
                            title: "두 번째 곡",
                            artist: null,
                            background: null,
                        },
                    },
                },
            ],
        },
        {
            id: 20,
            value: 12.8,
            entries: [],
        },
    ];
}

describe("서열표 드래그 대상 계산", () => {
    it("Real과 Expert 채보의 테두리 색상을 구분한다", () => {
        expect(getTierDifficultyBorder("Real")).toBe("border-real");
        expect(getTierDifficultyBorder("expert")).toBe("border-expert");
        expect(getTierDifficultyBorder("Hard")).toBe("border-transparent");
    });

    it("드래그와 드롭 식별자를 구분해 생성한다", () => {
        expect(getEntryDragId(12)).toBe("entry-12");
        expect(getBandDropId(12)).toBe("band-12");
    });

    it("채보 위에 놓으면 해당 채보 위치를 반환한다", () => {
        expect(
            resolveTierDropTarget(bands(), {
                type: "entry",
                bandId: 10,
                index: 1,
            })
        ).toEqual({ bandId: 10, index: 1 });
    });

    it("구간 빈 공간에 놓으면 구간 마지막 위치를 반환한다", () => {
        expect(
            resolveTierDropTarget(bands(), {
                type: "band",
                bandId: 10,
            })
        ).toEqual({ bandId: 10, index: 2 });
        expect(
            resolveTierDropTarget(bands(), {
                type: "band",
                bandId: 20,
            })
        ).toEqual({ bandId: 20, index: 0 });
    });

    it("존재하지 않는 구간은 이동 대상으로 사용하지 않는다", () => {
        expect(
            resolveTierDropTarget(bands(), {
                type: "band",
                bandId: 999,
            })
        ).toBeNull();
    });

    it("드롭 결과를 로컬 보드에만 반영하고 변경된 배치를 만든다", () => {
        const initialBands = bands();
        const movedBands = moveTierEntryInBoard(initialBands, 101, 20, 0);

        expect(movedBands[0].entries).toMatchObject([{ id: 102, position: 1 }]);
        expect(movedBands[1].entries).toMatchObject([{ id: 101, position: 1 }]);
        expect(getTierBoardChangeCount(initialBands, movedBands)).toBe(2);
        expect(getTierEntryPlacements(movedBands)).toEqual([
            { id: 102, tierBandId: 10, position: 1 },
            { id: 101, tierBandId: 20, position: 1 },
        ]);
    });
});
