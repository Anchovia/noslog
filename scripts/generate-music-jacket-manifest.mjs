import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const jacketDirectory = path.join(projectRoot, "public", "bg");
const manifestPath = path.join(
    projectRoot,
    "lib",
    "generated",
    "music-jacket-indexes.json"
);

const jacketIndexes = (await readdir(jacketDirectory))
    // 자켓은 WebP 로 둔다(2026-09-22) — PNG 를 넣었다면 먼저 convert-music-jackets 를 돌린다
    .filter((fileName) => fileName.toLowerCase().endsWith(".webp"))
    .map((fileName) => path.parse(fileName).name)
    .sort();

await writeFile(manifestPath, `${JSON.stringify(jacketIndexes, null, 4)}\n`);

console.info(`Generated music jacket manifest (${jacketIndexes.length} files)`);
