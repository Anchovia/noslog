import { describe, expect, it } from "vitest";

import {
    BRAND_MARK_CAT_PATH,
    BRAND_MARK_CIRCLE,
    BRAND_MARK_SIZE,
} from "@/lib/metadata/brand-mark";

const points = [
    ...BRAND_MARK_CAT_PATH.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g),
].map(([, x, y]) => [Number(x), Number(y)] as const);
const farthest = Math.max(
    ...points.map(([x, y]) =>
        Math.hypot(x - BRAND_MARK_CIRCLE.cx, y - BRAND_MARK_CIRCLE.cy)
    )
);

describe("NosLog brand mark", () => {
    it("고양이는 닫힌 한 덩어리다(2026-10-15 확정 04A flat-base — 아래 홈을 메운 모양)", () => {
        expect(BRAND_MARK_CAT_PATH.match(/M/g)).toHaveLength(1);
        expect(BRAND_MARK_CAT_PATH.trim().endsWith("Z")).toBe(true);
    });

    it("고양이가 원 안에 있다", () => {
        expect(points.length).toBeGreaterThan(100);
        expect(farthest).toBeLessThan(BRAND_MARK_CIRCLE.r);
    });

    it("앱 아이콘(지름 68% 상자)에서 maskable 안전 영역(지름 80%) 안에 든다", () => {
        // 앱 아이콘은 512 상자를 아이콘 폭의 68% 로 줄여 가운데 둔다(brand-image.tsx)
        const scale = 0.68;
        const iconRadius = farthest * scale;
        expect(iconRadius).toBeLessThan(BRAND_MARK_SIZE * 0.4);
        expect(BRAND_MARK_CIRCLE.r * scale).toBeLessThan(BRAND_MARK_SIZE * 0.4);
    });
});
