import { describe, expect, it } from "vitest";
import {
    getBestExamGrade,
    getBestExamGrades,
} from "@/features/exams/examGrades";

describe("best passed exam grade", () => {
    it("picks the smallest grade number per mode (1 is the highest)", () => {
        const achievements = [
            { exam: { mode: "basic", grade: 8 } },
            { exam: { mode: "basic", grade: 2 } },
            { exam: { mode: "basic", grade: 5 } },
            { exam: { mode: "recital", grade: 10 } },
        ];
        expect(getBestExamGrades(achievements)).toEqual({
            exam_basic: 2,
            exam_recital: 10,
        });
    });
    it("returns null without a pass in that mode and ignores event or out-of-range grades", () => {
        const achievements = [
            { exam: { mode: "event", grade: null } },
            { exam: { mode: "basic", grade: 0 } },
            { exam: { mode: "basic", grade: 11 } },
            { exam: { mode: "recital", grade: null } },
        ];
        expect(getBestExamGrade(achievements, "basic")).toBeNull();
        expect(getBestExamGrade(achievements, "recital")).toBeNull();
        expect(getBestExamGrades([])).toEqual({
            exam_basic: null,
            exam_recital: null,
        });
    });
});
