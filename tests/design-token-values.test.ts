import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { TOKEN_VALUES } from "@/lib/design-token-values";

// 그림(공유 이미지 · 캔버스)용 상수가 tokens.css 다크 값과 어긋나지 않게 막는다
const css = readFileSync(join(process.cwd(), "app/styles/tokens.css"), "utf8");
const root = css.slice(0, css.indexOf("}"));
const token = (name: string) => {
    const match = root.match(new RegExp(`--${name}:\\s*([0-9.]+)px;`));
    return match ? Number(match[1]) : undefined;
};
const weight = (name: string) => {
    const match = root.match(new RegExp(`--${name}:\\s*([0-9]+);`));
    return match ? Number(match[1]) : undefined;
};

describe("design token values for drawings", () => {
    it.each(Object.entries(TOKEN_VALUES.spacing))(
        "spacing %s",
        (step, value) => {
            expect(token(`nl-spacing-${step}`)).toBe(value);
        }
    );
    it.each(Object.entries(TOKEN_VALUES.typeSize))(
        "type size %s",
        (step, value) => {
            expect(token(`nl-type-size-${step}`)).toBe(value);
        }
    );
    it.each(Object.entries(TOKEN_VALUES.weight))("weight %s", (name, value) => {
        expect(weight(`nl-type-weight-${name}`)).toBe(value);
    });
    it.each(Object.entries(TOKEN_VALUES.radius))("radius %s", (name, value) => {
        expect(token(`nl-radius-${name}`)).toBe(value);
    });
    it.each(Object.entries(TOKEN_VALUES.stroke))("stroke %s", (name, value) => {
        expect(token(`nl-stroke-${name}`)).toBe(value);
    });
});

// 글자 역할 블록(라틴 · CJK)의 크기 · 줄 높이 — CJK 블록에 없는 값은 라틴 블록 값을 물려받는다
const roleBlock = (selector: string) => {
    const start = css.indexOf(`${selector} {\n    --nl-type-`);
    return start < 0 ? "" : css.slice(start, css.indexOf("}", start));
};
const latinRole = roleBlock(".noslog-ui");
const cjkRole = roleBlock(".noslog-ui:is(:lang(ko), :lang(ja))");
const roleScale = (block: string, name: string) => {
    const match = block.match(
        new RegExp(
            `--${name}:\\s*var\\(--nl-type-(?:size|line-height)-([0-9]+)\\);`
        )
    );
    return match ? Number(match[1]) : undefined;
};
const roleTokens = {
    pageTitleSize: "nl-type-page-title-size",
    pageTitleLineHeight: "nl-type-page-title-line-height",
    sectionTitleSize: "nl-type-section-title-size",
    sectionTitleLineHeight: "nl-type-section-title-line-height",
    lineHeightUi: "nl-type-line-height-ui",
    lineHeightBody: "nl-type-line-height-body",
    lineHeightDetail: "nl-type-line-height-detail",
    dialogTitleLineHeight: "nl-type-dialog-title-line-height",
} as const;

describe("type role values for drawings", () => {
    it.each(Object.entries(roleTokens))("latin %s", (field, name) => {
        expect(roleScale(latinRole, name)).toBe(
            TOKEN_VALUES.typeRole.latin[field as keyof typeof roleTokens]
        );
    });
    it.each(Object.entries(roleTokens))("cjk %s", (field, name) => {
        expect(roleScale(cjkRole, name) ?? roleScale(latinRole, name)).toBe(
            TOKEN_VALUES.typeRole.cjk[field as keyof typeof roleTokens]
        );
    });
    // 메타 자간은 모든 언어 0 — 토큰을 못 읽는 그림(북마클릿)도 같은 값을 쓴다
    it("detail tracking", () => {
        const tracking = latinRole.match(
            /--nl-type-tracking-detail:\s*([0-9.]+)(?:em)?;/
        );
        expect(Number(tracking?.[1])).toBe(
            TOKEN_VALUES.typeRole.latin.trackingDetailEm
        );
        expect(TOKEN_VALUES.typeRole.cjk.trackingDetailEm).toBe(
            TOKEN_VALUES.typeRole.latin.trackingDetailEm
        );
    });
});
