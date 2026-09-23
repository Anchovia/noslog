import { describe, expect, it } from "vitest";

import altale from "./fixtures/vid2bmap-altale-real.json";
import type { ChartNote, ChartTimingPoint } from "@/lib/chart-pattern/schema";
import {
    alignVid2bmapFirstBarTick,
    applyVid2bmapMerge,
    beatLengthLabel,
    estimateVid2bmapBpm,
    chartPositionLabel,
    collectVid2bmapNotes,
    defaultVid2bmapChoice,
    planVid2bmapMerge,
    convertVid2bmap,
    defaultVid2bmapFirstBarTick,
    diffChartNotes,
    snapVid2bmapTick,
    suggestVid2bmapSnap,
    vid2bmapBeatPosition,
    vid2bmapTickAt,
} from "@/lib/chart-pattern/vid2bmap";
import {
    barRowsFromMask,
    parseNpy,
    readVid2bmapZip,
} from "@/lib/chart-pattern/vid2bmapFile";
import type { Vid2bmapResult } from "@/lib/chart-pattern/vid2bmapFile";

const point = (
    tick: number,
    timeMs: number,
    bpm: number,
    numerator = 4,
    denominator: 4 | 8 = 4
): ChartTimingPoint => ({
    id: `t${tick}`,
    tick,
    timeMs,
    bpm,
    numerator,
    denominator,
});

/** NumPy .npy 바이트 (v1, C 순서) */
function npy(descr: string, shape: number[], values: number[]) {
    const shapeText =
        shape.length === 1 ? `(${shape[0]},)` : `(${shape.join(", ")})`;
    let header = `{'descr': '${descr}', 'fortran_order': False, 'shape': ${shapeText}, }`;
    const total = 10 + header.length + 1;
    header += " ".repeat((64 - (total % 64)) % 64) + "\n";
    const size = descr === "<i8" ? 8 : 1;
    const bytes = new Uint8Array(10 + header.length + values.length * size);
    bytes.set([0x93, 0x4e, 0x55, 0x4d, 0x50, 0x59, 1, 0]);
    new DataView(bytes.buffer).setUint16(8, header.length, true);
    bytes.set(new TextEncoder().encode(header), 10);
    const view = new DataView(bytes.buffer, 10 + header.length);
    values.forEach((value, index) => {
        if (size === 8) view.setBigInt64(index * 8, BigInt(value), true);
        else view.setUint8(index, value);
    });
    return bytes;
}

/** 저장(0) · deflate(8) 섞인 zip */
async function zip(files: [string, Uint8Array<ArrayBuffer>, boolean][]) {
    const encoder = new TextEncoder();
    const locals: Uint8Array<ArrayBuffer>[] = [];
    const centrals: Uint8Array<ArrayBuffer>[] = [];
    let offset = 0;
    for (const [name, content, deflate] of files) {
        const data: Uint8Array<ArrayBuffer> = deflate
            ? new Uint8Array(
                  await new Response(
                      new Blob([content])
                          .stream()
                          .pipeThrough(new CompressionStream("deflate-raw"))
                  ).arrayBuffer()
              )
            : content;
        const nameBytes = encoder.encode(name);
        const local = new Uint8Array(30 + nameBytes.length + data.length);
        const lv = new DataView(local.buffer);
        lv.setUint32(0, 0x04034b50, true);
        lv.setUint16(8, deflate ? 8 : 0, true);
        lv.setUint32(18, data.length, true);
        lv.setUint32(22, content.length, true);
        lv.setUint16(26, nameBytes.length, true);
        local.set(nameBytes, 30);
        local.set(data, 30 + nameBytes.length);
        const central = new Uint8Array(46 + nameBytes.length);
        const cv = new DataView(central.buffer);
        cv.setUint32(0, 0x02014b50, true);
        cv.setUint16(10, deflate ? 8 : 0, true);
        cv.setUint32(20, data.length, true);
        cv.setUint32(24, content.length, true);
        cv.setUint16(28, nameBytes.length, true);
        cv.setUint32(42, offset, true);
        central.set(nameBytes, 46);
        locals.push(local);
        centrals.push(central);
        offset += local.length;
    }
    const centralSize = centrals.reduce((sum, part) => sum + part.length, 0);
    const end = new Uint8Array(22);
    const ev = new DataView(end.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(8, files.length, true);
    ev.setUint16(10, files.length, true);
    ev.setUint32(12, centralSize, true);
    ev.setUint32(16, offset, true);
    return new Uint8Array(
        await new Blob([...locals, ...centrals, end]).arrayBuffer()
    );
}

describe("vid2bmap file reading", () => {
    it("reads int64 and bool NumPy arrays", () => {
        expect(parseNpy(npy("<i8", [2, 3], [5, 1, 3, -2, 0, 27]))).toEqual({
            shape: [2, 3],
            values: [5, 1, 3, -2, 0, 27],
        });
        expect(parseNpy(npy("|b1", [4], [0, 1, 1, 0])).values).toEqual([
            0, 1, 1, 0,
        ]);
        expect(() => parseNpy(new Uint8Array([1, 2, 3]))).toThrow();
    });

    it("merges thick bar rows into their middle row", () => {
        expect(barRowsFromMask([0, 1, 0, 0, 1, 1, 0, 1])).toEqual([1, 4.5, 7]);
    });

    it("finds result files by name inside any folder of a stored or deflated zip", async () => {
        const archive = await zip([
            [
                "result\\chart_bar.npy",
                npy("|b1", [6], [1, 0, 0, 1, 0, 0]),
                true,
            ],
            ["result/chart_simple.npy", npy("<i8", [1, 3], [2, 4, 6]), false],
            ["result/chart_tenuto.npy", npy("<i8", [0], []), true],
            [
                "meta/song.meta.json",
                new TextEncoder().encode('{"start":[11.5,60],"end":[20,60]}'),
                false,
            ],
        ]);
        const result = await readVid2bmapZip(archive);
        expect(result).toEqual({
            fps: 60,
            startSec: 11.5,
            barRows: [0, 3],
            simple: [[2, 4, 6]],
            tenuto: [],
            trill: [],
            glissando: [],
        });
    });

    it("says which result file is missing", async () => {
        const archive = await zip([
            ["chart_bar.npy", npy("|b1", [2], [1, 1]), false],
        ]);
        await expect(readVid2bmapZip(archive)).rejects.toThrow(
            "chart_simple.npy"
        );
    });
});

describe("vid2bmap beat positions", () => {
    const rows = [100, 140, 180, 240];

    it("measures notes between neighbouring bar lines, not by video time", () => {
        expect(vid2bmapBeatPosition(rows, 120)).toBe(0.5);
        // 간격이 60 으로 늘어난 구간도 같은 한 박으로 본다(프레임 드롭 보정의 흔들림)
        expect(vid2bmapBeatPosition(rows, 210)).toBe(2.5);
        expect(vid2bmapBeatPosition(rows, 90)).toBe(-0.25);
        expect(vid2bmapBeatPosition(rows, 270)).toBe(3.5);
    });

    it("follows the time signature of each section (a beat is the denominator unit)", () => {
        const points = [point(0, 0, 120, 4, 4), point(960, 1000, 120, 6, 8)];
        expect(vid2bmapTickAt(1, 0, points)).toBe(480);
        expect(vid2bmapTickAt(2, 0, points)).toBe(960);
        expect(vid2bmapTickAt(3, 0, points)).toBe(1200);
        expect(vid2bmapTickAt(2.5, 0, points)).toBe(1080);
        expect(vid2bmapTickAt(-1, 480, points)).toBe(0);
    });

    it("snaps to a beat subdivision from the active timing point", () => {
        const points = [point(0, 0, 90, 3, 4)];
        expect(snapVid2bmapTick(1205, 6, points)).toBe(1200);
        expect(snapVid2bmapTick(1225, 4, points)).toBe(1200);
        expect(snapVid2bmapTick(1265, 4, points)).toBe(1320);
    });
});

describe("vid2bmap Altale Real regression", () => {
    const result = altale as unknown as Vid2bmapResult & {
        expected: {
            firstBarTick: number;
            snapDivisor: number;
            timingPoint: ChartTimingPoint;
            notes: [number, number, number, string, number, string][];
        };
    };
    const { expected } = result;
    const timingPoints = [expected.timingPoint];
    const collected = collectVid2bmapNotes(result);
    let serial = 0;
    const conversion = convertVid2bmap(result, collected.notes, {
        timingPoints,
        firstBarTick: expected.firstBarTick,
        snapDivisor: expected.snapDivisor,
        include: { standard: true, tenuto: true, trill: true },
        createId: () => `n${serial++}`,
    });
    const lastTick = Math.max(...expected.notes.map((note) => note[0]));
    const inRange = conversion.notes.filter((note) => note.tick <= lastTick);

    it("merges notes read twice two frames apart", () => {
        expect(collected.counts.duplicates).toBeGreaterThan(0);
        const keys = collected.notes.map(
            (n) => `${n.kind}:${n.lane}:${n.width}:${n.y}`
        );
        expect(new Set(keys).size).toBe(keys.length);
    });

    it("matches all 232 checked notes by tick, lane, width and type", () => {
        const key = (tick: number, lane: number, width: number, type: string) =>
            `${tick}:${lane}:${width}:${type}`;
        const want = expected.notes
            .map(([tick, lane, width, type]) => key(tick, lane, width, type))
            .sort();
        const got = inRange
            .map((note) => key(note.tick, note.lane, note.width, note.type))
            .sort();
        expect(got).toEqual(want);
    });

    it("keeps most tenuto lengths exact and the rest within two grid steps", () => {
        const byKey = new Map(
            inRange.map((note) => [`${note.tick}:${note.lane}`, note])
        );
        const tenutos = expected.notes.filter((note) => note[3] === "tenuto");
        const diffs = tenutos.map(
            ([tick, lane, , , duration]) =>
                byKey.get(`${tick}:${lane}`)!.durationTicks - duration
        );
        expect(diffs.filter((diff) => diff === 0).length).toBe(50);
        expect(Math.max(...diffs.map(Math.abs))).toBeLessThanOrEqual(160);
    });

    it("guesses the hand by lane centre and flags the centre notes it got wrong", () => {
        const byKey = new Map(
            inRange.map((note) => [`${note.tick}:${note.lane}`, note])
        );
        const wrong = expected.notes.filter(
            ([tick, lane, , , , hand]) =>
                byKey.get(`${tick}:${lane}`)!.hand !== hand
        );
        expect(wrong.length).toBe(5);
        const flagged = new Set(conversion.handUncertainIds);
        expect(
            wrong.every(([tick, lane]) =>
                flagged.has(byKey.get(`${tick}:${lane}`)!.id)
            )
        ).toBe(true);
    });

    it("suggests the 1/6 beat grid and starts a few beats from the right place", () => {
        expect(
            suggestVid2bmapSnap(result.barRows, collected.notes).divisor
        ).toBe(6);
        const start = defaultVid2bmapFirstBarTick(
            result.barRows,
            collected.notes,
            timingPoints
        );
        expect(Number.isInteger((expected.firstBarTick - start) / 480)).toBe(
            true
        );
    });

    it("finds no bar-line gaps and agrees with the chart BPM", () => {
        const kinds = conversion.warnings.map((warning) => warning.kind);
        expect(kinds).not.toContain("missingBar");
        expect(kinds).not.toContain("extraBar");
        expect(kinds).not.toContain("bpmMismatch");
    });
});

describe("vid2bmap warnings", () => {
    const base: Vid2bmapResult = {
        fps: 60,
        startSec: 0,
        barRows: [0, 40, 80, 120, 200, 240, 280, 300, 320, 360],
        simple: [
            [10, 3, 5],
            [400, 20, 22],
        ],
        tenuto: [],
        trill: [[50, 60, 10, 15]],
        glissando: [[70, 1, 3]],
    };
    const collected = collectVid2bmapNotes(base);
    const conversion = convertVid2bmap(base, collected.notes, {
        timingPoints: [point(0, 0, 120)],
        firstBarTick: 0,
        snapDivisor: 4,
        include: { standard: true, tenuto: true, trill: true },
        createId: () => crypto.randomUUID(),
    });

    it("warns about a missed or extra bar line, BPM, and always asks to check the end", () => {
        const kinds = conversion.warnings.map((warning) => warning.kind);
        expect(kinds).toContain("missingBar");
        expect(kinds).toContain("extraBar");
        expect(kinds).toContain("endCheck");
        // 40프레임 간격 @60fps = 90 BPM ≠ 120 — 곡 전체가 한 구간이라 경고 하나
        expect(kinds.filter((kind) => kind === "bpmMismatch")).toHaveLength(1);
    });

    it("never imports glissando pieces and splits a trill into two positions", () => {
        expect(conversion.notes.some((note) => note.type === "glissando")).toBe(
            false
        );
        const trill = conversion.notes.find((note) => note.type === "trill")!;
        expect([
            trill.lane,
            trill.width,
            trill.pairLane,
            trill.pairWidth,
        ]).toEqual([10, 3, 13, 3]);
        expect(conversion.warnings).toContainEqual({
            kind: "trillSplit",
            count: 1,
        });
    });
});

describe("chart note diff", () => {
    const note = (
        id: string,
        tick: number,
        lane: number,
        extra: Partial<ChartNote> = {}
    ): ChartNote => ({
        id,
        type: "standard",
        hand: "left",
        tick,
        durationTicks: 0,
        lane,
        width: 3,
        points: [],
        ...extra,
    });

    it("splits notes into same, changed, only current and only incoming", () => {
        const current = [
            note("a", 0, 3),
            note("b", 480, 10),
            note("c", 960, 20),
        ];
        const incoming = [
            note("x", 0, 3, { hand: "right" }),
            note("y", 480, 11),
            note("z", 1440, 5),
        ];
        const diff = diffChartNotes(current, incoming);
        expect(diff.same.map(([a, b]) => [a.id, b.id])).toEqual([["a", "x"]]);
        expect(
            diff.changed.map((c) => [c.current.id, c.incoming.id, c.fields])
        ).toEqual([["b", "y", ["lane"]]]);
        expect(diff.onlyCurrent.map((n) => n.id)).toEqual(["c"]);
        expect(diff.onlyIncoming.map((n) => n.id)).toEqual(["z"]);
    });
});

describe("chart position label", () => {
    const altalePoints = [point(0, 60, 90, 3, 4)];

    it("names measures and beats with fraction glyphs, before the first point as measure 0", () => {
        expect(chartPositionLabel(-480, altalePoints)).toBe("0마디 3박");
        expect(chartPositionLabel(1200, altalePoints)).toBe("1마디 3½박");
        expect(chartPositionLabel(1360, altalePoints)).toBe("1마디 3⅚박");
        expect(chartPositionLabel(1440, altalePoints)).toBe("2마디 1박");
    });

    it("restarts measures at each timing point", () => {
        const points = [point(0, 0, 120, 4, 4), point(1920, 1000, 120, 6, 8)];
        expect(chartPositionLabel(1920, points)).toBe("2마디 1박");
        expect(chartPositionLabel(1920 + 240 * 6 + 120, points)).toBe(
            "3마디 1½박"
        );
    });
});

describe("vid2bmap merge plan", () => {
    const note = (
        id: string,
        tick: number,
        lane: number,
        extra: Partial<ChartNote> = {}
    ): ChartNote => ({
        id,
        type: "standard",
        hand: "left",
        tick,
        durationTicks: 0,
        lane,
        width: 3,
        points: [],
        ...extra,
    });
    const current = [
        note("a", 0, 3),
        note("b", 480, 10),
        note("c", 960, 20),
        note("d", 1440, 5),
    ];
    const incoming = [
        note("w", 0, 3),
        note("x", 480, 11),
        note("y", 960, 16),
        note("z", 1200, 8),
        note("n", 3000, 1),
    ];
    const plan = planVid2bmapMerge(current, diffChartNotes(current, incoming));

    it("groups a moved note at one tick and keeps notes after the draft as a new section", () => {
        expect(plan.sameCount).toBe(1);
        expect(plan.items.map((item) => [item.kind, item.tick])).toEqual([
            ["changed", 480],
            ["moved", 960],
            ["onlyIncoming", 1200],
            ["onlyCurrent", 1440],
        ]);
        expect(plan.newSection.map((n) => n.id)).toEqual(["n"]);
        expect(plan.items.map(defaultVid2bmapChoice)).toEqual([
            "incoming",
            "incoming",
            "incoming",
            "current",
        ]);
    });

    it("applies choices without duplicating same notes", () => {
        const byDefault = applyVid2bmapMerge(current, plan, {}, true);
        expect(byDefault.notes.map((n) => n.id).sort()).toEqual([
            "a",
            "d",
            "n",
            "x",
            "y",
            "z",
        ]);
        expect(byDefault.removedIds.sort()).toEqual(["b", "c"]);
        const keepMine = applyVid2bmapMerge(
            current,
            plan,
            Object.fromEntries(plan.items.map((item) => [item.key, "current"])),
            false
        );
        expect(keepMine.notes.map((n) => n.id).sort()).toEqual([
            "a",
            "b",
            "c",
            "d",
        ]);
        expect(keepMine.addedIds).toEqual([]);
    });
});

describe("vid2bmap labels", () => {
    it("writes lengths in beats", () => {
        expect(beatLengthLabel(80, 480)).toBe("⅙박");
        expect(beatLengthLabel(720, 480)).toBe("1½박");
        expect(beatLengthLabel(960, 480)).toBe("2박");
    });

    it("estimates the song BPM from the median bar interval", () => {
        const rows = [0, 40, 80, 121, 160, 199, 240];
        expect(
            estimateVid2bmapBpm(
                {
                    fps: 60,
                    startSec: 0,
                    barRows: rows,
                    simple: [],
                    tenuto: [],
                    trill: [],
                    glissando: [],
                },
                [point(0, 0, 90, 3, 4)]
            )
        ).toBe(90);
    });
});

describe("vid2bmap alignment with an existing draft", () => {
    const result = altale as unknown as Vid2bmapResult & {
        expected: {
            timingPoint: ChartTimingPoint;
            notes: [number, number, number, string, number, string][];
        };
    };
    const timingPoints = [result.expected.timingPoint];
    const draft: ChartNote[] = result.expected.notes.map(
        ([tick, lane, width, type, durationTicks, hand], index) => ({
            id: `d${index}`,
            type: type as ChartNote["type"],
            hand: hand as ChartNote["hand"],
            tick,
            durationTicks,
            lane,
            width,
            points: [],
        })
    );
    const { notes } = collectVid2bmapNotes(result);

    it("finds the first bar line the draft agrees with, from a default a few beats off", () => {
        const start = defaultVid2bmapFirstBarTick(
            result.barRows,
            notes,
            timingPoints
        );
        const aligned = alignVid2bmapFirstBarTick(
            result,
            notes,
            {
                timingPoints,
                snapDivisor: 6,
                include: { standard: true, tenuto: true, trill: true },
            },
            draft,
            start
        );
        expect(aligned?.tick).toBe(-480);
        expect(aligned?.matches).toBe(232);
    });

    it("does nothing for an empty draft", () => {
        expect(
            alignVid2bmapFirstBarTick(
                result,
                notes,
                {
                    timingPoints,
                    snapDivisor: 6,
                    include: { standard: true, tenuto: true, trill: true },
                },
                [],
                0
            )
        ).toBeNull();
    });
});

describe("vid2bmap dense passages", () => {
    it("re-snaps only the notes a coarse grid squeezes onto one spot", () => {
        const dense: Vid2bmapResult = {
            fps: 60,
            startSec: 0,
            barRows: [0, 120, 240, 360],
            // 박자선 간격 120 = 1박. 1.5박 · 1.55박(칸이 겹침) + 2⅓박(1/6박에 딱 맞음)
            simple: [
                [180, 5, 7],
                [186, 6, 8],
                [280, 20, 22],
            ],
            tenuto: [],
            trill: [],
            glissando: [],
        };
        const { notes } = collectVid2bmapNotes(dense);
        const conversion = convertVid2bmap(dense, notes, {
            timingPoints: [point(0, 0, 90, 3, 4)],
            firstBarTick: 0,
            snapDivisor: 6,
            include: { standard: true, tenuto: true, trill: true },
        });
        const ticks = conversion.notes
            .map((note) => note.tick)
            .sort((a, b) => a - b);
        // 1/6박(80)로는 둘 다 720 → 겹침. 겹친 둘만 1/12박(40)으로 720 · 760, 나머지는 그대로 1120
        expect(ticks).toEqual([720, 760, 1120]);
        expect(conversion.warnings).toContainEqual({
            kind: "denseSnap",
            count: 1,
            tick: 760,
        });
    });
});
