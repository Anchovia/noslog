import { readFile, writeFile } from "node:fs/promises";
import { format, resolveConfig } from "prettier";

const source = new URL("../lib/design/figmaTokens.json", import.meta.url);
const target = new URL("../app/styles/tokens.css", import.meta.url);
const tokens = JSON.parse(await readFile(source, "utf8"));
const name = (value) => `--nl-${value.replaceAll("/", "-")}`;
const declaration = (key, value) => `    ${name(key)}: ${value};`;

const scale = tokens.scale
    .filter((token) => !token.name.startsWith("font/"))
    .map((token) => {
        const value = Object.values(token.values)[0];
        const unit = token.name.startsWith("motion/duration/")
            ? "ms"
            : token.name.startsWith("type/weight/") ||
                token.name === "motion/press-scale"
              ? ""
              : "px";
        return declaration(token.name, `${Number(value.toFixed(4))}${unit}`);
    });

const type = tokens.typography.map((style) => {
    const role = style.name.replace("/latin", "");
    const weight = style.font.variationSettings.wght;
    const weightName = {
        400: "regular",
        500: "medium",
        600: "semibold",
        700: "bold",
    }[weight];
    return `.noslog-ui .nl-${role} {\n    font-size: var(${name(`type/size/${style.size}`)});\n    line-height: var(${name(`type/line-height/${style.line.value}`)});\n    font-weight: var(${name(`type/weight/${weightName}`)});\n    letter-spacing: 0;\n    font-variant-numeric: ${role.startsWith("metric-") ? "tabular-nums" : "normal"};\n}`;
});

const sourceCss = [
    `/* Generated from Figma ${tokens.fileKey}. Run node scripts/generate-design-tokens.mjs. */`,
    ".noslog-ui {",
    ...scale,
    ...tokens.colors.map((token) => declaration(token.name, token.dark)),
    "}",
    'html[data-theme="light"] .noslog-ui, .noslog-ui[data-theme="light"] {',
    ...tokens.colors.map((token) => declaration(token.name, token.light)),
    "}",
    ...type,
    "",
].join("\n");
const output = await format(sourceCss, {
    ...(await resolveConfig(target.pathname)),
    filepath: target.pathname,
});

if (process.argv.includes("--check")) {
    if ((await readFile(target, "utf8")) !== output) {
        throw new Error(
            "Generated NosLog CSS differs from the Figma token snapshot."
        );
    }
} else {
    await writeFile(target, output);
}
