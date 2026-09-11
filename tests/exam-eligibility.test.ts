import { describe, expect, it } from "vitest";
import { getExamEligibility } from "@/features/exams/examEligibility";

const exam = { mode: "basic", grade: 8, requiredGrade: 2000 };
const player = {
    nostalgia_name: "PLAYER",
    grade_basic: 235000,
    grade_recital: null,
    examAchievements: [] as { exam: { mode: string; grade: number | null } }[],
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
    it("inherits a higher passed grade only within the same mode", () => {
        const passed = (grade: number | null) => ({
            ...player,
            examAchievements: [{ exam: { mode: "basic", grade } }],
        });
        expect(getExamEligibility(exam, passed(7))).toBe("achieved");
        expect(getExamEligibility(exam, passed(8))).toBe("achieved");
        expect(getExamEligibility(exam, passed(9))).toBe("eligible");
        expect(getExamEligibility(exam, passed(0))).toBe("eligible");
        expect(getExamEligibility(exam, passed(null))).toBe("eligible");
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
