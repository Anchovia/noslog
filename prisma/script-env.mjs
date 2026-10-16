import { loadEnvFile } from "node:process";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// 가져오기 스크립트 공용 env 읽기 + 대상 DB 확인(2026-10-16 DB 재설계 P0).
// 로컬 DB 가 아니면 DATABASE_EXPECTED_HOST 가 DATABASE_URL 의 호스트와 같아야 돈다 — 앱(lib/env/server.ts)과 같은 규칙.
// 엉뚱한 .env 로 운영 DB 에 쓰는 사고를 막는다. 호스트 이름은 출력하지 않는다
const LOCAL_HOSTS = new Set([
    "localhost",
    "127.0.0.1",
    "::1",
    "[::1]",
    "postgres",
]);

export function loadScriptDatabaseEnv(argv = process.argv) {
    const envFile = argv
        .find((argument) => argument.startsWith("--env-file="))
        ?.split("=")
        .slice(1)
        .join("=");

    if (envFile) {
        loadEnvFile(envFile);
    } else if (!process.env.DATABASE_URL) {
        loadEnvFile(".env");
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error("DATABASE_URL 이 없습니다.");
    }

    const host = new URL(databaseUrl).hostname;
    const expectedHost = process.env.DATABASE_EXPECTED_HOST?.trim();
    if (expectedHost) {
        if (host !== expectedHost) {
            throw new Error(
                "DATABASE_URL 의 호스트가 DATABASE_EXPECTED_HOST 와 다릅니다. 대상 DB 를 확인하세요."
            );
        }
        return;
    }

    if (!LOCAL_HOSTS.has(host)) {
        throw new Error(
            "로컬이 아닌 DB 에는 DATABASE_EXPECTED_HOST 를 그 호스트로 지정해야 실행합니다."
        );
    }
}

/** 스크립트용 Prisma 클라이언트 — Prisma 7 은 pg 어댑터로 연결한다(2026-10-16). loadScriptDatabaseEnv 뒤에 부른다 */
export function createScriptPrismaClient() {
    return new PrismaClient({
        // 세션 시간대 UTC 고정 — lib/db.ts 와 같은 까닭(adapter-pg 가 timestamptz 시차를 +00:00 으로 읽음)
        adapter: new PrismaPg({
            connectionString: process.env.DATABASE_URL,
            options: "-c TimeZone=UTC",
        }),
    });
}
