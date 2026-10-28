import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { compile } from "tailwindcss";
import postcss from "postcss";
import ts from "typescript";
import { describe, expect, it } from "vitest";

import { reachableTsxFiles } from "../tooling/design/tsx-tokens.mjs";

describe("NosLog Tailwind aliases", () => {
    it("compiles aliases without changing default utility names or approved typography", async () => {
        const aliases = readFileSync(
            resolve("app/styles/tailwind-theme.css"),
            "utf8"
        );
        const theme = readFileSync(
            resolve("node_modules/tailwindcss/theme.css"),
            "utf8"
        );
        const compiler = await compile(
            `${theme}\n@tailwind utilities;\n${aliases}`
        );
        const css = postcss.parse(
            compiler.build([
                "gap-16",
                "gap-nl-16",
                "bg-nl-canvas",
                "h-nl-control",
                "rounded-nl-control",
            ])
        );
        const declarations = new Map<string, Record<string, string>>();
        css.walkRules((rule) => {
            const values: Record<string, string> = {};
            rule.walkDecls((decl) => {
                values[decl.prop] = decl.value;
            });
            declarations.set(rule.selector, values);
        });
        expect(declarations.get(".gap-16")?.gap).toBe(
            "calc(var(--spacing) * 16)"
        );
        expect(declarations.get(".gap-nl-16")?.gap).toBe(
            "var(--nl-spacing-16)"
        );
        expect(declarations.get(".bg-nl-canvas")?.["background-color"]).toBe(
            "var(--nl-surface-canvas)"
        );
        expect(declarations.get(".h-nl-control")?.height).toBe(
            "var(--nl-control-height)"
        );
        expect(declarations.get(".rounded-nl-control")?.["border-radius"]).toBe(
            "var(--nl-radius-control)"
        );
        expect(aliases).not.toMatch(/--(?:text|font-weight)-/);
    });
});

// 부품 제목 색은 components 레이어에 둔다. 레이어 밖이면 함께 붙인 Tailwind 색(관리자 동기화 요약 · 난이도 이름)을 덮는다.
// 레이어 안으로 옮기면 Tailwind 색 클래스가 제목 색을 이기므로, 공개 화면에서는 제목에 색 클래스를 겹치지 않아야 content/strong 이 그대로다.
describe("부품 제목 색과 Tailwind 색 유틸리티", () => {
    it("제목 색은 utilities 보다 앞선 components 레이어 안에서 content/strong 이다", () => {
        const tokens = postcss.parse(
            readFileSync(resolve("app/styles/tokens.css"), "utf8")
        );
        const colors: { layer: string | null; value: string }[] = [];
        tokens.walkRules(".noslog-ui .nl-component-title", (rule) => {
            rule.walkDecls("color", (decl) => {
                const parent = rule.parent;
                colors.push({
                    layer:
                        parent?.type === "atrule" &&
                        (parent as postcss.AtRule).name === "layer"
                            ? (parent as postcss.AtRule).params
                            : null,
                    value: decl.value,
                });
            });
        });
        expect(colors).toEqual([
            { layer: "components", value: "var(--nl-content-strong)" },
        ]);
        expect(
            readFileSync(resolve("node_modules/tailwindcss/index.css"), "utf8")
        ).toMatch(/^@layer theme, base, components, utilities;/);
    });

    it("공개 화면 TSX 는 nl-component-title 에 text-nl-* 색을 겹치지 않는다", () => {
        // 공개 화면 = 관리자 밖 라우트가 import 로 닿는 TSX(design-tsx-tokens 와 같은 기준)
        const files = reachableTsxFiles(resolve("."), {
            excludedRoutes: /^app\/admin(?:\/|$)/,
        }).filter(
            (path: string) =>
                path.endsWith(".tsx") &&
                !path.endsWith(".stories.tsx") &&
                !/(?:^|\/)(?:admin|editor)(?:\/|$)/.test(path)
        );
        expect(files).toContain("components/ui/modal-dialog.tsx");
        const overlaps: string[] = [];
        for (const path of files) {
            const source = ts.createSourceFile(
                path,
                readFileSync(resolve(path), "utf8"),
                ts.ScriptTarget.Latest,
                true,
                ts.ScriptKind.TSX
            );
            (function visit(node: ts.Node) {
                if (
                    ts.isJsxAttribute(node) &&
                    node.name.getText(source) === "className" &&
                    node.initializer
                ) {
                    const text = node.initializer.getText(source);
                    if (
                        text.includes("nl-component-title") &&
                        /\btext-nl-[\w-]+/.test(text)
                    ) {
                        const { line } = source.getLineAndCharacterOfPosition(
                            node.getStart(source)
                        );
                        overlaps.push(`${path}:${line + 1}`);
                    }
                }
                ts.forEachChild(node, visit);
            })(source);
        }
        expect(overlaps).toEqual([]);
    }, 30_000);
});
