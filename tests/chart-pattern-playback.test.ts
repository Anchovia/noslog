import { describe, expect, it } from "vitest";

import {
    getActivePlaybackPianoRanges,
    getApproachDurationMs,
    getChartPlaybackDurationMs,
    getPlaybackRibbonVisibleEndMs,
    prepareChartPlaybackNotes,
    projectPlaybackLane,
    projectPlaybackRange,
} from "@/lib/chart-pattern/playback";
import type { ChartDocument } from "@/lib/chart-pattern/schema";

const document: ChartDocument = {
    version: 1,
    laneCount: 28,
    ticksPerQuarter: 480,
    durationMs: 0,
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
    notes: [
        {
            id: "standard",
            type: "standard",
            hand: "left",
            tick: 480,
            durationTicks: 0,
            lane: 4,
            width: 2,
            points: [],
        },
        {
            id: "glissando",
            type: "glissando",
            hand: "right",
            tick: 960,
            durationTicks: 960,
            lane: 8,
            width: 3,
            glissandoSnapDivisor: 4,
            points: [
                {
                    tickOffset: 960,
                    lane: 16,
                    width: 2,
                },
            ],
        },
    ],
};

describe("낙하형 채보 재생 계산", () => {
    it("노트를 시간순으로 변환하고 글리산도 연결 노트를 생성한다", () => {
        const prepared = prepareChartPlaybackNotes(document);

        expect(prepared.map((note) => note.id)).toEqual([
            "standard",
            "glissando",
        ]);
        expect(prepared[0].startTimeMs).toBe(500);
        expect(prepared[1].pathPoints.map((point) => point.timeMs)).toEqual([
            1_000, 1_500, 2_000,
        ]);
        expect(getChartPlaybackDurationMs(document)).toBe(3_000);
    });

    it("새 2.0 속도는 직전 4.0 기준의 접근 시간을 사용하고 4.0까지 지원한다", () => {
        expect(getApproachDurationMs(1)).toBe(2_000);
        expect(getApproachDurationMs(2)).toBe(1_000);
        expect(getApproachDurationMs(3)).toBeCloseTo(2_000 / 3);
        expect(getApproachDurationMs(4)).toBe(500);
        expect(getApproachDurationMs(5)).toBe(500);
    });

    it("롱노트 리본은 궤적 정점 이후 구간만 표시한다", () => {
        const currentTimeMs = 1_000;
        const approachDurationMs = 500;
        const visibleEndMs = getPlaybackRibbonVisibleEndMs(
            currentTimeMs,
            approachDurationMs
        );
        const apex = projectPlaybackRange({
            lane: 4,
            width: 2,
            timeMs: visibleEndMs,
            currentTimeMs,
            approachDurationMs,
            canvasWidth: 800,
            horizonY: 60,
            judgmentY: 500,
        });
        const spawn = projectPlaybackRange({
            lane: 4,
            width: 2,
            timeMs: currentTimeMs + approachDurationMs,
            currentTimeMs,
            approachDurationMs,
            canvasWidth: 800,
            horizonY: 60,
            judgmentY: 500,
        });

        expect(visibleEndMs).toBeGreaterThan(currentTimeMs);
        expect(visibleEndMs).toBeLessThan(currentTimeMs + approachDurationMs);
        expect(apex.y).toBeLessThan(spawn.y);
    });

    it("테누토와 글리산도는 연주가 끝날 때까지 피아노 입력을 유지한다", () => {
        const prepared = prepareChartPlaybackNotes(document);
        const tenuto = {
            id: "tenuto",
            type: "tenuto" as const,
            hand: "left" as const,
            startTimeMs: 3_000,
            endTimeMs: 4_000,
            pathPoints: [
                {
                    lane: 2,
                    width: 4,
                    timeMs: 3_000,
                    hand: "left" as const,
                },
                {
                    lane: 6,
                    width: 2,
                    timeMs: 4_000,
                    hand: "left" as const,
                },
            ],
            trillSegments: [],
        };
        const notes = [...prepared, tenuto];

        expect(getActivePlaybackPianoRanges(notes, 500)).toEqual([
            { lane: 4, width: 2, hand: "left" },
        ]);
        expect(getActivePlaybackPianoRanges(notes, 596)).toEqual([]);
        expect(getActivePlaybackPianoRanges(notes, 1_250)).toEqual([
            { lane: 10, width: 2.75, hand: "right" },
        ]);
        expect(getActivePlaybackPianoRanges(notes, 1_750)).toEqual([
            { lane: 14, width: 2.25, hand: "right" },
        ]);
        expect(getActivePlaybackPianoRanges(notes, 2_096)).toEqual([]);
        expect(getActivePlaybackPianoRanges(notes, 3_500)).toEqual([
            { lane: 4, width: 3, hand: "left" },
        ]);
        expect(getActivePlaybackPianoRanges(notes, 4_096)).toEqual([]);
    });

    it("판정선으로 접근할수록 노트 폭이 넓어지고 판정선에 도착한다", () => {
        const far = projectPlaybackRange({
            lane: 4,
            width: 2,
            timeMs: 3_000,
            currentTimeMs: 0,
            approachDurationMs: 3_000,
            canvasWidth: 800,
            horizonY: 30,
            judgmentY: 500,
        });
        const near = projectPlaybackRange({
            lane: 4,
            width: 2,
            timeMs: 0,
            currentTimeMs: 0,
            approachDurationMs: 3_000,
            canvasWidth: 800,
            horizonY: 30,
            judgmentY: 500,
        });

        expect(near.y).toBe(500);
        expect(far.y).toBeGreaterThan(30);
        expect(near.right - near.left).toBeGreaterThan(far.right - far.left);
    });

    it("노트 궤적은 생성선에서 정점을 지난 뒤 판정선으로 내려온다", () => {
        const projection = (progress: number) =>
            projectPlaybackLane({
                lane: 4,
                progress,
                canvasWidth: 800,
                horizonY: 60,
                judgmentY: 500,
            });
        const spawn = projection(0);
        const apex = projection(0.16);
        const falling = projection(0.4);
        const judgment = projection(1);

        expect(apex.y).toBeLessThan(spawn.y);
        expect(falling.y).toBeGreaterThan(apex.y);
        expect(judgment.y).toBe(500);
        expect(spawn.x).toBeGreaterThan(falling.x);
        expect(falling.x).toBeGreaterThan(judgment.x);
    });
});
