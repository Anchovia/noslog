import { describe, expect, it } from "vitest";
import { calculateBasicGrade } from "@/lib/music/basicGrade";
import { getMaxBasicGrade } from "@/lib/music/maxGrade";

const play = {
    rank: "A",
    max_combo: 156,
    is_onehand: false,
    judge_sjust: 1451,
    judge_just: 198,
    judge_good: 55,
    judge_near: 0,
    judge_miss: 124,
};
const chart = { difficulty: "Expert", level_constant: 12, note_count: 1828 };
describe("Basic Grd fallback", () => {
    it("matches an official A record, including truncation", () => {
        expect(calculateBasicGrade(play, chart)).toBe(7780);
    });
    it("matches an official S record", () => {
        expect(
            calculateBasicGrade(
                {
                    ...play,
                    rank: "S",
                    max_combo: 903,
                    judge_sjust: 1440,
                    judge_just: 91,
                    judge_good: 26,
                    judge_miss: 7,
                },
                { ...chart, note_count: 1564 }
            )
        ).toBe(11366);
    });
    it("agrees with maximum Grd for a perfect play", () => {
        expect(
            calculateBasicGrade(
                {
                    ...play,
                    rank: "P",
                    max_combo: 1828,
                    judge_sjust: 1828,
                    judge_just: 0,
                    judge_good: 0,
                    judge_miss: 0,
                },
                chart
            )
        ).toBe(getMaxBasicGrade(12, 1828, "Expert"));
    });
    it("does not guess with missing, inconsistent or unsupported inputs", () => {
        expect(
            calculateBasicGrade({ ...play, is_onehand: true }, chart)
        ).toBeNull();
        expect(
            calculateBasicGrade({ ...play, is_onehand: null }, chart)
        ).toBeNull();
        expect(
            calculateBasicGrade({ ...play, judge_just: null }, chart)
        ).toBeNull();
        expect(
            calculateBasicGrade({ ...play, max_combo: 2000 }, chart)
        ).toBeNull();
        expect(calculateBasicGrade({ ...play, rank: "B" }, chart)).toBeNull();
        expect(
            calculateBasicGrade(play, { ...chart, note_count: 1829 })
        ).toBeNull();
        expect(
            calculateBasicGrade(play, { ...chart, level_constant: null })
        ).toBeNull();
    });
});

it.each([
    [7, 906, "A2", 445, 785, 83, 18, 20, 4665],
    [7, 507, "A2", 308, 401, 90, 8, 8, 4479],
    [9, 1167, "A", 142, 883, 167, 51, 66, 4744],
    [8, 716, "S", 242, 644, 48, 16, 8, 5983],
    [10, 920, "A2", 183, 792, 90, 8, 30, 6369],
    [8, 833, "A2", 309, 716, 88, 10, 19, 5224],
] as const)(
    "calculates the reported missing-Grd case %#",
    (level, notes, rank, combo, sjust, just, good, miss, expected) => {
        expect(
            calculateBasicGrade(
                {
                    rank,
                    max_combo: combo,
                    is_onehand: false,
                    judge_sjust: sjust,
                    judge_just: just,
                    judge_good: good,
                    judge_miss: miss,
                    judge_near: 0,
                },
                { difficulty: "Hard", level_constant: level, note_count: notes }
            )
        ).toBe(expected);
    }
);
