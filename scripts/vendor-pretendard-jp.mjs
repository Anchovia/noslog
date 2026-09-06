import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { format, resolveConfig } from "prettier";

const version = "1.3.9";
const cssUrl = `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v${version}/dist/web/variable/pretendardvariable-jp-dynamic-subset.min.css`;
const licenseArchiveUrl = `https://github.com/orioncactus/pretendard/releases/download/v${version}/PretendardJP-${version}.zip`;
const directory = new URL(
    `../public/fonts/pretendard-jp/${version}/`,
    import.meta.url
);
const cssTarget = new URL("../app/styles/pretendardJp.css", import.meta.url);

async function download(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status}: ${url}`);
    return Buffer.from(await response.arrayBuffer());
}

async function readJpLicense() {
    const suppliedArchive = process.argv
        .find((argument) => argument.startsWith("--license-archive="))
        ?.slice("--license-archive=".length);
    if (suppliedArchive)
        return execFileSync("unzip", ["-p", suppliedArchive, "LICENSE.txt"]);
    const temporaryDirectory = await mkdtemp(
        join(tmpdir(), "noslog-pretendard-jp-")
    );
    try {
        const archive = join(temporaryDirectory, "PretendardJP.zip");
        await writeFile(archive, await download(licenseArchiveUrl));
        return execFileSync("unzip", ["-p", archive, "LICENSE.txt"]);
    } finally {
        await rm(temporaryDirectory, { recursive: true, force: true });
    }
}

await mkdir(directory, { recursive: true });
await mkdir(new URL("../app/styles/", import.meta.url), { recursive: true });
const sourceCss = (await download(cssUrl)).toString("utf8");
const references = [
    ...new Set(
        [...sourceCss.matchAll(/url\(([^)]+)\)/g)].map((match) => match[1])
    ),
];
const files = [];
for (let offset = 0; offset < references.length; offset += 8) {
    await Promise.all(
        references.slice(offset, offset + 8).map(async (reference) => {
            const url = new URL(reference, cssUrl);
            const filename = url.pathname.split("/").at(-1);
            const bytes = await download(url);
            if (bytes.subarray(0, 4).toString() !== "wOF2")
                throw new Error(`Invalid WOFF2: ${filename}`);
            await writeFile(new URL(filename, directory), bytes);
            files.push({
                filename,
                source: url.href,
                bytes: bytes.length,
                sha256: createHash("sha256").update(bytes).digest("hex"),
            });
        })
    );
}

const css = sourceCss.replace(
    /url\(([^)]+)\)/g,
    (_, reference) =>
        `url(/fonts/pretendard-jp/${version}/${reference.split("/").at(-1)})`
);
await writeFile(
    cssTarget,
    await format(css, {
        ...(await resolveConfig(cssTarget.pathname)),
        filepath: cssTarget.pathname,
    })
);
const license = await readJpLicense();
await writeFile(new URL("LICENSE", directory), license);
await writeFile(
    new URL("manifest.json", directory),
    JSON.stringify(
        {
            version,
            cssSource: cssUrl,
            sourceCssSha256: createHash("sha256")
                .update(sourceCss)
                .digest("hex"),
            licenseSource: `${licenseArchiveUrl}#LICENSE.txt`,
            licenseSha256: createHash("sha256").update(license).digest("hex"),
            files: files.sort((a, b) => a.filename.localeCompare(b.filename)),
        },
        null,
        4
    ) + "\n"
);
console.log(
    `Vendored Pretendard JP ${version}: ${files.length} original WOFF2 subsets.`
);
