import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { describe, expect, it } from "vitest";

const databaseUrl = process.env.NOSLOG_NICKNAME_TEST_DATABASE_URL;
describe.skipIf(!databaseUrl)(
    "nickname normalization database invariant",
    () => {
        it("retains display spelling and rejects case/width collisions atomically", async () => {
            const target = new URL(databaseUrl!);
            if (
                target.hostname !== "127.0.0.1" ||
                target.port !== "55432" ||
                target.pathname !== "/noslog_v2"
            )
                throw new Error("Use only the local NosLog E2E database.");
            const db = new PrismaClient({ datasourceUrl: databaseUrl });
            const prefix = randomUUID().replaceAll("-", "").slice(0, 8);
            const ids: number[] = [];
            try {
                const name = `${prefix}CaRoL`;
                const user = await db.user.create({
                    data: { username: name },
                    select: { id: true, username: true },
                });
                ids.push(user.id);
                expect(user.username).toBe(name);
                await expect(
                    db.user.create({ data: { username: `${prefix}carol` } })
                ).rejects.toMatchObject({ code: "P2002" });
                await expect(
                    db.user.create({
                        data: { username: `${prefix}ＣＡＲＯＬ` },
                    })
                ).rejects.toMatchObject({ code: "P2002" });
                const kana = await db.user.create({
                    data: { username: `${prefix}カナ` },
                    select: { id: true },
                });
                ids.push(kana.id);
                await expect(
                    db.user.create({ data: { username: `${prefix}ｶﾅ` } })
                ).rejects.toMatchObject({ code: "P2002" });
            } finally {
                await db.user.deleteMany({ where: { id: { in: ids } } });
                await db.$disconnect();
            }
        });
    }
);
