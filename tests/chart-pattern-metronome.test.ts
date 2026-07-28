import { describe, expect, it } from "vitest";

import {
    DEFAULT_METRONOME_VOLUME,
    getMetronomePeakGain,
    normalizeMetronomeVolume,
} from "@/lib/chart-pattern/metronome";

describe("채보 메트로놈 음량", () => {
    it("기본 음량을 70%로 제공한다", () => {
        expect(DEFAULT_METRONOME_VOLUME).toBe(70);
        expect(getMetronomePeakGain(70, true)).toBeCloseTo(0.28);
        expect(getMetronomePeakGain(70, false)).toBeCloseTo(0.154);
    });

    it("음량을 0~100% 범위의 정수로 제한한다", () => {
        expect(normalizeMetronomeVolume(-10)).toBe(0);
        expect(normalizeMetronomeVolume(42.6)).toBe(43);
        expect(normalizeMetronomeVolume(150)).toBe(100);
        expect(normalizeMetronomeVolume(Number.NaN)).toBe(70);
    });
});
