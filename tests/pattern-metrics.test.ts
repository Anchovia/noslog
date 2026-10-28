import { describe, expect, it } from "vitest";

import {
    buildPatternTendency,
    type PatternMetricRow,
} from "@/features/music/lib/pattern-tendency";
import {
    computePatternMetrics,
    isMeterKnown,
    patternReference,
    patternStrength,
} from "@/lib/chart-pattern/patternMetrics";
import type {
    ChartDocument,
    ChartHand,
    ChartNote,
    ChartTimingPoint,
} from "@/lib/chart-pattern/schema";

let nextId = 0;
const note = (tick: number, lane: number, hand: ChartHand = "right") =>
    ({
        id: `n${nextId++}`,
        type: "standard",
        hand,
        tick,
        durationTicks: 0,
        lane,
        width: 3,
        points: [],
    }) satisfies ChartNote;

const four: ChartTimingPoint = {
    id: "t0",
    tick: 0,
    timeMs: 0,
    bpm: 150,
    numerator: 4,
    denominator: 4,
};

const chart = (
    notes: ChartNote[],
    timingPoints: ChartTimingPoint[] = [four]
): ChartDocument => ({
    version: 1,
    laneCount: 28,
    ticksPerQuarter: 480,
    durationMs: 0,
    timingPoints,
    notes,
});

const known = { meterKnown: true };
const range = (count: number) => Array.from({ length: count }, (_, i) => i);

describe("pattern metrics", () => {
    it("scores rising single notes as stairs, not repetition", () => {
        const metrics = computePatternMetrics(
            chart(range(32).map((i) => note(i * 120, (i % 8) * 3))),
            known
        );
        expect(metrics.stairs).toBeGreaterThan(0);
        expect(metrics.repetition).toBe(0);
    });

    it("scores the same key hit again as repetition, not stairs", () => {
        const metrics = computePatternMetrics(
            chart(range(32).map((i) => note(i * 120, 12))),
            known
        );
        expect(metrics.repetition).toBeGreaterThan(0);
        expect(metrics.stairs).toBe(0);
    });

    it("gives faster repetition a larger score", () => {
        const at = (step: number) =>
            computePatternMetrics(
                chart(range(32).map((i) => note(i * step, 12))),
                known
            ).repetition;
        expect(at(60)).toBeGreaterThan(at(120));
    });

    it("finds polyrhythm only when the hands split the beat differently", () => {
        const sixteenths = range(64).map((i) => note(i * 120, 18, "right"));
        const triplets = range(48).map((i) => note(i * 160, 3, "left"));
        const eighths = range(32).map((i) => note(i * 240, 3, "left"));
        expect(
            computePatternMetrics(chart([...sixteenths, ...triplets]), known)
                .polyrhythm
        ).toBeGreaterThan(0);
        expect(
            computePatternMetrics(chart([...sixteenths, ...eighths]), known)
                .polyrhythm
        ).toBe(0);
    });

    it("counts a slightly rolled chord as offset but a plain chord not", () => {
        const rolled = range(16).flatMap((i) => [
            note(i * 960, 3, "left"),
            note(i * 960 + 30, 18),
        ]);
        const plain = range(16).flatMap((i) => [
            note(i * 960, 3, "left"),
            note(i * 960, 18),
        ]);
        expect(
            computePatternMetrics(chart(rolled), known).offset
        ).toBeGreaterThan(0);
        expect(computePatternMetrics(chart(plain), known).offset).toBe(0);
    });

    it("does not count a fast run as offset", () => {
        const run = range(32).map((i) => note(i * 60, (i % 8) * 3));
        expect(computePatternMetrics(chart(run), known).offset).toBe(0);
    });

    it("measures meter changes from time signatures", () => {
        const notes = range(16).map((i) => note(i * 480, 12));
        const threeFour: ChartTimingPoint = {
            ...four,
            id: "t1",
            tick: 1920 * 3,
            timeMs: 4800,
            numerator: 3,
        };
        expect(computePatternMetrics(chart(notes), known).chords).toBe(0);
        expect(
            computePatternMetrics(chart(notes, [four, threeFour]), known).chords
        ).toBeGreaterThan(0);
    });

    it("leaves meter changes unknown for charts straight from video", () => {
        expect(isMeterKnown("vid2bmap")).toBe(false);
        expect(isMeterKnown("manual")).toBe(true);
        expect(isMeterKnown(undefined)).toBe(true);
        expect(
            computePatternMetrics(chart([note(0, 12)]), { meterKnown: false })
                .chords
        ).toBeNull();
    });
});

describe("pattern strength", () => {
    it("uses the median of the top 1% as 100%", () => {
        const values = [...range(198).map((i) => i + 1), 1000, 5000];
        expect(patternReference(values)).toBe(3000);
        expect(patternStrength(1500, 3000)).toBe(0.5);
        expect(patternStrength(5000, 3000)).toBe(1);
    });

    it("keeps zero as 0% and missing values as null", () => {
        expect(patternReference([0, 0])).toBeNull();
        expect(patternStrength(0, null)).toBe(0);
        expect(patternStrength(null, 10)).toBeNull();
        expect(patternStrength(5, null)).toBeNull();
    });

    it("compares within the same difficulty and across all charts", () => {
        const row = (
            chartId: number,
            difficulty: string,
            stairs: number
        ): PatternMetricRow => ({
            chartId,
            difficulty,
            stairs,
            repetition: 0,
            polyrhythm: 0,
            offset: 0,
            chords: null,
        });
        const rows = [
            row(1, "Hard", 10),
            row(2, "Hard", 20),
            row(3, "Real", 40),
        ];
        const tendency = buildPatternTendency(rows, 1);
        expect(tendency?.difficulty.stairs).toBe(0.5);
        expect(tendency?.all.stairs).toBe(0.25);
        expect(tendency?.all.chords).toBeNull();
        expect(buildPatternTendency(rows, 9)).toBeNull();
    });
});
