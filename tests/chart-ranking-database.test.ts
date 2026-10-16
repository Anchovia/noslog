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
    return { default: new PrismaClient({ datasourceUrl: url }) };
});

import db from "@/lib/db";
import { recordBestAt } from "@/lib/services/user/recent-record-merge";
import {
    getChartRanking,
    normalizeRankingPage,
} from "@/features/music/server/chart-ranking";

it("normalizes invalid and out-of-range ranking pages to the first page", () => {
    for (const page of [NaN, Infinity, -1, 0, 1.5, 3])
        expect(normalizeRankingPage(page, 26)).toBe(1);
    expect(normalizeRankingPage(2, 26)).toBe(2);
    expect(normalizeRankingPage(1, 0)).toBe(1);
});

// 예전 두 형식(빗금 · T)을 섞어 넣는다 — 순서는 best_at 으로 정해져야 한다
const besttimeOf = (i: number) =>
    i % 2
        ? `2026/08/${String(30 - i).padStart(2, "0")} 10:00`
        : `2026-08-${String(30 - i).padStart(2, "0")}T10:00`;

describe.skipIf(!process.env.TEST_DATABASE_URL)(
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
                    titleKana: "ランキング",
                    category: "Original",
                    categoryShort: "Org",
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
                        userId: user.id,
                        chartId: chartId,
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
                        fcType: i === 0 ? 3 : 2,
                        playCount: 1,
                        fullcomboCount: 1,
                        pianisticCount: i === 0 ? 1 : 0,
                        maxCombo: 1000,
                        gradeBasic: 1000,
                        gradeRecital: 0,
                        // 동기화는 기록 시각을 best_at 에도 쓴다 — 같은 점수 순서는 이 열로 정한다(2026-10-16 P4)
                        bestAt: recordBestAt(besttimeOf(i)),
                    },
                });
            }
        });
        afterAll(async () => {
            await db.user.deleteMany({ where: { id: { in: users } } });
            await db.music.deleteMany({ where: { index } });
            await db.$disconnect();
        });
        it("keeps shared ranks across the 20-row page boundary and sorts ties by achievement time", async () => {
            const first = await getChartRanking(chartId, 1);
            const second = await getChartRanking(chartId, 2);
            expect(first.totalCount).toBe(28);
            expect(first.rows).toHaveLength(20);
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
            expect(second.rows.map((row) => row.position)).toEqual([
                2, 2, 2, 2, 2, 2, 2, 28,
            ]);
            expect(second.rows.map((row) => row.user_id)).toEqual([
                users[7],
                users[6],
                users[5],
                users[4],
                users[3],
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
                    userId: { in: [users[25], users[26]] },
                    chartId: chartId,
                },
                data: {
                    bestAt: recordBestAt("2026-08-01 10:00"),
                },
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
