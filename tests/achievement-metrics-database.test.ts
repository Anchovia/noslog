import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// 업적 집계 원시 SQL 이 실제 Postgres 의 지금 표 · 열에서 돈다는 것을 본다 — 타입 검사는 원시 SQL 을 보지 못해,
// P5-2 에서 지운 PlayData 의 곡 · 난이도 사본을 읽다가 운영 업적 탭이 깨졌다(2026-10-16)
vi.mock("@/lib/db", async () => {
    const value = process.env.TEST_DATABASE_URL;
    if (!value) return { default: {} };
    if (!["localhost", "127.0.0.1"].includes(new URL(value).hostname))
        throw new Error("Achievement metric tests require a local database.");
    const { PrismaClient } = await import("@prisma/client");
    const { PrismaPg } = await import("@prisma/adapter-pg");
    const { PRISMA_PG_SESSION_OPTIONS } = await import("@/lib/prisma-pg");
    return {
        default: new PrismaClient({
            adapter: new PrismaPg({
                connectionString: value,
                options: PRISMA_PG_SESSION_OPTIONS,
            }),
        }),
    };
});

import { collectAchievementMetrics } from "@/features/achievements/server/achievement-service";
import db from "@/lib/db";

describe.skipIf(!process.env.TEST_DATABASE_URL)(
    "achievement metrics on isolated PostgreSQL",
    () => {
        const musicIndex = `achievement-test-${Date.now()}`;
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
                            { difficulty: "Expert", level: 12 },
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
            await db.playData.createMany({
                data: charts.map((chart, index) => ({
                    userId: userId,
                    chartId: chart.id,
                    level: chart.level,
                    score: index === 0 ? 1_000_000 : 960_000,
                    rank: index === 0 ? "P" : "S",
                    fcType: index === 0 ? 3 : 1,
                    playCount: 1,
                    fullcomboCount: 0,
                    pianisticCount: 0,
                    maxCombo: 100,
                    gradeBasic: 10_000,
                })),
            });
        });

        afterAll(async () => {
            if (userId) await db.user.delete({ where: { id: userId } });
            await db.musicChart.deleteMany({
                where: { musicIdx: musicIndex },
            });
            await db.music.deleteMany({ where: { index: musicIndex } });
            await db.$disconnect();
        });

        it("counts records through the chart link (difficulty, category)", async () => {
            const metrics = await collectAchievementMetrics(userId);
            expect(metrics).toMatchObject({
                sRankCharts: { value: 2 },
                // NEAR 섞인 풀콤보(fc_type 1)는 FC 로 세지 않는다(K1)
                fullComboCharts: { value: 1 },
                pianistCharts: { value: 1 },
                realSRankCharts: { value: 1 },
            });
            // 곡 분류는 채보 → 곡으로 잇는다 — 이 곡 하나를 S 이상으로 얻었다
            expect(metrics.categoryBM).toMatchObject({ value: 1 });
        });

        it("reads every chart with this player's records and counts revived opinions", async () => {
            const metrics = await collectAchievementMetrics(userId);
            expect(metrics).toMatchObject({
                // Expert · Real 둘 다 S 이상인 곡 하나
                allDifficultySongs: { value: 1 },
                // Lv.1 기록이 없고, Real 의 Lv.3 은 사다리에 세지 않는다
                levelLadder: { value: 0 },
                revivedOpinions: { value: 0 },
            });
        });

        it("counts an opinion as revived only when no other opinion came in the 30 days before it", async () => {
            const [expert, real] = await db.musicChart.findMany({
                where: { musicIdx: musicIndex },
                orderBy: { id: "asc" },
            });
            const other = await db.user.create({
                data: { username: `${musicIndex}-other` },
            });
            const daysAgo = (days: number) =>
                new Date(Date.now() - days * 24 * 60 * 60 * 1000);
            try {
                await db.communityChartEvaluation.createMany({
                    data: [
                        {
                            chartId: expert.id,
                            userId: other.id,
                            opinion: "a",
                            opinionCreatedAt: daysAgo(60),
                        },
                        {
                            chartId: real.id,
                            userId: other.id,
                            opinion: "b",
                            opinionCreatedAt: daysAgo(10),
                        },
                    ],
                });
                const mine = await Promise.all(
                    [expert, real].map((chart) =>
                        db.communityChartEvaluation.create({
                            data: {
                                chartId: chart.id,
                                userId,
                                opinion: "c",
                                opinionCreatedAt: daysAgo(0),
                            },
                        })
                    )
                );
                await db.communityOpinionHelpful.createMany({
                    data: mine.map((evaluation) => ({
                        evaluationId: evaluation.id,
                        userId: other.id,
                    })),
                });
                const metrics = await collectAchievementMetrics(userId);
                // Expert 는 60일 전 의견 뒤 처음, Real 은 10일 전에 다른 의견이 있었다
                expect(metrics.revivedOpinions).toMatchObject({ value: 1 });
            } finally {
                await db.communityChartEvaluation.deleteMany({
                    where: { chart: { musicIdx: musicIndex } },
                });
                await db.user.delete({ where: { id: other.id } });
            }
        });
    }
);
