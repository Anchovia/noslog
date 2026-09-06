import { describe, expect, it } from "vitest";
import {
    aggregatePatternRatings,
    canContributeGoalVote,
    summarizeGoalVotes,
} from "@/features/music/lib/community";
import {
    communityEvaluationInputSchema,
    EMPTY_PATTERN_RATINGS,
    goalVoteInputSchema,
} from "@/features/music/schemas/communitySchema";

describe("2.0 chart community contract", () => {
    it("keeps a selected zero distinct from an omitted axis", () => {
        const result = aggregatePatternRatings([
            { ...EMPTY_PATTERN_RATINGS, stairs: 0, chords: 4 },
            { ...EMPTY_PATTERN_RATINGS, stairs: 0 },
            { ...EMPTY_PATTERN_RATINGS, stairs: 3 },
        ]);
        expect(result.stairs).toEqual({ count: 3, average: 1 });
        expect(result.chords).toEqual({ count: 1, average: null });
        expect(result.polyrhythm).toEqual({ count: 0, average: null });
    });
    it("accepts pattern-only and opinion-only evaluations without a perceived constant", () => {
        expect(
            communityEvaluationInputSchema.safeParse({
                ...EMPTY_PATTERN_RATINGS,
                chartId: 1,
                stairs: 0,
                opinion: "",
            }).success
        ).toBe(true);
        expect(
            communityEvaluationInputSchema.safeParse({
                ...EMPTY_PATTERN_RATINGS,
                chartId: 1,
                opinion: "Useful advice",
            }).success
        ).toBe(true);
        expect(
            communityEvaluationInputSchema.safeParse({
                ...EMPTY_PATTERN_RATINGS,
                chartId: 1,
                opinion: " ",
            }).success
        ).toBe(false);
    });
    it("rejects ratings outside the approved scale and invalid goal increments", () => {
        expect(
            communityEvaluationInputSchema.safeParse({
                ...EMPTY_PATTERN_RATINGS,
                chartId: 1,
                chords: 5,
                opinion: "",
            }).success
        ).toBe(false);
        const input = { chartId: 1, mode: "basic", goal: "s", value: 14.5 };
        expect(goalVoteInputSchema.safeParse(input).success).toBe(true);
        for (const value of [0.9, 14.6, 12.55, Number.NaN])
            expect(
                goalVoteInputSchema.safeParse({ ...input, value }).success
            ).toBe(false);
    });
    it("checks mode and goal independently against the exact chart record", () => {
        const record = {
            score: 940_000,
            rank: "A+",
            fc_type: 2,
            grade_recital: 0,
        };
        expect(canContributeGoalVote(record, "basic", "s")).toBe(false);
        expect(canContributeGoalVote(record, "basic", "fc")).toBe(true);
        expect(canContributeGoalVote(record, "basic", "pianist")).toBe(false);
        expect(canContributeGoalVote(record, "recital", "fc")).toBe(false);
        expect(
            canContributeGoalVote(
                { ...record, grade_recital: 123 },
                "recital",
                "fc"
            )
        ).toBe(true);
        expect(canContributeGoalVote(null, "basic", "s")).toBe(false);
    });
    it("publishes the arithmetic mean and retains every observed tier value", () => {
        const result = summarizeGoalVotes([13, 13.1, 13.1, 13.3, 14.5]);
        expect(result.count).toBe(5);
        expect(result.mean).toBeCloseTo(13.4);
        expect(result.median).toBe(13.1);
        expect(result.distribution).toEqual([
            { value: 13, count: 1 },
            { value: 13.1, count: 2 },
            { value: 13.3, count: 1 },
            { value: 14.5, count: 1 },
        ]);
        expect(result.lowerQuartile).toBe(13.1);
        expect(result.upperQuartile).toBe(13.3);
    });
    it("does not manufacture a community value for an empty scope", () => {
        expect(summarizeGoalVotes([])).toEqual({
            count: 0,
            mean: null,
            median: null,
            lowerQuartile: null,
            upperQuartile: null,
            distribution: [],
        });
    });
});
