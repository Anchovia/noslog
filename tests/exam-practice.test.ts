import { describe, expect, it } from "vitest";
import { getExamPractice } from "@/features/exams/examPractice";
import type { ExamStageItem } from "@/components/exams/dashboard/examDashboardTypes";

const stage: ExamStageItem = {
    id: 1,
    position: 1,
    label: null,
    requirementType: "single",
    requiredValue: 900000,
    bestValue: 912340,
    musicIndex: "example",
    title: "Example",
    artist: null,
    charts: [],
};

describe("independent-best exam practice", () => {
    it("sums only available values and preserves a missing final tune", () => {
        const result = getExamPractice([
            stage,
            {
                ...stage,
                id: 2,
                position: 2,
                requirementType: "cumulative",
                requiredValue: 1825000,
                bestValue: 891220,
            },
            {
                ...stage,
                id: 3,
                position: 3,
                requirementType: "cumulative",
                requiredValue: 2775000,
                bestValue: null,
            },
        ]);
        expect(result.availableTotal).toBe(1803560);
        expect(result.missingCount).toBe(1);
        expect(result.rows[1].gap).toBe(33780);
        expect(result.rows[2]).toMatchObject({
            best: null,
            comparison: null,
            gap: null,
        });
    });
    it("cannot compare a later cumulative threshold when an earlier tune is missing", () => {
        const result = getExamPractice([
            { ...stage, bestValue: null },
            {
                ...stage,
                id: 2,
                requirementType: "cumulative",
                bestValue: 950000,
            },
        ]);
        expect(result.rows[1].comparison).toBeNull();
        expect(result.availableTotal).toBe(950000);
    });
    it("distinguishes a recorded zero from a missing record", () => {
        const result = getExamPractice([{ ...stage, bestValue: 0 }]);
        expect(result.missingCount).toBe(0);
        expect(result.rows[0].best).toBe(0);
    });
});
