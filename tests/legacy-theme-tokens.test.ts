import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

// 옛 Tailwind 이름(bg-bg · text-text-primary · text-title …)은 nl 별칭으로 옮기고 지웠다(2026-10-15 B5 2단계)
const globals = readFileSync("app/globals.css", "utf8");
const tokens = readFileSync("app/styles/tokens.css", "utf8");

const legacyColors =
    "bg|surface|surface-muted|divider|border|text-primary|text-secondary|text-disabled|interactive|on-interactive|focus|switch-track|switch-active|switch-thumb|switch-thumb-active|success|danger|danger-surface|on-danger|chart|score|bronze|rank-p-start|rank-p-end|rank-fc|rank-s|rank-a-plus|rank-a|normal|hard|expert|real|basic|recital|genre-pops|genre-anime|genre-bm|genre-original|genre-classic-jazz|genre-variety|discord";
const legacyType =
    "display|score-display|title|wordmark|section|body|body-muted|label|caption|micro|badge|input";
const legacyClass = new RegExp(
    `(?:^|[\\s"'\`])((?:[\\w-]+:)*(?:bg|text|border(?:-[trblxy])?|divide|ring|outline|accent|fill|stroke|placeholder)-(?:${legacyColors})(?:/\\d+)?|(?:[\\w-]+:)*text-(?:${legacyType})|(?:[\\w-]+:)*rounded(?:-[trblse]{1,2})?-card)(?=$|[\\s"'\`])`,
    "g"
);

function sourceFiles(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) return sourceFiles(path);
        return /\.(?:tsx?|mjs)$/.test(path) ? [path] : [];
    });
}

describe("옛 Tailwind 이름은 없다", () => {
    it("globals.css 에 옛 색 · 모서리 이름과 글자 유틸리티가 없다", () => {
        expect(globals).not.toMatch(/--(?:color|radius)-[\w-]+\s*:/);
        expect(globals).not.toMatch(/@utility\s+text-/);
    });

    it("앱 코드가 옛 이름을 쓰지 않는다", () => {
        const found = ["app", "components", "features", "lib"]
            .flatMap(sourceFiles)
            .flatMap((file) =>
                readFileSync(file, "utf8")
                    .split("\n")
                    .flatMap((line, index) =>
                        // 줄 끝 주석(토큰 이름을 적어 둔 곳)은 클래스가 아니다
                        [
                            ...line
                                .replace(/\/\/.*$/, "")
                                .matchAll(legacyClass),
                        ].map((match) => `${file}:${index + 1} ${match[1]}`)
                    )
            );
        expect(found).toEqual([]);
    });

    it("셸 밖 html · body 바탕은 canvas · default 다크 값과 같다", () => {
        const base = globals.match(/html,\s*body\s*{([^}]*)}/)?.[1] ?? "";
        const background = base.match(/background:\s*(#[0-9a-f]+)/i)?.[1];
        const color = base.match(/[^-]color:\s*(#[0-9a-f]+)/i)?.[1];
        expect(tokens).toContain(`--nl-surface-canvas: ${background};`);
        expect(tokens).toContain(`--nl-content-default: ${color};`);
    });
});
