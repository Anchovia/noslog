// 새 마이그레이션의 잠금 · 호환 위험을 Squawk 로 검사한다(2026-10-16 DB 재설계 D11).
// 이미 운영에 적용된 옛 마이그레이션은 고칠 수 없으므로 기준선 뒤에 만든 것만 본다.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

// 이 시각 이후(포함)에 만든 마이그레이션 — 그 앞은 이미 운영에 적용됐다
const BASELINE = "20261016050000";
const root = path.resolve("prisma/migrations");
const files = readdirSync(root, { withFileTypes: true })
    .filter(
        (entry) => entry.isDirectory() && entry.name.slice(0, 14) >= BASELINE
    )
    .map((entry) => path.join(root, entry.name, "migration.sql"))
    .filter((file) => existsSync(file));

if (!files.length) {
    console.log(`검사할 새 마이그레이션이 없습니다(기준선 ${BASELINE} 부터).`);
    process.exit(0);
}
const result = spawnSync("npx", ["squawk", ...files], { stdio: "inherit" });
process.exit(result.status ?? 1);
