import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

describe("NosLog design foundation", () => {
    const directory = resolve("app/styles");
    const files = readdirSync(directory).filter(
        (name) => name.endsWith(".css") && name !== "pretendard-jp.css"
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

    // 움직임은 tokens.css 의 움직임 토큰만 쓴다 — 시간 · 곡선을 직접 쓰지 않는다(2026-09-19, 가이드 「움직임」 절)
    it("takes every transition and animation timing from the motion tokens", () => {
        const raw: string[] = [];
        files.forEach((name, index) => {
            if (name === "tokens.css") return;
            postcss.parse(styles[index]).walkDecls((decl) => {
                if (!/^(transition|animation)/.test(decl.prop)) return;
                const value = decl.value
                    .replace(/var\(--nl-[\w-]+\)/g, "")
                    .replace(/\b0s\b/g, "");
                if (
                    /\d(ms|s)\b|cubic-bezier|\b(ease|ease-in|ease-out|ease-in-out|linear|steps)\b/.test(
                        value
                    )
                )
                    raw.push(`${name}: ${decl.prop}: ${decl.value}`);
            });
        });
        expect(raw).toEqual([]);
    });

    // 간격 · 모서리 · 색 · 글자 크기는 토큰으로만 쓴다(2026-09-30 R1, 가이드 「간격 · 모서리 · 높이 · 아이콘」 절).
    // 계산식(calc 등) 안의 크기 숫자와 폭 · 높이는 보지 않는다. 관리자 화면은 손대지 않는 곳이라 뺀다.
    // 토큰으로 옮기면 모양이 바뀌는 값만 아래 예외에 이유와 함께 적는다 — 새 예외는 사용자 결정이 있을 때만
    describe("takes spacing, radius, color and font size from tokens", () => {
        const allowed = new Set([
            // 랭킹 행 명판 — 이름 글줄(20)에 맞춘 상자 여백 2/6
            "global-rankings.css: padding: var(--nl-spacing-2) 6px",
            // 빙고 미니 판 칸(6) · 범례 네모(12) — 모서리 토큰 4 는 크기에 비해 크다
            "bingos.css: border-radius: 1px",
            "bingos.css: border-radius: 2px",
            // 지도 핀 그림자 — 지도 타일 위라 면 토큰과 무관한 검정
            "arcades.css: filter: drop-shadow(0 1px 2px rgb(0 0 0 / 40%))",
        ]);
        // 안쪽부터 지운다 — 이름 없는 괄호는 계산식 안의 묶음
        const functionCall =
            /(?:\b(?:var|calc|min|max|clamp)|(?<![\w-]))\([^()]*\)/g;
        function literals(check: (prop: string, bare: string) => boolean) {
            const raw: string[] = [];
            files.forEach((name, index) => {
                if (name === "tokens.css" || name === "admin.css") return;
                postcss.parse(styles[index]).walkDecls((decl) => {
                    if (decl.prop.startsWith("--")) return;
                    let bare = decl.value;
                    for (let previous = ""; previous !== bare;) {
                        previous = bare;
                        bare = bare.replace(functionCall, "");
                    }
                    const entry = `${name}: ${decl.prop}: ${decl.value.replace(/\s+/g, " ")}`;
                    if (check(decl.prop, bare) && !allowed.has(entry))
                        raw.push(entry);
                });
            });
            return raw;
        }
        const pixels = (value: string) =>
            (value.match(/-?\d*\.?\d+px/g) ?? []).some(
                (length) => parseFloat(length) !== 0
            );

        it("spacing", () => {
            expect(
                literals(
                    (prop, bare) =>
                        /^(gap|row-gap|column-gap|padding|margin)(-|$)/.test(
                            prop
                        ) && pixels(bare)
                )
            ).toEqual([]);
        });
        it("radius", () => {
            expect(
                literals(
                    (prop, bare) =>
                        /^border(-.+)?-radius$/.test(prop) && pixels(bare)
                )
            ).toEqual([]);
        });
        // 마스크의 #000 은 색이 아니라 가림 값이라 뺀다
        it("color", () => {
            expect(
                literals(
                    (prop, bare) =>
                        !/mask/.test(prop) &&
                        /#[0-9a-f]{3,8}\b|\b(rgb|hsl)a?\(/i.test(bare)
                )
            ).toEqual([]);
        });
        it("font size", () => {
            expect(
                literals((prop, bare) => prop === "font-size" && pixels(bare))
            ).toEqual([]);
        });
    });

    it("mounts the shared navigation progress in both application shells", () => {
        const appShell = readFileSync(
            resolve("components/layout/app-shell.tsx"),
            "utf8"
        );
        const adminShell = readFileSync(
            resolve("components/admin/admin-shell.tsx"),
            "utf8"
        );

        expect(appShell).toContain("<NavigationProgress />");
        expect(adminShell).toContain("<NavigationProgress />");
        expect(adminShell).toContain("<Suspense fallback={null}>");
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
            readFileSync(resolve(directory, "pretendard-jp.css"), "utf8")
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
