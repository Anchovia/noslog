import { describe, expect, it } from "vitest";

import {
    EXAM_TIER_DARK_HEX,
    gradeBandTone,
    STAT_TONE_DARK_HEX,
} from "@/lib/music/score-tone";

import { darkToken } from "./helpers/design-tokens";

describe("Grd · 레이팅 구간 색", () => {
    it("6,000 · 6,500 · 7,000 · 7,500 · 8,000 에서 한 단계씩 오른다", () => {
        expect(gradeBandTone(5999.99)).toBeUndefined();
        expect(gradeBandTone(6000)).toBe("grade-1");
        expect(gradeBandTone(6500)).toBe("grade-2");
        expect(gradeBandTone(7261.51)).toBe("grade-3");
        expect(gradeBandTone(7500)).toBe("grade-4");
        expect(gradeBandTone(8583)).toBe("grade-5");
        expect(gradeBandTone(null)).toBeUndefined();
    });

    it("공유 카드용 다크 값이 tokens/colors.css 의 다크 토큰과 같다", () => {
        const token = (name: string) =>
            darkToken(name)?.match(/^#[0-9a-f]{6}$/i)?.[0];
        expect(STAT_TONE_DARK_HEX).toEqual({
            "rank-1": token("content-subdued"),
            "rank-2": token("content-subdued"),
            "rank-3": token("content-subdued"),
            rank: token("content-subdued"),
            "grade-1": token("score-grade-b"),
            "grade-2": token("score-grade-a"),
            "grade-3": token("score-goal-s"),
            "grade-4": token("score-goal-990k"),
        });
        // 검정 명판(공유 카드, 2026-09-26 E4)
        expect(EXAM_TIER_DARK_HEX).toEqual({
            low: token("exam-tier-low"),
            mid: token("exam-tier-mid"),
            high: token("exam-tier-high"),
            top: token("exam-tier-top"),
            peak: token("exam-tier-peak"),
            ground: token("surface-canvas"),
        });
    });
});
