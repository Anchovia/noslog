import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
    EXAM_TIER_DARK_HEX,
    gradeBandTone,
    STAT_TONE_DARK_HEX,
} from "@/lib/music/scoreTone";

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

    it("공유 카드용 다크 값이 tokens.css 의 다크 토큰과 같다", () => {
        const css = readFileSync(resolve("app/styles/tokens.css"), "utf8");
        // 첫 블록(.noslog-ui) = 다크 값
        const dark = css.slice(0, css.indexOf("}"));
        const token = (name: string) =>
            dark.match(new RegExp(`--nl-${name}:\\s*(#[0-9a-f]{6})`, "i"))?.[1];
        const mix = (a: string, b: string) =>
            "#" +
            [1, 3, 5]
                .map((i) =>
                    Math.round(
                        (parseInt(a.slice(i, i + 2), 16) +
                            parseInt(b.slice(i, i + 2), 16)) /
                            2
                    )
                        .toString(16)
                        .padStart(2, "0")
                )
                .join("");
        expect(STAT_TONE_DARK_HEX).toEqual({
            "rank-1": token("exam-tier-top"),
            "rank-2": token("exam-tier-high"),
            "rank-3": token("exam-tier-mid"),
            rank: token("content-subdued"),
            "grade-1": token("judgement-near"),
            "grade-2": token("judgement-good"),
            "grade-3": token("judgement-just"),
            "grade-4": mix(
                token("judgement-just")!,
                token("judgement-s-just")!
            ),
            "grade-5": token("judgement-s-just"),
        });
        // 검정 명판(공유 카드, 2026-09-26 E4)
        expect(EXAM_TIER_DARK_HEX).toEqual({
            low: token("exam-tier-low"),
            mid: token("exam-tier-mid"),
            high: token("exam-tier-high"),
            top: token("exam-tier-top"),
            peak: token("exam-tier-peak"),
            topTint: token("exam-tint-top"),
            peakPlate: token("exam-plate-peak"),
        });
    });
});
