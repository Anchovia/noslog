import "server-only";

import { appendFileSync } from "node:fs";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { serverEnv } from "@/lib/env/server";
import { PRISMA_PG_SESSION_OPTIONS } from "@/lib/prisma-pg";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// 쿼리 수 실측(2026-10-16 DB 재설계 P0) — 개발에서만, 값으로 준 파일에 쿼리마다 JSON 한 줄을 붙인다.
// scripts/measure-queries.mjs 가 화면 요청 전후로 늘어난 줄을 센다. 운영 빌드에서는 켜지지 않는다
const queryLogFile =
    process.env.NODE_ENV === "production"
        ? undefined
        : process.env.NOSLOG_QUERY_LOG;

// Prisma 7 은 DB 연결을 드라이버 어댑터(pg)로 한다(2026-10-16 D10) — 세션 시간대 UTC 고정은 lib/prisma-pg.ts

function adapter() {
    return new PrismaPg({
        connectionString: serverEnv.DATABASE_URL,
        options: PRISMA_PG_SESSION_OPTIONS,
    });
}

function createClient() {
    if (!queryLogFile) {
        return new PrismaClient({ adapter: adapter() });
    }

    const client = new PrismaClient({
        adapter: adapter(),
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
