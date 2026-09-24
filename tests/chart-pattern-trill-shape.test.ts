import { describe, expect, it } from "vitest";

import type { ChartNote } from "@/lib/chart-pattern/schema";
import {
    trillHexes,
    trillSolidSpan,
    trillUnion,
} from "@/lib/chart-pattern/trillShape";

const trill = (extra: Partial<ChartNote> = {}): ChartNote => ({
    id: "t",
    type: "trill",
    hand: "right",
    tick: 1200,
    durationTicks: 240,
    lane: 15,
    width: 3,
    pairLane: 16,
    pairWidth: 3,
    points: [],
    ...extra,
});

describe("trill shape (B′)", () => {
    it("spans both positions for the head, tail and hexagons", () => {
        expect(trillUnion(trill())).toEqual({ lane: 15, width: 4 });
        // 에디터 기본(바로 옆에 붙음)
        expect(trillUnion(trill({ pairLane: 18 }))).toEqual({
            lane: 15,
            width: 6,
        });
    });

    it("stacks 1/12-quarter hexagons alternating from the first position", () => {
        const hexes = trillHexes(trill(), 480);
        // ½박(240틱) ÷ 40틱 = 6개
        expect(hexes).toHaveLength(6);
        expect(hexes.map((hex) => hex.lane)).toEqual([15, 16, 15, 16, 15, 16]);
        expect([hexes[0].startTick, hexes.at(-1)!.endTick]).toEqual([
            1200, 1440,
        ]);
        // 끝이 격자에 안 맞으면 마지막 육각형이 짧다
        expect(
            trillHexes(trill({ durationTicks: 100 }), 480).map(
                (hex) => hex.endTick - hex.startTick
            )
        ).toEqual([40, 40, 20]);
    });

    it("keeps the struck position solid and fades toward the other side", () => {
        const union = trillUnion(trill());
        expect(trillSolidSpan({ lane: 15, width: 3 }, union)).toEqual({
            from: 0,
            to: 0.75,
            fadeLeft: false,
            fadeRight: true,
        });
        expect(trillSolidSpan({ lane: 16, width: 3 }, union)).toEqual({
            from: 0.25,
            to: 1,
            fadeLeft: true,
            fadeRight: false,
        });
    });
});
