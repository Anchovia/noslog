import { describe, expect, it } from "vitest";
import { getExamEligibility } from "@/features/exams/examEligibility";

const exam = { mode: "basic", grade: 8, requiredGrade: 2000 };
const player = {
    nostalgia_name: "PLAYER",
    grade_basic: 235000,
    grade_recital: null,
    exam_basic: null,
    exam_recital: null,
    examAchievements: [],
};

describe("public exam certification eligibility", () => {
    it("keeps Event reference-only even with an eligible player", () => {
        expect(
            getExamEligibility(
                { ...exam, mode: "event", requiredGrade: 0 },
                player
            )
        ).toBe("reference");
    });
    it("requires both synchronized grade and a nonblank private player name", () => {
        expect(getExamEligibility(exam, null)).toBe("signed-out");
        expect(
            getExamEligibility(exam, { ...player, nostalgia_name: "  " })
        ).toBe("sync-required");
        expect(
            getExamEligibility(
                { ...exam, requiredGrade: 0 },
                { ...player, grade_basic: null }
            )
        ).toBe("sync-required");
    });
    it("uses the selected mode and accepts the exact entry threshold", () => {
        expect(
            getExamEligibility(exam, { ...player, grade_basic: 200000 })
        ).toBe("eligible");
        expect(
            getExamEligibility(exam, { ...player, grade_basic: 199900 })
        ).toBe("insufficient");
        expect(getExamEligibility({ ...exam, mode: "recital" }, player)).toBe(
            "sync-required"
        );
    });
    it("inherits higher legacy or normalized grades only within the same mode", () => {
        expect(getExamEligibility(exam, { ...player, exam_basic: 7 })).toBe(
            "achieved"
        );
        expect(getExamEligibility(exam, { ...player, exam_basic: 9 })).toBe(
            "eligible"
        );
        expect(getExamEligibility(exam, { ...player, exam_basic: 0 })).toBe(
            "eligible"
        );
        expect(
            getExamEligibility(exam, {
                ...player,
                examAchievements: [{ exam: { mode: "basic", grade: 1 } }],
            })
        ).toBe("achieved");
        expect(
            getExamEligibility(exam, {
                ...player,
                examAchievements: [{ exam: { mode: "recital", grade: 1 } }],
            })
        ).toBe("eligible");
    });
});
