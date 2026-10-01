import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { BRAND_IMAGE_DARK_HEX } from "@/lib/metadata/brandImage";

describe("아이콘 · 공유 이미지 색", () => {
    const css = readFileSync(resolve("app/styles/tokens.css"), "utf8");
    // 첫 블록(.noslog-ui) = 다크 값
    const dark = css.slice(0, css.indexOf("}"));
    const token = (name: string) =>
        dark.match(new RegExp(`--nl-${name}:\\s*(#[0-9a-f]{6})`, "i"))?.[1];

    it("tokens.css 의 다크 토큰과 같다(2026-10-01 D13)", () => {
        expect(BRAND_IMAGE_DARK_HEX).toEqual({
            background: token("surface-canvas"),
            surface: token("surface-surface"),
            border: token("border-divider"),
            primary: token("identity-mark"),
            secondary: token("content-subdued"),
        });
    });
});
