import { describe, expect, it } from "vitest";

import {
    getApproachDurationMs,
    getChartPlaybackDurationMs,
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

    it("노트 속도가 빠를수록 화면에 나타나는 시간이 짧아진다", () => {
        expect(getApproachDurationMs(1)).toBe(6_000);
        expect(getApproachDurationMs(2)).toBe(3_000);
        expect(getApproachDurationMs(3)).toBe(2_000);
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
