import { describe, expect, it } from "vitest";

import { prismaPgSessionOptions } from "@/lib/prisma-pg";

// 점검 중에는 앱 연결 자체를 읽기 전용으로 연다 — 점검 화면을 비켜 온 쓰기도 Postgres 가 거절하는지 실제 DB 로 본다
describe.skipIf(!process.env.TEST_DATABASE_URL)(
    "maintenance read-only connection on isolated PostgreSQL",
    () => {
        async function client(maintenance: boolean) {
            const value = process.env.TEST_DATABASE_URL!;
            if (!["localhost", "127.0.0.1"].includes(new URL(value).hostname))
                throw new Error("Maintenance tests require a local database.");
            const { PrismaClient } = await import("@prisma/client");
            const { PrismaPg } = await import("@prisma/adapter-pg");
            return new PrismaClient({
                adapter: new PrismaPg({
                    connectionString: value,
                    options: prismaPgSessionOptions(maintenance),
                }),
            });
        }

        it("rejects writes and keeps reads while in maintenance", async () => {
            const db = await client(true);
            try {
                await expect(db.user.count()).resolves.toBeTypeOf("number");
                await expect(
                    db.user.create({
                        data: { username: `maintenance-${Date.now()}` },
                    })
                ).rejects.toThrow(/read-only/);
                await expect(
                    db.$executeRaw`UPDATE users SET username = username WHERE false`
                ).rejects.toThrow(/read-only/);
            } finally {
                await db.$disconnect();
            }
        });

        it("writes normally outside maintenance", async () => {
            const db = await client(false);
            try {
                await expect(
                    db.$executeRaw`UPDATE users SET username = username WHERE false`
                ).resolves.toBe(0);
            } finally {
                await db.$disconnect();
            }
        });
    }
);
