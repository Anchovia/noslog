import { describe, expect, it } from "vitest";

import {
    changeChartNoteHand,
    chartNoteContainsPoint,
    chartNoteIntersectsRect,
    chartNotesOverlap,
    cloneChartNotesAtTick,
    findChartNoteConflicts,
    flipChartNotesHorizontally,
    getChartEditorNavigationDurationMs,
    getChartEditorVerticalLayout,
    getMinimumChartNoteDurationTicks,
    getChartNoteHorizontalResizeHandle,
    getGlissandoSnapRenderPoints,
    hasNewChartNoteConflicts,
    moveGlissandoSnapAnchor,
    moveChartNotes,
    moveChartNotesToSnap,
    resizeChartNoteHorizontally,
} from "@/lib/chart-pattern/editor";
import type { ChartNote } from "@/lib/chart-pattern/schema";

const standard: ChartNote = {
    id: "standard",
    type: "standard",
    hand: "left",
    tick: 480,
    durationTicks: 0,
    lane: 3,
    width: 2,
    points: [],
};

const glissando: ChartNote = {
    id: "glissando",
    type: "glissando",
    hand: "right",
    tick: 960,
    durationTicks: 960,
    lane: 5,
    width: 3,
    glissandoSnapDivisor: 8,
    points: [
        {
            tickOffset: 480,
            lane: 12,
            width: 4,
            hand: "left",
        },
        {
            tickOffset: 960,
            lane: 18,
            width: 2,
            hand: "left",
        },
    ],
};

const trill: ChartNote = {
    id: "trill",
    type: "trill",
    hand: "right",
    tick: 2_000,
    durationTicks: 960,
    lane: 4,
    width: 2,
    pairLane: 20,
    pairWidth: 3,
    trillSnapDivisor: 8,
    points: [],
};

describe("채보 편집 연산", () => {
    it("테누토 최소 길이는 현재 스냅 한 칸을 유지한다", () => {
        expect(getMinimumChartNoteDurationTicks("standard", 8, 480)).toBe(0);
        expect(getMinimumChartNoteDurationTicks("tenuto", 8, 480)).toBe(240);
        expect(getMinimumChartNoteDurationTicks("tenuto", 3, 480)).toBe(640);
        expect(getMinimumChartNoteDurationTicks("glissando", 8, 480)).toBe(1);
    });

    it("피아노 표시 여부에 따라 판정선 아래 건반 공간을 예약한다", () => {
        expect(getChartEditorVerticalLayout(600, false)).toEqual({
            judgmentY: 456,
            pianoHeight: 0,
        });
        expect(getChartEditorVerticalLayout(600, true)).toEqual({
            judgmentY: 492,
            pianoHeight: 108,
        });
        expect(getChartEditorVerticalLayout(300, true)).toEqual({
            judgmentY: 216,
            pianoHeight: 84,
        });
    });

    it("확장한 글리산도의 손을 바꾼 뒤 연결점을 옮겨도 전체 색상을 유지한다", () => {
        const extended = {
            ...glissando,
            durationTicks: 1_920,
        };
        const changed = changeChartNoteHand(extended, "right");
        const moved = moveGlissandoSnapAnchor(changed, 0, 2);

        expect(changed.hand).toBe("right");
        expect(changed.points.every((point) => point.hand === undefined)).toBe(
            true
        );
        expect(
            getGlissandoSnapRenderPoints(changed, 480).every(
                (point) => point.hand === "right"
            )
        ).toBe(true);
        expect(
            getGlissandoSnapRenderPoints(moved, 480).every(
                (point) => point.hand === "right"
            )
        ).toBe(true);
        expect(glissando.points.every((point) => point.hand === "left")).toBe(
            true
        );
    });

    it("음원과 곡 길이가 없어도 5분 편집 범위를 제공한다", () => {
        expect(
            getChartEditorNavigationDurationMs({
                durationMs: 0,
                ticksPerQuarter: 480,
                timingPoints: [
                    {
                        id: "timing",
                        tick: 0,
                        timeMs: 0,
                        bpm: 120,
                        numerator: 4,
                        denominator: 4,
                    },
                ],
                notes: [],
            })
        ).toBe(300_000);
    });

    it("한 칸 노트의 양쪽 끝은 크기 조절, 가운데는 이동 영역으로 구분한다", () => {
        const oneLaneNote = { lane: 7, width: 1 };

        expect(getChartNoteHorizontalResizeHandle(oneLaneNote, 7.1, 28)).toBe(
            "left"
        );
        expect(getChartNoteHorizontalResizeHandle(oneLaneNote, 7.9, 28)).toBe(
            "right"
        );
        expect(
            getChartNoteHorizontalResizeHandle(oneLaneNote, 7.5, 28)
        ).toBeNull();
    });

    it("선택한 노트 손잡이는 좌우 바깥쪽 8px까지 인식한다", () => {
        const oneLaneNote = { lane: 7, width: 1 };

        expect(
            getChartNoteHorizontalResizeHandle(oneLaneNote, 6.75, 28, {
                includeOutside: true,
            })
        ).toBe("left");
        expect(
            getChartNoteHorizontalResizeHandle(oneLaneNote, 8.25, 28, {
                includeOutside: true,
            })
        ).toBe("right");
        expect(
            getChartNoteHorizontalResizeHandle(oneLaneNote, 8.4, 28, {
                includeOutside: true,
            })
        ).toBeNull();
    });

    it("글리산도 경로를 저장된 스냅 간격의 공유 연결점으로 나눈다", () => {
        const points = getGlissandoSnapRenderPoints(glissando, 480);

        expect(
            points.map(({ tick, lane, width }) => ({ tick, lane, width }))
        ).toEqual([
            { tick: 960, lane: 5, width: 3 },
            { tick: 1_200, lane: 8.5, width: 3.5 },
            { tick: 1_440, lane: 12, width: 4 },
            { tick: 1_680, lane: 15, width: 3 },
            { tick: 1_920, lane: 18, width: 2 },
        ]);
    });

    it("글리산도 대각선 리본의 소수 칸 영역 전체를 클릭할 수 있다", () => {
        expect(chartNoteContainsPoint(glissando, 6.9, 1_080)).toBe(true);
        expect(chartNoteContainsPoint(glissando, 9.9, 1_080)).toBe(true);
        expect(chartNoteContainsPoint(glissando, 6.6, 1_080)).toBe(false);
    });

    it("같은 시점에 실제 칸이 겹치는 일반 노트만 충돌한다", () => {
        expect(
            chartNotesOverlap(
                standard,
                { ...standard, id: "overlap", lane: 4 },
                480
            )
        ).toBe(true);
        expect(
            chartNotesOverlap(
                standard,
                { ...standard, id: "adjacent", lane: 5 },
                480
            )
        ).toBe(false);
        expect(
            chartNotesOverlap(
                standard,
                { ...standard, id: "later", tick: 481 },
                480
            )
        ).toBe(false);
    });

    it("경로의 시작과 끝이 떨어져 있어도 중간에 교차하면 충돌한다", () => {
        const crossing: ChartNote = {
            ...glissando,
            id: "crossing",
            lane: 18,
            width: 2,
            points: [
                {
                    tickOffset: glissando.durationTicks,
                    lane: 3,
                    width: 2,
                    hand: "left",
                },
            ],
        };

        expect(chartNotesOverlap(glissando, crossing, 480)).toBe(true);
    });

    it("트릴의 대각선 진행 몸체도 중간 칸 충돌에 포함한다", () => {
        const middleNote: ChartNote = {
            ...standard,
            id: "trill-middle",
            tick: 2_120,
            lane: 12,
            width: 2,
        };

        expect(chartNotesOverlap(trill, middleNote, 480)).toBe(true);
    });

    it("기존 충돌 해결은 허용하고 새 충돌만 식별한다", () => {
        const overlapping = { ...standard, id: "overlap", lane: 4 };
        const resolved = { ...overlapping, lane: 8 };

        expect(
            findChartNoteConflicts([standard, overlapping], 480)
        ).toHaveLength(1);
        expect(
            hasNewChartNoteConflicts(
                [standard, overlapping],
                [standard, resolved],
                480
            )
        ).toBe(false);
        expect(
            hasNewChartNoteConflicts(
                [standard, resolved],
                [standard, overlapping],
                480
            )
        ).toBe(true);
    });

    it("자동 글리산도 연결점을 옮기면 실제 공유 경로점으로 저장한다", () => {
        const moved = moveGlissandoSnapAnchor(glissando, 240, 2);
        const anchor = moved.points.find((point) => point.tickOffset === 240);

        expect(anchor).toMatchObject({
            tickOffset: 240,
            lane: 11,
            width: 4,
        });
        expect(
            getGlissandoSnapRenderPoints(moved, 480).find(
                (point) => point.tick === 1_200
            )
        ).toMatchObject({ lane: 11, width: 4 });
    });

    it("글리산도 시작점과 끝점도 같은 앵커 방식으로 옮긴다", () => {
        const startMoved = moveGlissandoSnapAnchor(glissando, 0, 2);
        const endMoved = moveGlissandoSnapAnchor(
            glissando,
            glissando.durationTicks,
            -3
        );

        expect(startMoved).toMatchObject({ lane: 7 });
        expect(
            endMoved.points.find(
                (point) => point.tickOffset === glissando.durationTicks
            )
        ).toMatchObject({ lane: 15 });
    });

    it("선택 사각형이 경로 몸체 일부에 닿으면 전체 노트를 선택한다", () => {
        expect(
            chartNoteIntersectsRect(glissando, {
                minLane: 13,
                maxLane: 14,
                minTick: 1_300,
                maxTick: 1_500,
            })
        ).toBe(true);
        expect(
            chartNoteIntersectsRect(glissando, {
                minLane: 0,
                maxLane: 2,
                minTick: 1_300,
                maxTick: 1_500,
            })
        ).toBe(false);
        expect(
            chartNoteIntersectsRect(glissando, {
                minLane: 24,
                maxLane: 25,
                minTick: 1_440,
                maxTick: 1_500,
            })
        ).toBe(false);
    });

    it("트릴의 어느 한쪽 몸체에 닿아도 선택한다", () => {
        expect(
            chartNoteIntersectsRect(trill, {
                minLane: 21,
                maxLane: 22,
                minTick: 2_300,
                maxTick: 2_500,
            })
        ).toBe(true);
    });

    it("트릴의 좌우 폭 조절을 두 위치에 함께 적용한다", () => {
        expect(resizeChartNoteHorizontally(trill, "left", 2)).toMatchObject({
            lane: 2,
            width: 4,
            pairLane: 18,
            pairWidth: 5,
        });
        expect(resizeChartNoteHorizontally(trill, "right", 7)).toMatchObject({
            lane: 4,
            width: 4,
            pairLane: 20,
            pairWidth: 5,
        });
    });

    it("다중 노트를 간격을 유지하며 함께 이동하고 28칸 밖으로 나가지 않는다", () => {
        const moved = moveChartNotes(
            [standard, glissando],
            [standard.id, glissando.id],
            20,
            240
        );

        expect(moved[0]).toMatchObject({ lane: 11, tick: 720 });
        expect(moved[1]).toMatchObject({ lane: 13, tick: 1_200 });
        expect(moved[1].points.at(-1)).toMatchObject({ lane: 26 });
    });

    it("현재 스냅에 맞춰 기준 노트를 이동하고 다중 선택 간격을 유지한다", () => {
        const first = { ...standard, tick: 160 };
        const second = { ...glissando, tick: 400 };
        const moved = moveChartNotesToSnap(
            [first, second],
            [first.id, second.id],
            0,
            60,
            second.tick,
            32,
            480
        );

        expect(moved.map((note) => note.tick)).toEqual([240, 480]);
        expect(moved[1].tick - moved[0].tick).toBe(240);
    });

    it("선택 노트와 경로·트릴의 두 번째 위치를 좌우 반전한다", () => {
        const flipped = flipChartNotesHorizontally(
            [glissando, trill],
            [glissando.id, trill.id]
        );

        expect(flipped[0]).toMatchObject({ lane: 20 });
        expect(flipped[0].points[0]).toMatchObject({ lane: 12 });
        expect(flipped[1]).toMatchObject({ lane: 22, pairLane: 5 });
    });

    it("붙여넣기 기준 틱에 첫 노트를 맞추고 간격과 위치를 유지한다", () => {
        let nextId = 0;
        const cloned = cloneChartNotesAtTick(
            [standard, glissando],
            4_000,
            () => `copy-${++nextId}`
        );

        expect(
            cloned.map(({ id, tick, lane }) => ({ id, tick, lane }))
        ).toEqual([
            { id: "copy-1", tick: 4_000, lane: 3 },
            { id: "copy-2", tick: 4_480, lane: 5 },
        ]);
    });
});
