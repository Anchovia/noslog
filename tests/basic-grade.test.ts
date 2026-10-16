import { describe, expect, it } from "vitest";
import { calculateBasicGrade } from "@/lib/music/basic-grade";
import { getMaxBasicGrade } from "@/lib/music/max-grade";

const play = {
    rank: "A",
    maxCombo: 156,
    isOnehand: false,
    judgeSjust: 1451,
    judgeJust: 198,
    judgeGood: 55,
    judgeNear: 0,
    judgeMiss: 124,
};
const chart = { difficulty: "Expert", levelConstant: 12, noteCount: 1828 };
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
                    maxCombo: 903,
                    judgeSjust: 1440,
                    judgeJust: 91,
                    judgeGood: 26,
                    judgeMiss: 7,
                },
                { ...chart, noteCount: 1564 }
            )
        ).toBe(11366);
    });
    it("agrees with maximum Grd for a perfect play", () => {
        expect(
            calculateBasicGrade(
                {
                    ...play,
                    rank: "P",
                    maxCombo: 1828,
                    judgeSjust: 1828,
                    judgeJust: 0,
                    judgeGood: 0,
                    judgeMiss: 0,
                },
                chart
            )
        ).toBe(getMaxBasicGrade(12, 1828, "Expert"));
    });
    it("does not guess with missing, inconsistent or unsupported inputs", () => {
        expect(
            calculateBasicGrade({ ...play, isOnehand: true }, chart)
        ).toBeNull();
        expect(
            calculateBasicGrade({ ...play, isOnehand: null }, chart)
        ).toBeNull();
        expect(
            calculateBasicGrade({ ...play, judgeJust: null }, chart)
        ).toBeNull();
        expect(
            calculateBasicGrade({ ...play, maxCombo: 2000 }, chart)
        ).toBeNull();
        expect(calculateBasicGrade({ ...play, rank: "B" }, chart)).toBeNull();
        expect(
            calculateBasicGrade(play, { ...chart, noteCount: 1829 })
        ).toBeNull();
        expect(
            calculateBasicGrade(play, { ...chart, levelConstant: null })
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
                    maxCombo: combo,
                    isOnehand: false,
                    judgeSjust: sjust,
                    judgeJust: just,
                    judgeGood: good,
                    judgeMiss: miss,
                    judgeNear: 0,
                },
                { difficulty: "Hard", levelConstant: level, noteCount: notes }
            )
        ).toBe(expected);
    }
);
