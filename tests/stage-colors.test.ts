import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
    FEEDBACK_COLORS,
    HAND_COLORS,
    mixWithWhite,
    STAGE_CANVAS,
} from "@/lib/chart-pattern/stageColors";

const tokens = readFileSync("app/styles/tokens.css", "utf8");

describe("채보 무대 색", () => {
    it("캔버스 값이 토큰과 같다", () => {
        expect(tokens).toContain(`--nl-stage-canvas: ${STAGE_CANVAS};`);
        expect(tokens).toContain(`--nl-hand-left: ${HAND_COLORS.left};`);
        expect(tokens).toContain(`--nl-hand-right: ${HAND_COLORS.right};`);
        expect(tokens).toContain(
            `--nl-feedback-warning-marker: ${FEEDBACK_COLORS.warning};`
        );
        expect(tokens).toContain(
            `--nl-feedback-destructive: ${FEEDBACK_COLORS.destructive};`
        );
    });

    it("눌린 건반은 손 색을 흰색과 섞는다", () => {
        expect(mixWithWhite("#000000", 0.5)).toBe(0x808080);
        expect(mixWithWhite("#ffffff", 0.3)).toBe(0xffffff);
    });
});
