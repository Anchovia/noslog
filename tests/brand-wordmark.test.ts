import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
    WORDMARK_EM,
    WORDMARK_PATH,
    WORDMARK_VIEWBOX,
    wordmarkSize,
} from "@/lib/metadata/wordmark";

const asset = readFileSync(
    join(process.cwd(), "public/brand/noslog-wordmark.svg"),
    "utf8"
);

describe("NosLog wordmark", () => {
    it("화면용 파일과 이미지용 경로가 같은 모양이다", () => {
        expect(asset).toContain(`d="${WORDMARK_PATH}"`);
        const box = `${WORDMARK_VIEWBOX.x} ${WORDMARK_VIEWBOX.y} ${WORDMARK_VIEWBOX.width} ${WORDMARK_VIEWBOX.height}`;
        expect(asset).toContain(`<symbol id="wordmark" viewBox="${box}">`);
        // 색은 쓰는 곳의 글자색(identity-mark)을 따른다 — 파일에 색을 박지 않는다
        expect(asset).not.toMatch(/fill="#/);
    });

    it("크기 = 글자 크기 × 17/16, 폭은 뷰박스 비율", () => {
        expect(WORDMARK_EM).toBe(17 / 16);
        const { height, width } = wordmarkSize(20);
        expect(height).toBe(21.25);
        expect(width).toBeCloseTo(
            (21.25 * WORDMARK_VIEWBOX.width) / WORDMARK_VIEWBOX.height,
            6
        );
    });
});
