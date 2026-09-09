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
import {
    getChartRanking,
    normalizeRankingPage,
} from "@/features/music/server/chartRanking";

it("normalizes invalid and out-of-range ranking pages to the first page", () => {
    for (const page of [NaN, Infinity, -1, 0, 1.5, 3])
        expect(normalizeRankingPage(page, 26)).toBe(1);
    expect(normalizeRankingPage(2, 26)).toBe(2);
    expect(normalizeRankingPage(1, 0)).toBe(1);
});

describe.skipIf(!process.env.COMMUNITY_TEST_DATABASE_URL)(
    "chart competition ranking in an isolated database",
    () => {
        const index = `e2e-ranking-${Date.now()}`;
        let chartId: number;
        const users: number[] = [];
        beforeAll(async () => {
            const music = await db.music.create({
                data: {
                    index,
                    title: "Ranking fixture",
                    title_kana: "ランキング",
                    category: "Original",
                    category_short: "Org",
                    charts: { create: { difficulty: "Expert", level: 12 } },
                },
                include: { charts: true },
            });
            chartId = music.charts[0].id;
            for (let i = 0; i < 29; i++) {
                const user = await db.user.create({
                    data: { username: `${index}-${i}` },
                });
                users.push(user.id);
                await db.playData.create({
                    data: {
                        user_id: user.id,
                        chart_id: chartId,
                        music_idx: index,
                        difficulty: "Expert",
                        level: 12,
                        score:
                            i === 0
                                ? 1_000_000
                                : i === 27
                                  ? 970000
                                  : i === 28
                                    ? 0
                                    : 980000,
                        rank: i === 0 ? "P" : "S",
                        fc_type: i === 0 ? 3 : 2,
                        play_count: 1,
                        fullcombo_count: 1,
                        pianistic_count: i === 0 ? 1 : 0,
                        max_combo: 1000,
                        grade_basic: 1000,
                        grade_recital: 0,
                        besttime:
                            i % 2
                                ? `2026/08/${String(30 - i).padStart(2, "0")} 10:00`
                                : `2026-08-${String(30 - i).padStart(2, "0")}T10:00`,
                    },
                });
            }
        });
        afterAll(async () => {
            await db.user.deleteMany({ where: { id: { in: users } } });
            await db.music.deleteMany({ where: { index } });
            await db.$disconnect();
        });
        it("keeps shared ranks across the 25-row boundary and sorts ties by achievement time", async () => {
            const first = await getChartRanking(chartId, 1);
            const second = await getChartRanking(chartId, 2);
            expect(first.totalCount).toBe(28);
            expect(first.rows).toHaveLength(25);
            expect(first.rows[0]).toMatchObject({
                position: 1,
                user_id: users[0],
            });
            expect(first.rows[1]).toMatchObject({
                position: 2,
                user_id: users[26],
            });
            expect(first.rows.slice(1).every((row) => row.position === 2)).toBe(
                true
            );
            expect(second.rows.map((row) => row.position)).toEqual([2, 2, 28]);
            expect(second.rows.map((row) => row.user_id)).toEqual([
                users[2],
                users[1],
                users[27],
            ]);
            expect(
                new Set(
                    [...first.rows, ...second.rows].map((row) => row.user_id)
                ).size
            ).toBe(28);
        });
        it("returns first-page data for an out-of-range page", async () => {
            const data = await getChartRanking(chartId, 999);
            expect(data.page).toBe(1);
            expect(data.rows[0].position).toBe(1);
        });
        it("uses the internal ID only to order a tied achievement time", async () => {
            await db.playData.updateMany({
                where: {
                    user_id: { in: [users[25], users[26]] },
                    chart_id: chartId,
                },
                data: { besttime: "2026-08-01 10:00" },
            });
            const data = await getChartRanking(chartId, 1);
            expect(
                data.rows.slice(1, 3).map((row) => [row.position, row.user_id])
            ).toEqual([
                [2, users[25]],
                [2, users[26]],
            ]);
        });
    }
);
