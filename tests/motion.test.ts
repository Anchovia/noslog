import { describe, expect, it } from "vitest";

import { cubicBezier, parseDuration } from "@/lib/motion";

describe("움직임 토큰 읽기", () => {
    it("CSS 시간 값을 ms 로 바꾼다", () => {
        expect(parseDuration("300ms")).toBe(300);
        expect(parseDuration(" 0.8s")).toBe(800);
        expect(parseDuration("0ms")).toBe(0);
        expect(parseDuration("")).toBe(0);
    });

    it("cubic-bezier 곡선을 진행률 함수로 바꾼다", () => {
        const ease = cubicBezier("cubic-bezier(0.4, 1, 0.6, 1)");
        expect(ease(0)).toBe(0);
        expect(ease(1)).toBe(1);
        // 감속 곡선 — 절반 시간에 절반보다 많이 와 있다
        expect(ease(0.5)).toBeGreaterThan(0.5);
        expect(cubicBezier("ease")(0.3)).toBe(0.3);
    });
});
