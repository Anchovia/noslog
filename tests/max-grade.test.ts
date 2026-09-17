import { describe, expect, it } from "vitest";

import { getGradeProgress, getMaxBasicGrade } from "@/lib/music/maxGrade";

describe("getMaxBasicGrade", () => {
    it("matches recorded Pianist grades", () => {
        // 운영 기록의 Pianist(전부 ◆JUST · 풀콤보) grade_basic
        expect(getMaxBasicGrade(6, 292, "Hard")).toBe(5927);
        expect(getMaxBasicGrade(6, 887, "Hard")).toBe(5963);
        expect(getMaxBasicGrade(7, 581, "Hard")).toBe(6935);
        expect(getMaxBasicGrade(7, 518, "Hard")).toBe(6930);
        expect(getMaxBasicGrade(5, 354, "Hard")).toBe(4942);
        expect(getMaxBasicGrade(7, 662, "Hard")).toBe(6941);
    });

    it("uses the Expert coefficient for Real and half-step constants", () => {
        expect(getMaxBasicGrade(13.5, 1000, "Real")).toBe(
            getMaxBasicGrade(13.5, 1000, "Expert")
        );
        // 13.5 × 1.5 × 9.9 × (95500 + 1000) ÷ 1200 = 16121.53 → 16121 (1004 의 1의 자리 버림 = 1000)
        expect(getMaxBasicGrade(13.5, 1004, "Real")).toBe(16121);
        // 4 × 1 × 9.9 × (95500 + 300) ÷ 1200 = 3161.4 → 3161
        expect(getMaxBasicGrade(4, 300, "Normal")).toBe(3161);
    });

    it("returns null when the constant or note count is unknown", () => {
        expect(getMaxBasicGrade(null, 500, "Real")).toBeNull();
        expect(getMaxBasicGrade(12, null, "Expert")).toBeNull();
        expect(getMaxBasicGrade(12, 0, "Expert")).toBeNull();
    });
});

describe("getGradeProgress", () => {
    it("fills the bar by the share of the maximum grade", () => {
        expect(getGradeProgress(9505, 14359)).toBeCloseTo(0.662, 3);
        expect(getGradeProgress(14359, 14359)).toBe(1);
    });

    it("stays empty without a record or a known maximum and never overflows", () => {
        expect(getGradeProgress(null, 14359)).toBe(0);
        expect(getGradeProgress(9505, null)).toBe(0);
        expect(getGradeProgress(15000, 14359)).toBe(1);
    });
});
