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
    .filter((fileName) => fileName.toLowerCase().endsWith(".png"))
    .map((fileName) => path.parse(fileName).name)
    .sort();

await writeFile(manifestPath, `${JSON.stringify(jacketIndexes, null, 2)}\n`);

console.info(`Generated music jacket manifest (${jacketIndexes.length} files)`);
