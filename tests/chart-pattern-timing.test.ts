import { describe, expect, it } from "vitest";

import type { ChartTimingPoint } from "@/lib/chart-pattern/schema";
import {
    formatBpm,
    getBeatMarkers,
    millisecondsToTick,
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

    it("정수 BPM의 끝자리 0을 제거하지 않는다", () => {
        expect(formatBpm(120)).toBe("120");
        expect(formatBpm(120.125)).toBe("120.125");
    });
});
