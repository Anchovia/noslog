import "server-only";

import { appendFileSync } from "node:fs";

import { PrismaClient } from "@prisma/client";

import { serverEnv } from "@/lib/env/server";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// 쿼리 수 실측(2026-10-16 DB 재설계 P0) — 개발에서만, 값으로 준 파일에 쿼리마다 JSON 한 줄을 붙인다.
// scripts/measure-queries.mjs 가 화면 요청 전후로 늘어난 줄을 센다. 운영 빌드에서는 켜지지 않는다
const queryLogFile =
    process.env.NODE_ENV === "production"
        ? undefined
        : process.env.NOSLOG_QUERY_LOG;

function createClient() {
    if (!queryLogFile) {
        return new PrismaClient({ datasourceUrl: serverEnv.DATABASE_URL });
    }

    const client = new PrismaClient({
        datasourceUrl: serverEnv.DATABASE_URL,
        log: [{ emit: "event", level: "query" }],
    });
    client.$on("query", (event) => {
        appendFileSync(
            queryLogFile,
            `${JSON.stringify({ at: Date.now(), ms: event.duration, sql: event.query })}\n`
        );
    });
    // 로그 옵션만 다르고 쓰는 쪽에서 보는 모양은 같다
    return client as unknown as PrismaClient;
}

// Next.js 개발 중 모듈 재실행에도 Prisma 연결을 하나만 유지함
const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = db;
}

export default db;
