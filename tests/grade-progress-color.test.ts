import { describe, expect, it } from "vitest";

import {
    GRADE_PROGRESS_STOPS,
    gradeProgressColor,
} from "@/lib/music/grade-progress-color";

describe("gradeProgressColor", () => {
    it("uses the rank color inside a flat band", () => {
        expect(gradeProgressColor(0.2)).toBe("var(--nl-score-grade-b)");
        expect(gradeProgressColor(0.55)).toBe("var(--nl-score-grade-a)");
        expect(gradeProgressColor(0.8791)).toBe(
            "var(--nl-score-goal-pianist-1)"
        );
        expect(gradeProgressColor(1.2)).toBe("var(--nl-score-goal-pianist-3)");
    });

    it("lands exactly on a boundary color and mixes between boundaries", () => {
        expect(gradeProgressColor(0.737)).toBe("var(--nl-score-goal-s)");
        // A+ 59.6 → S 73.7 사이 66.2% = A+ 쪽 53%
        expect(gradeProgressColor(0.662)).toBe(
            "color-mix(in oklch, var(--nl-score-grade-a) 53%, var(--nl-score-goal-s))"
        );
    });

    it("lists the same boundaries for the bar gradient", () => {
        expect(GRADE_PROGRESS_STOPS).toBe(
            "var(--nl-score-grade-b) 0%, var(--nl-score-grade-b) 40.3%, " +
                "var(--nl-score-grade-a) 49.5%, var(--nl-score-grade-a) 59.6%, " +
                "var(--nl-score-goal-s) 73.7%, var(--nl-score-goal-990k) 81.9%, " +
                "var(--nl-score-goal-pianist-1) 87.9%, var(--nl-score-goal-pianist-2) 93.95%, " +
                "var(--nl-score-goal-pianist-3) 100%"
        );
    });
});
