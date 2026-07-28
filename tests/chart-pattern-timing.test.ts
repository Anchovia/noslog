import { describe, expect, it } from "vitest";

import type { ChartTimingPoint } from "@/lib/chart-pattern/schema";
import {
    formatBpm,
    formatRevisionDateTime,
    getBeatMarkers,
    getMeasurePanels,
    getSnapGridMarkers,
    getSnapGridSubdivision,
    millisecondsToTick,
    moveTickBySnapSteps,
    snapTick,
    tickToMilliseconds,
} from "@/lib/chart-pattern/timing";

const timingPoints: ChartTimingPoint[] = [
    {
        id: "timing-0",
        tick: 0,
        timeMs: 0,
        bpm: 120,
        numerator: 4,
        denominator: 4,
    },
    {
        id: "timing-1",
        tick: 1_920,
        timeMs: 2_000,
        bpm: 60,
        numerator: 3,
        denominator: 4,
    },
];

describe("채보 타이밍 계산", () => {
    it("BPM 구간에 따라 틱을 시간으로 변환한다", () => {
        expect(tickToMilliseconds(480, timingPoints, 480)).toBe(500);
        expect(tickToMilliseconds(2_400, timingPoints, 480)).toBe(3_000);
    });

    it("시간을 각 BPM 구간의 틱으로 되돌린다", () => {
        expect(millisecondsToTick(1_000, timingPoints, 480)).toBe(960);
        expect(millisecondsToTick(3_000, timingPoints, 480)).toBe(2_400);
    });

    it("박자 분할에 맞춰 틱을 스냅한다", () => {
        expect(snapTick(260, 8, 480)).toBe(240);
        expect(snapTick(370, 8, 480)).toBe(480);
    });

    it("휠 이동을 현재 스냅 한 칸과 빠른 네 칸으로 계산한다", () => {
        expect(moveTickBySnapSteps(370, 8, 480, 1)).toBe(480);
        expect(moveTickBySnapSteps(370, 8, 480, -1)).toBe(240);
        expect(moveTickBySnapSteps(640, 3, 480, 4)).toBe(3_200);
        expect(moveTickBySnapSteps(240, 4, 480, 1)).toBe(480);
    });

    it("선택한 스냅 분할에 맞는 보조선 마커를 만든다", () => {
        const markers = getSnapGridMarkers(timingPoints, 480, 3, 0, 2_100);

        expect(markers.map(({ tick }) => tick)).toEqual([0, 640, 1_280, 1_920]);
    });

    it("osu! 방식으로 각 보조선의 최소 스냅 분할을 구분한다", () => {
        expect(
            Array.from({ length: 9 }, (_, index) =>
                getSnapGridSubdivision(index, 8)
            )
        ).toEqual([1, 8, 4, 8, 2, 8, 4, 8, 1]);
        expect(
            [1, 2, 3, 4, 6, 8, 12].map((index) =>
                getSnapGridSubdivision(index, 24)
            )
        ).toEqual([24, 12, 8, 6, 4, 3, 2]);
        expect(
            [1, 2, 4, 8, 16].map((index) => getSnapGridSubdivision(index, 32))
        ).toEqual([32, 16, 8, 4, 2]);
    });

    it("박자표별 강박이 포함된 메트로놈 마커를 만든다", () => {
        const markers = getBeatMarkers(timingPoints, 480, 0, 4_100);

        expect(
            markers.slice(0, 5).map(({ timeMs, accent }) => ({
                timeMs,
                accent,
            }))
        ).toEqual([
            { timeMs: 0, accent: true },
            { timeMs: 500, accent: false },
            { timeMs: 1_000, accent: false },
            { timeMs: 1_500, accent: false },
            { timeMs: 2_000, accent: true },
        ]);
    });

    it("3/4 박자는 4분음표 세 박자마다 강박을 만든다", () => {
        const threeFourTiming = [
            {
                id: "timing-3-4",
                tick: 0,
                timeMs: 0,
                bpm: 60,
                numerator: 3,
                denominator: 4 as const,
            },
        ];
        const markers = getBeatMarkers(threeFourTiming, 480, 0, 6_100);

        expect(
            markers.map(({ timeMs, accent }) => ({ timeMs, accent }))
        ).toEqual([
            { timeMs: 0, accent: true },
            { timeMs: 1_000, accent: false },
            { timeMs: 2_000, accent: false },
            { timeMs: 3_000, accent: true },
            { timeMs: 4_000, accent: false },
            { timeMs: 5_000, accent: false },
            { timeMs: 6_000, accent: true },
        ]);

        const accentTicks = new Set(
            markers
                .filter((marker) => marker.accent)
                .map((marker) => marker.tick)
        );
        const wholeNoteTicks = getSnapGridMarkers(
            threeFourTiming,
            480,
            4,
            0,
            10_100
        )
            .filter((marker) => marker.subdivision === 1)
            .map((marker) => marker.tick);

        expect(wholeNoteTicks).toEqual([0, 1_920, 3_840]);
        expect(accentTicks.has(0)).toBe(true);
        expect(accentTicks.has(1_920)).toBe(false);
        expect(accentTicks.has(3_840)).toBe(false);
    });

    it("실제 박자표를 기준으로 한 열을 4마디씩 나눈다", () => {
        const panels = getMeasurePanels([timingPoints[0]], 480, 20_000);

        expect(panels).toEqual([
            { index: 0, startMs: 0, endMs: 8_000 },
            { index: 1, startMs: 8_000, endMs: 16_000 },
            { index: 2, startMs: 16_000, endMs: 20_000 },
        ]);
    });

    it("BPM과 박자표가 바뀌어도 실제 4마디 단위로 나눈다", () => {
        const panels = getMeasurePanels(timingPoints, 480, 16_000);

        expect(panels).toEqual([
            { index: 0, startMs: 0, endMs: 11_000 },
            { index: 1, startMs: 11_000, endMs: 16_000 },
        ]);
    });

    it("양수 오프셋 앞의 여백을 유지하고 4마디 뒤에서 열을 나눈다", () => {
        const panels = getMeasurePanels(
            [{ ...timingPoints[0], timeMs: 500 }],
            480,
            10_000
        );

        expect(panels).toEqual([
            { index: 0, startMs: 0, endMs: 8_500 },
            { index: 1, startMs: 8_500, endMs: 10_000 },
        ]);
    });

    it("음수 오프셋에서 시작한 첫 마디를 포함해 4마디씩 나눈다", () => {
        const panels = getMeasurePanels(
            [{ ...timingPoints[0], timeMs: -100 }],
            480,
            10_000
        );

        expect(panels).toEqual([
            { index: 0, startMs: 0, endMs: 7_900 },
            { index: 1, startMs: 7_900, endMs: 10_000 },
        ]);
    });

    it("저장 이력 시간을 서버 환경과 무관한 KST 24시간제로 표시한다", () => {
        expect(formatRevisionDateTime("2026-07-27T17:26:00.000Z")).toBe(
            "07. 28. 02:26"
        );
        expect(formatRevisionDateTime("invalid")).toBe("-");
    });

    it("정수 BPM의 끝자리 0을 제거하지 않는다", () => {
        expect(formatBpm(120)).toBe("120");
        expect(formatBpm(120.125)).toBe("120.125");
    });
});
