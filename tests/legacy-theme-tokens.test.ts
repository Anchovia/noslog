import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// 옛 Tailwind 이름은 값만 nl 토큰에 잇는다(2026-10-15 B5 1단계) — 숫자 · 색 코드를 다시 쓰지 않는다
const globals = readFileSync("app/globals.css", "utf8");
const tokens = readFileSync("app/styles/tokens.css", "utf8");

describe("옛 Tailwind 이름 → nl 토큰", () => {
    it("옛 색 · 모서리 이름은 모두 nl 토큰을 가리킨다", () => {
        const legacy = [
            ...globals.matchAll(
                /^\s*(--(?:color|radius)-[\w-]+):\s*([^;]+);/gm
            ),
        ];
        expect(legacy.length).toBeGreaterThan(0);
        expect(
            legacy
                .filter(([, , value]) => !/^var\(--nl-[\w-]+\)$/.test(value))
                .map(([, name, value]) => `${name}: ${value}`)
        ).toEqual([]);
    });

    it("옛 글자 유틸리티는 글자 토큰만 쓴다", () => {
        const utilities = globals.slice(globals.indexOf("@utility"));
        expect(utilities).not.toMatch(/@apply|\d+px|font-(black|extrabold)/);
    });

    it("셸 밖 html · body 바탕은 canvas · default 다크 값과 같다", () => {
        const base = globals.match(/html,\s*body\s*{([^}]*)}/)?.[1] ?? "";
        const background = base.match(/background:\s*(#[0-9a-f]+)/i)?.[1];
        const color = base.match(/[^-]color:\s*(#[0-9a-f]+)/i)?.[1];
        expect(tokens).toContain(`--nl-surface-canvas: ${background};`);
        expect(tokens).toContain(`--nl-content-default: ${color};`);
    });
});
