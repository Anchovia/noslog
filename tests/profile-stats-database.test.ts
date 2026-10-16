import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// 프로필 통계 탭의 원시 SQL 집계(2026-10-16 D8 · R1)가 실제 Postgres 의 지금 표 · 열에서 돌고, 예전 JS 집계와 같은 칸 규칙인지 본다
vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));
vi.mock("@/lib/db", async () => {
    const value = process.env.TEST_DATABASE_URL;
    if (!value) return { default: {} };
    if (!["localhost", "127.0.0.1"].includes(new URL(value).hostname))
        throw new Error("Profile stats tests require a local database.");
    const { PrismaClient } = await import("@prisma/client");
    return { default: new PrismaClient({ datasourceUrl: value }) };
});

import { getProfileStats } from "@/features/profile/server/profile-stats-service";
import db from "@/lib/db";

describe.skipIf(!process.env.TEST_DATABASE_URL)(
    "profile stats on isolated PostgreSQL",
    () => {
        const musicIndex = `profile-stats-test-${Date.now()}`;
        let userId = 0;

        beforeAll(async () => {
            await db.music.create({
                data: {
                    index: musicIndex,
                    title: "T",
                    titleKana: "T",
                    category: "BM",
                    categoryShort: "BM",
                    charts: {
                        create: [
                            { difficulty: "Normal", level: 5 },
                            { difficulty: "Hard", level: 5 },
                            { difficulty: "Expert", level: 5 },
                            { difficulty: "Real", level: 3 },
                        ],
                    },
                },
            });
            const charts = await db.musicChart.findMany({
                where: { musicIdx: musicIndex },
                orderBy: { id: "asc" },
            });
            userId = (await db.user.create({ data: { username: musicIndex } }))
                .id;
            // Normal: Pianist(P) · Hard: FC 램프 2 · Expert: NEAR 풀콤보(1)는 FC 가 아니라 A+ · Real: 판정 칸이 비어 합계에서 빠짐
            const rows = [
                { fcType: 3, rank: "P", score: 1_000_000, judged: true },
                { fcType: 2, rank: "S", score: 980_000, judged: true },
                { fcType: 1, rank: "A2", score: 930_000, judged: true },
                { fcType: 0, rank: "S", score: 960_000, judged: false },
            ];
            await db.playData.createMany({
                data: charts.map((chart, index) => ({
                    userId,
                    chartId: chart.id,
                    level: chart.level,
                    score: rows[index].score,
                    rank: rows[index].rank,
                    fcType: rows[index].fcType,
                    playCount: 1,
                    fullcomboCount: 0,
                    pianisticCount: 0,
                    maxCombo: 100,
                    gradeBasic: 10_000,
                    ...(rows[index].judged
                        ? {
                              judgeSjust: 90,
                              judgeJust: 5,
                              judgeGood: 3,
                              judgeNear: 0,
                              judgeMiss: 2,
                          }
                        : { judgeSjust: 90 }),
                })),
            });
        });

        afterAll(async () => {
            await db.playData.deleteMany({ where: { userId } });
            await db.user.deleteMany({ where: { id: userId } });
            await db.music.deleteMany({ where: { index: musicIndex } });
            await db.$disconnect();
        });

        it("counts one bar per chart and sums complete judgements only", async () => {
            const stats = await getProfileStats(userId);
            const tiers = (difficulty: string, level: number) =>
                stats.levels.find(
                    (row) =>
                        row.difficulty === difficulty && row.level === level
                )?.tiers;
            expect(tiers("normal", 5)).toMatchObject({ pianist: 1 });
            expect(tiers("hard", 5)).toMatchObject({ fc: 1 });
            expect(tiers("expert", 5)).toMatchObject({ fc: 0, "A+": 1 });
            expect(tiers("real", 3)).toMatchObject({ S: 1 });
            expect(stats.levels.at(-1)?.difficulty).toBe("real");
            expect(stats.played).toBe(4);
            expect(stats.judgement).toEqual({
                counts: { sjust: 270, just: 15, good: 9, near: 0, miss: 6 },
                chartCount: 3,
            });
        });
    }
);
