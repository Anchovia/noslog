import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

describe("NosLog design foundation", () => {
    const directory = resolve("app/styles");
    const files = readdirSync(directory).filter(
        (name) => name.endsWith(".css") && name !== "pretendardJp.css"
    );
    const styles = files.map((name) =>
        readFileSync(resolve(directory, name), "utf8")
    );

    it("resolves every product token from the shared foundation", () => {
        const css = styles.join("\n");
        const declared = new Set(
            [...css.matchAll(/(--nl-[\w-]+):/g)].map((match) => match[1])
        );
        const missing = [...css.matchAll(/var\((--nl-[\w-]+)/g)]
            .map((match) => match[1])
            .filter((name) => !declared.has(name));
        expect([...new Set(missing)]).toEqual([]);
    });

    it("keeps all ordinary UI selectors out of the preserved viewer and admin scope", () => {
        const unscoped: string[] = [];
        styles.forEach((css) =>
            postcss.parse(css).walkRules((rule) => {
                if (
                    rule.parent?.type === "atrule" &&
                    /keyframes$/.test(rule.parent.name)
                )
                    return;
                rule.selectors.forEach((selector) => {
                    if (!selector.includes(".noslog-ui"))
                        unscoped.push(selector);
                });
            })
        );
        expect(unscoped).toEqual([]);
    });

    it("ships the original versioned Pretendard JP subsets with their license", () => {
        const fontDirectory = resolve("public/fonts/pretendard-jp/1.3.9");
        const manifest = JSON.parse(
            readFileSync(resolve(fontDirectory, "manifest.json"), "utf8")
        ) as {
            version: string;
            licenseSha256: string;
            files: { filename: string; sha256: string }[];
        };
        expect(manifest.version).toBe("1.3.9");
        expect(manifest.files.length).toBeGreaterThan(0);
        expect(
            readFileSync(resolve(fontDirectory, "LICENSE"), "utf8")
        ).toContain("SIL OPEN FONT LICENSE");
        expect(
            readFileSync(resolve(fontDirectory, "LICENSE"), "utf8")
        ).toContain("Reserved Font Name Pretendard JP.");
        expect(
            createHash("sha256")
                .update(readFileSync(resolve(fontDirectory, "LICENSE")))
                .digest("hex")
        ).toBe(manifest.licenseSha256);
        for (const file of manifest.files) {
            expect(
                createHash("sha256")
                    .update(readFileSync(resolve(fontDirectory, file.filename)))
                    .digest("hex")
            ).toBe(file.sha256);
        }
    });
});
