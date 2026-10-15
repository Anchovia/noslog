import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
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
const argument = (name) =>
    process.argv
        .find((value) => value.startsWith("--" + name + "="))
        ?.slice(name.length + 3);
const archive = argument("archive");
// 화면용 공식 분할판(2026-10-15 D1) — 저장소 v1.3.9 태그의 dist/web/variable 분할 CSS 와
// packages/pretendard-jp/dist/web/variable/woff2-dynamic-subset 조각을 받은 폴더(jp-dynamic.css + subset/*.woff2)
const subsetDirectory = argument("subset");
if (!archive || !subsetDirectory) {
    throw new Error(
        "Usage: node scripts/vendor-pretendard-jp.mjs --archive=/path/to/PretendardJP-1.3.9.zip --subset=/path/to/downloaded-subset"
    );
}
const tagUrl =
    "https://raw.githubusercontent.com/orioncactus/pretendard/v" + version;
const subsetCssSource =
    tagUrl + "/dist/web/variable/pretendardvariable-jp-dynamic-subset.css";
const subsetFileSource =
    tagUrl + "/packages/pretendard-jp/dist/web/variable/woff2-dynamic-subset/";
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
const cssTarget = new URL("../app/styles/pretendard-jp.css", import.meta.url);
// 화면 글꼴 — 저작권자가 배포한 분할판(unicode-range 조각) 그대로, 주소만 우리 경로로. 쓰는 글자 묶음만 받는다(2026-10-15 D1).
// 한 파일 원본은 북마클릿 오버레이(공식 사이트)용으로 그대로 둔다
const subsetCss = await readFile(
    path.join(subsetDirectory, "jp-dynamic.css"),
    "utf8"
);
const subsetPrefix =
    "../../../packages/pretendard-jp/dist/web/variable/woff2-dynamic-subset/";
const subsetNames = [
    ...new Set(
        [
            ...subsetCss.matchAll(/PretendardJPVariable\.subset\.\d+\.woff2/g),
        ].map((match) => match[0])
    ),
].sort((a, b) => Number(a.split(".")[2]) - Number(b.split(".")[2]));
if (!subsetCss.includes(subsetPrefix) || subsetNames.length === 0)
    throw new Error("Unexpected Pretendard JP dynamic subset CSS.");
const css =
    "/* Official Pretendard JP 1.3.9 dynamic subset (unmodified files, local paths). */\n" +
    subsetCss.replaceAll(
        subsetPrefix,
        "/fonts/pretendard-jp/" + version + "/dynamic-subset/"
    );
await mkdir(directory, { recursive: true });
await writeFile(new URL(filename, directory), font);
await mkdir(new URL("dynamic-subset/", directory), { recursive: true });
const subsetFiles = [];
for (const name of subsetNames) {
    const bytes = await readFile(path.join(subsetDirectory, "subset", name));
    await writeFile(new URL("dynamic-subset/" + name, directory), bytes);
    subsetFiles.push({
        filename: "dynamic-subset/" + name,
        source: subsetFileSource + name,
        bytes: bytes.length,
        sha256: sha256(bytes),
    });
}
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
            delivery: "dynamic-subset",
            cssSource: subsetCssSource,
            licenseSource: releaseUrl + "#LICENSE.txt",
            licenseSha256: licenseHash,
            files: [
                {
                    filename,
                    source: releaseUrl + "#" + archiveEntry,
                    bytes: font.length,
                    sha256: fontHash,
                },
                ...subsetFiles,
            ],
        },
        null,
        4
    ) + "\n"
);
console.log(
    "Vendored Pretendard JP " +
        version +
        ": " +
        subsetFiles.length +
        " dynamic subset files + one complete WOFF2 file."
);
