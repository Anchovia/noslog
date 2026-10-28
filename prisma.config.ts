// Prisma 7 설정(2026-10-16 DB 재설계 D10 · v7) — 스키마 · 마이그레이션 위치와 DB 주소.
// v7 CLI 는 .env 를 스스로 읽지 않는다: 로컬은 .env 를 읽고, Vercel · CI 는 환경 변수를 그대로 쓴다.
import { defineConfig } from "prisma/config";

try {
    process.loadEnvFile(".env");
} catch {
    // .env 가 없는 곳(Vercel · CI)
}

// 앱은 PgBouncer(6432)로 붙고, 마이그레이션은 세션 잠금을 쓰므로 직접 연결(5432) 주소가 있으면 그쪽으로 돈다
const url = process.env.DATABASE_MIGRATION_URL ?? process.env.DATABASE_URL;

export default defineConfig({
    // 영역별 파일(2026-10-16 D9) — prisma/schema 폴더의 *.prisma 를 모두 읽는다
    schema: "prisma/schema",
    migrations: { path: "prisma/migrations" },
    // generate · validate 는 DB 주소가 없어도 된다(CI 스키마 검사)
    ...(url ? { datasource: { url } } : {}),
});
