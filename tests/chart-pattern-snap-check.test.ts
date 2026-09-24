import { describe, expect, it } from "vitest";

import {
    findOffGridNotes,
    snapNotesToNearestGrid,
} from "@/lib/chart-pattern/snapCheck";
import type { ChartNote, ChartTimingPoint } from "@/lib/chart-pattern/schema";

const note = (id: string, tick: number): ChartNote => ({
    id,
    type: "standard",
    hand: "left",
    tick,
    durationTicks: 0,
    lane: 4,
    width: 3,
    points: [],
});

const points: ChartTimingPoint[] = [
    { id: "a", tick: 0, timeMs: 0, bpm: 120, numerator: 4, denominator: 4 },
    // 6/8 — 한 박 240틱
    {
        id: "b",
        tick: 1920,
        timeMs: 2000,
        bpm: 120,
        numerator: 6,
        denominator: 8,
    },
];

const document = (notes: ChartNote[]) => ({
    notes,
    timingPoints: points,
    ticksPerQuarter: 480 as const,
});

describe("chart snap check", () => {
    it("accepts every editor snap from 1/1 to 1/32 in each time signature", () => {
        const onGrid = [0, 160, 20, 15, 1920 + 240 + 80, 1920 + 7.5 * 2];
        expect(
            findOffGridNotes(
                document(onGrid.map((tick, index) => note(`n${index}`, tick)))
            )
        ).toEqual([]);
    });

    it("lists notes off every grid with the nearest grid and signed offset", () => {
        const found = findOffGridNotes(
            document([note("late", 496), note("early", 1918), note("ok", 480)])
        );
        expect(
            found.map(({ id, nearestTick, divisor }) => [
                id,
                nearestTick,
                divisor,
            ])
        ).toEqual([
            ["late", 495, 32],
            ["early", 1920, 1],
        ]);
        // 120 BPM · 480틱 = 500ms 한 박 → 1틱 ≈ 1.04ms
        expect(found[0].offsetMs).toBeCloseTo(500 / 480, 5);
        expect(found[1].offsetMs).toBeCloseTo((-2 * 500) / 480, 5);
    });

    it("snaps only the chosen notes to their nearest grid", () => {
        const doc = document([note("a", 496), note("b", 1918)]);
        expect(
            snapNotesToNearestGrid(doc, new Set(["b"])).map((n) => n.tick)
        ).toEqual([496, 1920]);
    });
});
