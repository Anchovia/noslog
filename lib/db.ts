import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Next.js 개발 중 모듈 재실행에도 Prisma 연결을 하나만 유지함
const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = db;
}

export default db;
