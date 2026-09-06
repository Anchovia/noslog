import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("next/cache", () => ({
    unstable_cache: (callback: unknown) => callback,
}));
vi.mock("@/lib/db", async () => {
    const url = process.env.COMMUNITY_TEST_DATABASE_URL;
    if (!url) return { default: {} };
    if (!["localhost", "127.0.0.1"].includes(new URL(url).hostname))
        throw new Error("Ranking integration tests require a local database.");
    const { PrismaClient } = await import("@prisma/client");
    return { default: new PrismaClient({ datasourceUrl: url }) };
});
import db from "@/lib/db";
import { getGlobalRankingPage } from "@/features/rankings/server/globalRankingData";
import { getUserRankingPosition } from "@/features/rankings/server/rankingPosition";

describe.skipIf(!process.env.COMMUNITY_TEST_DATABASE_URL)(
    "global competition ranking with local PostgreSQL",
    () => {
        const ids: number[] = [];
        beforeAll(async () => {
            for (let i = 0; i < 28; i++) {
                const user = await db.user.create({
                    data: {
                        username: `rank-${Date.now()}-${i}`,
                        country: "ja-JP",
                        grade_basic:
                            i === 0
                                ? 900_000
                                : i === 27
                                  ? 700_000
                                  : 800_049 - i,
                        grade_recital: i === 0 ? 700_000 : 600_000,
                        exam_basic: 2,
                        exam_recital: 3,
                    },
                });
                ids.push(user.id);
            }
        });
        afterAll(async () => {
            await db.user.deleteMany({ where: { id: { in: ids } } });
            await db.$disconnect();
        });
        it("retains rounded-value ties across the 25-player boundary and locates the actual personal page", async () => {
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
            expect(first.rows).toHaveLength(25);
            expect(first.rows[0]).toMatchObject({
                id: ids[0],
                rank: 1,
                value: 9000,
                exam: 2,
            });
            expect(first.rows[24]).toMatchObject({ rank: 2, value: 8000 });
            expect(second.rows.slice(0, 3).map((row) => row.rank)).toEqual([
                2, 2, 28,
            ]);
            expect(first.currentUser).toMatchObject({
                id: ids[26],
                rank: 2,
                page: 2,
            });
        });
        it("keeps profile rank consistent with the published ranking and uses the active-mode exam", async () => {
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
            expect(result.rows[0]).toMatchObject({ value: 7000, exam: 3 });
            expect(result.currentUser).toMatchObject({ rank: 2, page: 2 });
        });
    }
);
