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

    it("ships one complete versioned Pretendard JP font with its license", () => {
        const fontDirectory = resolve("public/fonts/pretendard-jp/1.3.9");
        const manifest = JSON.parse(
            readFileSync(resolve(fontDirectory, "manifest.json"), "utf8")
        ) as {
            version: string;
            delivery: string;
            licenseSha256: string;
            files: { filename: string; sha256: string }[];
        };
        expect(manifest.version).toBe("1.3.9");
        expect(manifest.delivery).toBe("single-file");
        expect(manifest.files.map((file) => file.filename)).toEqual([
            "PretendardJPVariable.woff2",
        ]);
        expect(
            readdirSync(fontDirectory).filter((name) => name.endsWith(".woff2"))
        ).toEqual(["PretendardJPVariable.woff2"]);
        const fontCss = postcss.parse(
            readFileSync(resolve(directory, "pretendardJp.css"), "utf8")
        );
        const faces: postcss.AtRule[] = [];
        fontCss.walkAtRules("font-face", (face) => {
            faces.push(face);
        });
        expect(faces).toHaveLength(1);
        const descriptors: Record<string, string> = {};
        faces[0].walkDecls((declaration) => {
            descriptors[declaration.prop] = declaration.value;
        });
        expect(descriptors.src).toContain(
            "/fonts/pretendard-jp/1.3.9/PretendardJPVariable.woff2"
        );
        expect(descriptors["font-weight"]).toBe("45 920");
        expect(descriptors["font-display"]).toBe("swap");
        expect(descriptors).not.toHaveProperty("unicode-range");
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
