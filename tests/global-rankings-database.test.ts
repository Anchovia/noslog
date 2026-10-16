import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("next/cache", () => ({
    unstable_cache: (callback: unknown) => callback,
}));
vi.mock("@/lib/db", async () => {
    const url = process.env.TEST_DATABASE_URL;
    if (!url) return { default: {} };
    if (!["localhost", "127.0.0.1"].includes(new URL(url).hostname))
        throw new Error("Ranking integration tests require a local database.");
    const { PrismaClient } = await import("@prisma/client");
    const { PrismaPg } = await import("@prisma/adapter-pg");
    const { PRISMA_PG_SESSION_OPTIONS } = await import("@/lib/prisma-pg");
    return {
        default: new PrismaClient({
            adapter: new PrismaPg({
                connectionString: url,
                options: PRISMA_PG_SESSION_OPTIONS,
            }),
        }),
    };
});
import db from "@/lib/db";
import { getGlobalRankingPage } from "@/features/rankings/server/global-ranking-data";
import { getUserRankingPosition } from "@/features/rankings/server/ranking-position";

describe.skipIf(!process.env.TEST_DATABASE_URL)(
    "global competition ranking with local PostgreSQL",
    () => {
        const ids: number[] = [];
        beforeAll(async () => {
            for (let i = 0; i < 28; i++) {
                const user = await db.user.create({
                    data: {
                        username: `rank-${Date.now()}-${i}`,
                        country: "ja-JP",
                        // Grd 는 player_stats 에서 읽는다(2026-10-16 P4)
                        stats: {
                            create: {
                                gradeBasic:
                                    i === 0
                                        ? 900_000
                                        : i === 27
                                          ? 700_000
                                          : 800_049 - i,
                                gradeRecital: i === 0 ? 700_000 : 600_000,
                            },
                        },
                    },
                });
                ids.push(user.id);
            }
        });
        afterAll(async () => {
            await db.user.deleteMany({ where: { id: { in: ids } } });
            await db.$disconnect();
        });
        it("retains rounded-value ties across the 20-player page boundary and locates the actual personal page", async () => {
            const query = {
                mode: "basic" as const,
                metric: "grade" as const,
                region: "jp" as const,
                page: 1,
            };
            const first = await getGlobalRankingPage(query, ids[26]);
            const second = await getGlobalRankingPage(
                { ...query, page: 2 },
                ids[26]
            );
            expect(first.rows).toHaveLength(20);
            expect(first.rows[0]).toMatchObject({
                id: ids[0],
                rank: 1,
                value: 9000,
                exam: null,
            });
            expect(first.rows[19]).toMatchObject({ rank: 2, value: 8000 });
            expect(second.rows.map((row) => row.rank)).toEqual([
                2, 2, 2, 2, 2, 2, 2, 28,
            ]);
            expect(first.currentUser).toMatchObject({
                id: ids[26],
                rank: 2,
                page: 2,
            });
        });
        // 검정 배지는 승인된 합격 기록에서만 나온다(d7772509). 여기서는 합격 기록이 없으니 null.
        it("keeps profile rank consistent with the published ranking", async () => {
            expect(
                await getUserRankingPosition({
                    userId: ids[26],
                    grade: 800_023,
                    mode: "basic",
                    scope: { country: "ja-JP" },
                })
            ).toBe(2);
            const result = await getGlobalRankingPage(
                { mode: "recital", metric: "grade", region: "jp", page: 1 },
                ids[26]
            );
            expect(result.rows[0]).toMatchObject({ value: 7000, exam: null });
            expect(result.currentUser).toMatchObject({ rank: 2, page: 2 });
        });
    }
);
