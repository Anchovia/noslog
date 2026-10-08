import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { inspectTsxTokens } from "../tooling/design/tsx-tokens.mjs";

const tokens = new Set([
    "--nl-spacing-4",
    "--nl-content-primary",
    "--nl-difficulty-hard",
]);
const inspect = (source: string) =>
    inspectTsxTokens("fixture.tsx", source, tokens);

describe("TSX design token checks", () => {
    it("rejects misspelled token references, including fallbacks", () => {
        expect(
            inspect(
                '<div style={{ color: "var(--nl-contnet-primary, red)" }} />'
            )
        ).toEqual(["fixture.tsx:1: unknown token --nl-contnet-primary"]);
    });
    it("accepts known tokens and declared dynamic token families", () => {
        expect(
            inspect(
                '<div style={{ padding: "var(--nl-spacing-4)", color: `var(--nl-difficulty-${difficulty})` }} />'
            )
        ).toEqual([]);
        expect(
            inspect(
                "<div style={{ color: `var(--nl-unknown-${level})` }} />"
            )[0]
        ).toContain("unknown token --nl-unknown-");
    });
    it("rejects literal appearance values through local constants and spreads", () => {
        const violations = inspect(
            'const spacing = { padding: 8 }; const style = { ...spacing, fontSize: "14px", color: "#ffffff" }; <div style={style} />'
        );
        expect(violations).toHaveLength(3);
        expect(violations.join("\n")).toContain(
            "padding must use a shared token"
        );
    });
    it("checks both conditional branches and arbitrary utility values", () => {
        expect(
            inspect(
                '<div style={open ? { gap: 8 } : { margin: "1rem" }} className="bg-[#fff] rounded-[6px]" />'
            )
        ).toHaveLength(4);
    });
    it("checks literal values inside property branches and negative lengths", () => {
        expect(
            inspect("<div style={{ marginTop: -4, gap: open ? 8 : 0 }} />")
        ).toHaveLength(2);
    });

    it("allows zero, computed geometry, data colors and caller-provided styles", () => {
        expect(
            inspect(
                '<div style={{ margin: 0, width: `${progress}%`, height: pixels, left: point.x, backgroundPosition: "center", borderStyle: "solid", clipPath: "url(#abc)", color: item.color, gap: computedGap, padding: "calc(var(--nl-spacing-4) * 2)", ...style }} />'
            )
        ).toEqual([]);
    });

    it("keeps public TSX token references and literal appearance values consistent", () => {
        const files: string[] = [];
        function walk(directory: string) {
            for (const entry of readdirSync(directory, {
                withFileTypes: true,
            })) {
                const path = join(directory, entry.name);
                // Preserved admin/editor/viewer, story canvases and fixed Satori export are separate contracts.
                if (
                    /(?:^|\/)(?:admin|editor|chart-pattern|pattern)(?:\/|$)/.test(
                        path
                    ) ||
                    path ===
                        "features/profile/components/profile-card-image.tsx"
                )
                    continue;
                if (entry.isDirectory()) walk(path);
                else if (
                    path.endsWith(".tsx") &&
                    !path.endsWith(".stories.tsx")
                )
                    files.push(path);
            }
        }
        ["app", "features", "components/ui", "components/layout"].forEach(walk);
        const styles = readdirSync("app/styles")
            .filter((file) => file.endsWith(".css"))
            .map((file) => readFileSync(join("app/styles", file), "utf8"))
            .join("\n");
        const declared = new Set(
            [...styles.matchAll(/(--nl-[\w-]+)\s*:/g)].map((match) => match[1])
        );
        const sources = files.map((file) => ({
            file,
            source: readFileSync(file, "utf8"),
        }));
        // Chart sizing and other component-owned custom properties can be declared in style objects.
        for (const { source } of sources)
            for (const match of source.matchAll(/["'](--nl-[\w-]+)["']\s*:/g))
                declared.add(match[1]);
        expect(
            sources.flatMap(({ file, source }) =>
                inspectTsxTokens(file, source, declared)
            )
        ).toEqual([]);
    });
});
