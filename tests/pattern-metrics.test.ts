import { describe, expect, it } from "vitest";

import {
    buildPatternTendency,
    type PatternMetricRow,
} from "@/features/music/lib/pattern-tendency";
import musicCatalog from "@/prisma/data/music-catalog.json";
import { songMeterLevel } from "@/lib/chart-pattern/meterRecord";
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

const known = { meterKnown: true, songMeter: null };
const range = (count: number) => Array.from({ length: count }, (_, i) => i);

describe("pattern metrics", () => {
    it("scores single notes moving 1–3 keys one way as stairs, not repetition", () => {
        const metrics = computePatternMetrics(
            chart(range(32).map((i) => note(i * 120, (i % 8) * 3))),
            known
        );
        expect(metrics.stairs).toBeGreaterThan(0);
        expect(metrics.repetition).toBe(0);
    });

    it("does not count leaps wider than three keys as stairs", () => {
        const metrics = computePatternMetrics(
            chart(range(32).map((i) => note(i * 120, (i % 4) * 6))),
            known
        );
        expect(metrics.stairs).toBe(0);
    });

    it("counts stairs that hit each key twice", () => {
        const metrics = computePatternMetrics(
            chart(
                range(32).map((i) => note(i * 120, (Math.floor(i / 2) % 8) * 3))
            ),
            known
        );
        expect(metrics.stairs).toBeGreaterThan(0);
    });

    it("leaves glissando notes out of stairs", () => {
        const metrics = computePatternMetrics(
            chart(
                range(32).map((i) => ({
                    ...note(i * 120, (i % 8) * 3),
                    type: "glissando" as const,
                }))
            ),
            known
        );
        expect(metrics.stairs).toBe(0);
    });

    it("scores the same key hit again as repetition, not stairs", () => {
        const metrics = computePatternMetrics(
            chart(range(32).map((i) => note(i * 120, 12))),
            known
        );
        expect(metrics.repetition).toBeGreaterThan(0);
        expect(metrics.stairs).toBe(0);
    });

    it("needs the key hit again at least twice in a row for repetition", () => {
        const pairs = range(16).flatMap((i) => [
            note(i * 960, 12),
            note(i * 960 + 120, 12),
        ]);
        expect(computePatternMetrics(chart(pairs), known).repetition).toBe(0);
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

    it("grades meter changes from time signatures entered by hand", () => {
        const notes = range(40).map((i) => note(i * 480, 12));
        const at = (tick: number, numerator: number): ChartTimingPoint => ({
            ...four,
            id: `t${tick}`,
            tick,
            numerator,
        });
        // 4/4 아홉 마디 뒤 3/4 한 마디: 10% 미만이라 적음
        expect(
            computePatternMetrics(
                chart(notes, [four, at(1920 * 9, 3), at(1920 * 9 + 1440, 4)]),
                known
            ).chords
        ).toBe(1);
        // 주 박자가 아닌 마디가 30% 를 넘으면 많음
        expect(
            computePatternMetrics(chart(notes, [four, at(1920 * 5, 3)]), known)
                .chords
        ).toBe(3);
    });

    it("uses the song record when the chart has one time signature", () => {
        const single = chart(range(16).map((i) => note(i * 480, 12)));
        expect(computePatternMetrics(single, known).chords).toBeNull();
        expect(
            computePatternMetrics(single, { meterKnown: true, songMeter: 2 })
                .chords
        ).toBe(2);
        expect(
            computePatternMetrics(single, { meterKnown: true, songMeter: 0 })
                .chords
        ).toBe(0);
    });

    it("ignores time signatures of charts straight from video", () => {
        expect(isMeterKnown("vid2bmap")).toBe(false);
        expect(isMeterKnown("manual")).toBe(true);
        expect(isMeterKnown(undefined)).toBe(true);
        const threeFour: ChartTimingPoint = {
            ...four,
            id: "t1",
            tick: 1920 * 3,
            numerator: 3,
        };
        const notes = range(16).map((i) => note(i * 480, 12));
        expect(
            computePatternMetrics(chart(notes, [four, threeFour]), {
                meterKnown: false,
                songMeter: null,
            }).chords
        ).toBeNull();
    });

    it("counts tempo changes between sections of a beat or longer", () => {
        const notes = range(40).map((i) => note(i * 480, 12));
        const at = (tick: number, bpm: number): ChartTimingPoint => ({
            ...four,
            id: `t${tick}`,
            tick,
            bpm,
        });
        const changes = (points: ChartTimingPoint[]) =>
            computePatternMetrics(chart(notes, points), known).tempoChanges;
        expect(changes([four])).toBe(0);
        expect(changes([four, at(1920, 180), at(3840, 150)])).toBe(2);
        // 2% 안의 흔들림, 한 박이 안 되는 구간, 2배 · 절반은 세지 않는다
        expect(changes([four, at(1920, 152)])).toBe(0);
        expect(changes([four, at(1920, 180), at(2000, 150)])).toBe(0);
        expect(changes([four, at(1920, 300), at(3840, 150)])).toBe(0);
    });

    it("counts notes by type", () => {
        const typed = (tick: number, type: ChartNote["type"]) => ({
            ...note(tick, 12),
            type,
        });
        const metrics = computePatternMetrics(
            chart([
                typed(0, "standard"),
                typed(480, "tenuto"),
                typed(960, "tenuto"),
                typed(1440, "glissando"),
                typed(1920, "trill"),
                typed(2400, "trill"),
                typed(2880, "trill"),
            ]),
            known
        );
        expect(metrics.tenutoCount).toBe(2);
        expect(metrics.glissandoCount).toBe(1);
        expect(metrics.trillCount).toBe(3);
    });

    it("reads the song meter record by music index", () => {
        const truth = musicCatalog.find(
            (music) => music.title === "TRUTH behind U"
        )!;
        expect(songMeterLevel(truth.index)).toBe(3);
        expect(songMeterLevel("missing")).toBeNull();
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
            tempoChanges: 3,
            tenutoCount: 4,
            glissandoCount: 5,
            trillCount: 6,
        });
        const rows = [
            row(1, "Hard", 10),
            row(2, "Hard", 20),
            row(3, "Real", 40),
        ];
        const tendency = buildPatternTendency(rows, 1);
        expect(tendency?.difficulty.stairs).toBe(0.5);
        expect(tendency?.all.stairs).toBe(0.25);
        expect(tendency?.meter).toBeNull();
        expect(tendency?.tempoChanges).toBe(3);
        expect(tendency?.tenutoCount).toBe(4);
        expect(tendency?.glissandoCount).toBe(5);
        expect(tendency?.trillCount).toBe(6);
        expect(buildPatternTendency(rows, 9)).toBeNull();
    });
});
