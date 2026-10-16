import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// 업적 집계 원시 SQL 이 실제 Postgres 의 지금 표 · 열에서 돈다는 것을 본다 — 타입 검사는 원시 SQL 을 보지 못해,
// P5-2 에서 지운 PlayData 의 곡 · 난이도 사본을 읽다가 운영 업적 탭이 깨졌다(2026-10-16)
vi.mock("@/lib/db", async () => {
    const value = process.env.TEST_DATABASE_URL;
    if (!value) return { default: {} };
    if (!["localhost", "127.0.0.1"].includes(new URL(value).hostname))
        throw new Error("Achievement metric tests require a local database.");
    const { PrismaClient } = await import("@prisma/client");
    return { default: new PrismaClient({ datasourceUrl: value }) };
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
                    title_kana: "T",
                    category: "BM",
                    category_short: "BM",
                    charts: {
                        create: [
                            { difficulty: "Expert", level: 12 },
                            { difficulty: "Real", level: 3 },
                        ],
                    },
                },
            });
            const charts = await db.musicChart.findMany({
                where: { music_idx: musicIndex },
                orderBy: { id: "asc" },
            });
            userId = (await db.user.create({ data: { username: musicIndex } }))
                .id;
            await db.playData.createMany({
                data: charts.map((chart, index) => ({
                    user_id: userId,
                    chart_id: chart.id,
                    level: chart.level,
                    score: index === 0 ? 1_000_000 : 960_000,
                    rank: index === 0 ? "P" : "S",
                    fc_type: index === 0 ? 3 : 1,
                    play_count: 1,
                    fullcombo_count: 0,
                    pianistic_count: 0,
                    max_combo: 100,
                    grade_basic: 10_000,
                })),
            });
        });

        afterAll(async () => {
            if (userId) await db.user.delete({ where: { id: userId } });
            await db.musicChart.deleteMany({
                where: { music_idx: musicIndex },
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
    }
);
