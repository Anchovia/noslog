// 새 마이그레이션 검사(2026-10-16 DB 재설계 D11 · v7).
// 1) Prisma 7.4 부터 migrate deploy 가 파일을 한 트랜잭션으로 묶지 않는다(prisma/prisma#30640) — 문장마다 따로 커밋돼
//    중간에 실패하면 반쯤 적용된다. 그래서 새 파일은 스스로 `BEGIN;` 으로 열고 `COMMIT;` 으로 닫는다.
//    트랜잭션 안에서 못 도는 `CREATE INDEX CONCURRENTLY` 파일만 예외(그 한 문장만 든 파일).
// 2) 잠금 · 호환 위험은 Squawk 로 본다.
// 이미 운영에 적용된 옛 마이그레이션은 고칠 수 없으므로 기준선 뒤에 만든 것만 본다.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

// 이 시각 이후(포함)에 만든 마이그레이션 — 그 앞은 이미 운영에 적용됐다(20261016070000 까지 배포)
const BASELINE = "20261016080000";
const root = path.resolve(process.argv[2] ?? "prisma/migrations");
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

// 주석 · 빈 줄을 뺀 문장 줄
function statements(sql) {
    return sql
        .split("\n")
        .map((line) => line.replace(/--.*$/, "").trim())
        .filter(Boolean);
}

let failed = false;
for (const file of files) {
    const lines = statements(readFileSync(file, "utf8"));
    const concurrent = lines.some((line) => /\bCONCURRENTLY\b/i.test(line));
    const wrapped =
        /^BEGIN;$/i.test(lines[0] ?? "") &&
        /^COMMIT;$/i.test(lines.at(-1) ?? "");
    if (concurrent && wrapped) {
        console.error(
            `${path.relative(process.cwd(), file)}: CONCURRENTLY 는 트랜잭션 안에서 돌 수 없습니다 — BEGIN/COMMIT 없이 그 문장만 두세요.`
        );
        failed = true;
    } else if (!concurrent && !wrapped) {
        console.error(
            `${path.relative(process.cwd(), file)}: 첫 문장은 BEGIN; 마지막 문장은 COMMIT; 이어야 합니다(Prisma 7 은 파일을 한 트랜잭션으로 묶지 않음).`
        );
        failed = true;
    }
}

const result = spawnSync("npx", ["squawk", ...files], { stdio: "inherit" });
process.exit(failed ? 1 : (result.status ?? 1));
