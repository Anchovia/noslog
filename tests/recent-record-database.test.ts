import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
vi.mock("@/lib/db", async () => {
    const value = process.env.NOSLOG_RECENT_TEST_DATABASE_URL;
    if (!value) return { default: {} };
    const url = new URL(value);
    if (
        !["localhost", "127.0.0.1"].includes(url.hostname) ||
        url.pathname !== "/noslog_recent_test"
    )
        throw new Error(
            "Recent-record integration tests require the isolated local noslog_recent_test database."
        );
    const { PrismaClient } = await import("@prisma/client");
    return { default: new PrismaClient({ datasourceUrl: value }) };
});
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));
import db from "@/lib/db";
import { updateRecentPlay } from "@/lib/services/user/updateRecentPlay";
import { updateRecentBestRecords } from "@/lib/services/user/updateRecentBestRecords";
import { updatePlayData } from "@/lib/services/user/updatePlayData";
import { updateGrade } from "@/lib/services/user/updateGrade";
import { getUserChartScoreTrend } from "@/features/music/server/musicDetailData";
import { getGlobalRankingPage } from "@/features/rankings/server/globalRankingData";
import type { SyncMusicInput } from "@/lib/services/music/updateMusic";

describe.skipIf(!process.env.NOSLOG_RECENT_TEST_DATABASE_URL)(
    "recent record pipeline on isolated PostgreSQL",
    () => {
        let userId: number;
        let chartId: number;
        const musicIndex = `recent-test-${Date.now()}`;
        const play = (time: string, score: number) => ({
            artist: "Test",
            best_score: score,
            class_basic: "03",
            difficulty: "Expert",
            fast_count: 10,
            is_onehand: false,
            judge_count: [900, 80, 10, 10, 0] as [
                number,
                number,
                number,
                number,
                number,
            ],
            level: 12,
            license: "",
            score,
            slow_count: 10,
            max_combo: 900,
            rank: "s",
            play_time: time,
            music: musicIndex,
            title: "Test",
            grade_basic: Math.floor(score / 100),
        });
        const sync = (time: string, scope = "recent") =>
            db.dataSync.create({
                data: {
                    user_id: userId,
                    sync_scope: scope,
                    started_at: new Date(time),
                    status: "processing",
                },
            });
        const record = () =>
            db.playData.findUniqueOrThrow({
                where: {
                    user_id_chart_id: { user_id: userId, chart_id: chartId },
                },
            });
        beforeAll(async () => {
            userId = (
                await db.user.create({
                    data: { username: musicIndex, hide_play_scores: false },
                })
            ).id;
            await db.music.create({
                data: {
                    index: musicIndex,
                    title: "Test",
                    title_kana: "Test",
                    category: "Test",
                    category_short: "T",
                },
            });
            chartId = (
                await db.musicChart.create({
                    data: {
                        music_idx: musicIndex,
                        difficulty: "Expert",
                        level: 12,
                        note_count: 1000,
                    },
                })
            ).id;
        });
        afterAll(async () => {
            await db.$executeRawUnsafe(
                'ALTER TABLE "PlayData" DROP CONSTRAINT IF EXISTS "recent_test_count_limit"'
            );
            if (userId) await db.user.delete({ where: { id: userId } });
            await db.music.deleteMany({ where: { index: musicIndex } });
            await db.$disconnect();
        });
        it("accumulates recent plays, computes Grd/ranking, and keeps intermediate chart improvements", async () => {
            const first = await sync("2026-09-20T02:00:00Z");
            await updateRecentPlay(
                userId,
                [
                    play("2026/09/20 10:00", 950000),
                    play("2026/09/20 10:10", 970000),
                ],
                first.id
            );
            expect(await updateRecentBestRecords(userId, first.id)).toBe(1);
            await updateGrade(userId);
            expect(await record()).toMatchObject({
                score: 970000,
                play_count: 2,
                grade_basic: 9700,
                grade_recital: null,
            });
            const user = await db.user.findUniqueOrThrow({
                where: { id: userId },
            });
            expect(user).toMatchObject({
                grade_basic: 9700,
                grade_recital: null,
                score_s: 1,
            });
            const ranking = await getGlobalRankingPage(
                { mode: "basic", metric: "grade", region: "all", page: 1 },
                userId
            );
            expect(ranking.rows.some((row) => row.id === userId)).toBe(true);
            const points = await getUserChartScoreTrend(
                userId,
                chartId,
                await record()
            );
            expect(points.map((point) => point.score)).toEqual([
                950000, 970000,
            ]);
            expect(points.map((point) => point.play_time)).toEqual([
                "2026/09/20 10:00",
                "2026/09/20 10:10",
            ]);
            const second = await sync("2026-09-20T03:00:00Z");
            const result = await updateRecentPlay(
                userId,
                [
                    play("2026/09/20 10:00", 950000),
                    play("2026/09/20 10:10", 970000),
                ],
                second.id
            );
            expect(result.insertedPlays).toBe(0);
            expect(await updateRecentBestRecords(userId, second.id)).toBe(0);
            expect((await record()).play_count).toBe(2);
        });
        it("rolls back real record writes and receipts when a database constraint fails", async () => {
            const next = await sync("2026-09-20T04:00:00Z");
            await updateRecentPlay(
                userId,
                [play("2026/09/20 12:30", 980000)],
                next.id
            );
            await db.$executeRawUnsafe(
                'ALTER TABLE "PlayData" ADD CONSTRAINT "recent_test_count_limit" CHECK (play_count <= 2)'
            );
            await expect(
                updateRecentBestRecords(userId, next.id)
            ).rejects.toThrow();
            expect(await record()).toMatchObject({
                play_count: 2,
                score: 970000,
            });
            expect(
                await db.chartPlayHistory.count({
                    where: { user_id: userId, record_applied: false },
                })
            ).toBe(1);
            await db.$executeRawUnsafe(
                'ALTER TABLE "PlayData" DROP CONSTRAINT "recent_test_count_limit"'
            );
            expect(await updateRecentBestRecords(userId, next.id)).toBe(1);
            expect(await record()).toMatchObject({
                play_count: 3,
                score: 980000,
            });
        });
        it("uses official full counts, preserves historical graphs, and resumes after expiry", async () => {
            const fullSync = await sync("2026-09-21T02:00:00Z", "full");
            const full: SyncMusicInput[] = [
                {
                    "@index": musicIndex,
                    title: "Test",
                    title_kana: "Test",
                    artist: "Test",
                    category: "Test",
                    category_short: "T",
                    description: null,
                    license: "",
                    unlock_type: 0,
                    sheet: [
                        {
                            difficulty: "Expert",
                            level: 12,
                            score: 990000,
                            rank: "S",
                            fc_type: 2,
                            play_count: 100,
                            clear_count: 90,
                            clear_flag: [1],
                            fullcombo_count: 10,
                            pianistic_count: 0,
                            max_combo: 1000,
                            grade_basic: 12000,
                            grade_recital: 5000,
                            judge: [960, 40, 0, 0, 0],
                            note_success_rate: [9900, 9800, 9700, 9600],
                            besttime: "2026/09/21 10:00",
                        },
                    ],
                },
            ];
            await updatePlayData(userId, full, fullSync.id);
            const recentSync = await sync("2026-09-21T04:00:00Z");
            await updateRecentPlay(
                userId,
                [
                    play("2026/09/21 10:00", 990000),
                    play("2026/09/21 12:00", 995000),
                ],
                recentSync.id
            );
            await updateRecentBestRecords(userId, recentSync.id);
            await updateGrade(userId);
            expect(await record()).toMatchObject({
                play_count: 101,
                score: 995000,
                grade_basic: 12000,
                grade_recital: 5000,
                fullcombo_count: 10,
                note_rate_standard: 9900,
            });
            expect(
                await db.chartPlayHistory.count({ where: { user_id: userId } })
            ).toBe(5);
            expect(
                (
                    await getUserChartScoreTrend(
                        userId,
                        chartId,
                        await record()
                    )
                ).map((p) => p.score)
            ).toEqual([950000, 970000, 980000, 990000, 995000]);
            const newerFull = await sync("2026-09-22T02:00:00Z", "full");
            full[0].sheet[0].play_count = 200;
            full[0].sheet[0].score = 995000;
            full[0].sheet[0].besttime = "2026/09/21 12:00";
            await updatePlayData(userId, full, newerFull.id);
            expect((await record()).play_count).toBe(200);
            expect(
                await db.chartPlayHistory.count({ where: { user_id: userId } })
            ).toBe(5);
        });
    }
);
