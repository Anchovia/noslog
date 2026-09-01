import "server-only";

import { PrismaClient } from "@prisma/client";

import { serverEnv } from "@/lib/env/server";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Next.js 개발 중 모듈 재실행에도 Prisma 연결을 하나만 유지함
const db =
    globalForPrisma.prisma ??
    new PrismaClient({ datasourceUrl: serverEnv.DATABASE_URL });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = db;
}

export default db;
