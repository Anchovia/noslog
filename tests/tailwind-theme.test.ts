import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { compile } from "tailwindcss";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

describe("NosLog Tailwind aliases", () => {
    it("compiles aliases without changing default utility names or approved typography", async () => {
        const aliases = readFileSync(
            resolve("app/styles/tailwindTheme.css"),
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
                "rounded-nl-field",
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
        expect(declarations.get(".rounded-nl-field")?.["border-radius"]).toBe(
            "var(--nl-radius-field)"
        );
        expect(aliases).not.toMatch(/--(?:text|font-weight)-/);
    });
});
