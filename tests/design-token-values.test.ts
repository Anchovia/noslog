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
