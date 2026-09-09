import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { format, resolveConfig } from "prettier";

const version = "1.3.9";
const filename = "PretendardJPVariable.woff2";
const archiveEntry = "web/variable/woff2/" + filename;
const releaseUrl =
    "https://github.com/orioncactus/pretendard/releases/download/v" +
    version +
    "/PretendardJP-" +
    version +
    ".zip";
const archive = process.argv
    .find((argument) => argument.startsWith("--archive="))
    ?.slice("--archive=".length);
if (!archive) {
    throw new Error(
        "Usage: node scripts/vendor-pretendard-jp.mjs --archive=/path/to/PretendardJP-1.3.9.zip"
    );
}
const font = execFileSync("unzip", ["-p", archive, archiveEntry], {
    maxBuffer: 10 * 1024 * 1024,
});
const license = execFileSync("unzip", ["-p", archive, "LICENSE.txt"]);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const fontHash = sha256(font);
const licenseHash = sha256(license);
if (
    fontHash !==
        "bc47e34e10121f5464c701a5bf463e4f5ab0981bdf2dfaf6459a23059f979ff1" ||
    licenseHash !==
        "6cb2adce04090e5e321168d5b47e12d1cb703da64929a4f34dba9162eb55eb98"
) {
    throw new Error(
        "The archive does not match the pinned Pretendard JP 1.3.9 release."
    );
}
const directory = new URL(
    "../public/fonts/pretendard-jp/" + version + "/",
    import.meta.url
);
const cssTarget = new URL("../app/styles/pretendardJp.css", import.meta.url);
const css = [
    "/* One complete, unmodified Pretendard JP 1.3.9 variable font. */",
    "@font-face {",
    '    font-family: "Pretendard JP Variable";',
    "    font-style: normal;",
    "    font-display: swap;",
    "    font-weight: 45 920;",
    '    src: url("/fonts/pretendard-jp/' +
        version +
        "/" +
        filename +
        '") format("woff2");',
    "}",
    "",
].join("\n");
await mkdir(directory, { recursive: true });
await writeFile(new URL(filename, directory), font);
await writeFile(new URL("LICENSE", directory), license);
await writeFile(
    cssTarget,
    await format(css, {
        ...(await resolveConfig(cssTarget.pathname)),
        filepath: cssTarget.pathname,
    })
);
await writeFile(
    new URL("manifest.json", directory),
    JSON.stringify(
        {
            version,
            delivery: "single-file",
            licenseSource: releaseUrl + "#LICENSE.txt",
            licenseSha256: licenseHash,
            files: [
                {
                    filename,
                    source: releaseUrl + "#" + archiveEntry,
                    bytes: font.length,
                    sha256: fontHash,
                },
            ],
        },
        null,
        4
    ) + "\n"
);
console.log("Vendored Pretendard JP " + version + ": one complete WOFF2 file.");
