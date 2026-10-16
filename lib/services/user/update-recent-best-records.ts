import db from "@/lib/db";

import { writePlayerStats } from "./player-stats";
import type { RecordValues } from "./recent-record-merge";
import { planRecentRecordMerge } from "./recent-record-merge";

// History ingestion is separate. The projection and its receipt commit together,
// so a failure/retry cannot increment a play twice or lose a stored attempt.
export async function updateRecentBestRecords(userId: number, syncId: number) {
    return db.$transaction(
        async (tx) => {
            await tx.$queryRaw`SELECT id FROM users WHERE id = ${userId} FOR UPDATE`;
            await tx.dataSync.findUniqueOrThrow({
                where: { id: syncId, userId: userId, status: "processing" },
                select: { id: true },
            });
            // 마지막 전체 기록 시각은 player_stats 에서(2026-10-16 DB 재설계 P4)
            const stats = await tx.playerStats.findUnique({
                where: { userId },
                select: { lastFullRecordAt: true },
            });
            const history = await tx.chartPlayHistory.findMany({
                where: {
                    userId: userId,
                    OR: [{ recordApplied: false }, { gradeBasic: 0 }],
                },
                include: {
                    chart: {
                        select: {
                            id: true,
                            level: true,
                            levelConstant: true,
                            noteCount: true,
                        },
                    },
                },
            });
            if (!history.length)
                return { changedRecords: 0, changedChartIds: [] };
            const oldRecords = await tx.playData.findMany({
                where: {
                    userId: userId,
                    chartId: {
                        in: [...new Set(history.map((p) => p.chartId))],
                    },
                },
            });
            const previous = new Map<number, RecordValues>(
                oldRecords.flatMap(
                    ({
                        id: _id,
                        createdAt: _created,
                        updatedAt: _updated,
                        userId: _user,
                        chartId: chart_id,
                        ...values
                    }) => [[chart_id, values]]
                )
            );
            const plan = planRecentRecordMerge(
                previous,
                history,
                stats?.lastFullRecordAt ?? null
            );
            const records = plan.changes;
            const changed = new Map(
                history
                    .filter((play) => records.has(play.chartId))
                    .map((play) => [play.chartId, play.chart])
            );
            for (const chartId of changed.keys()) {
                const values = records.get(chartId)!;
                await tx.playData.upsert({
                    where: {
                        userId_chartId: {
                            userId: userId,
                            chartId: chartId,
                        },
                    },
                    create: {
                        ...values,
                        userId: userId,
                        chartId: chartId,
                    },
                    update: values,
                });
                await tx.chartRecordSnapshot.upsert({
                    where: {
                        syncId_chartId: {
                            syncId: syncId,
                            chartId: chartId,
                        },
                    },
                    create: {
                        ...values,
                        userId: userId,
                        chartId: chartId,
                        syncId: syncId,
                    },
                    update: values,
                });
            }
            await tx.chartPlayHistory.updateMany({
                where: { userId: userId, id: { in: plan.appliedIds } },
                data: { recordApplied: true },
            });
            if (changed.size) {
                // 랭크별 수는 DB 에서 센다(2026-10-15 S9) — 예전에는 기록 전부를 받아 JS 로 셌다
                const [counts] = await tx.$queryRaw<
                    {
                        p: number;
                        s: number;
                        a2: number;
                        a: number;
                        b2: number;
                        b: number;
                        c: number;
                        d: number;
                        f: number;
                    }[]
                >`
                    SELECT COUNT(*) FILTER (WHERE "rank" = 'P')::int AS p,
                        COUNT(*) FILTER (WHERE "rank" = 'S')::int AS s,
                        COUNT(*) FILTER (WHERE "rank" = 'A2')::int AS a2,
                        COUNT(*) FILTER (WHERE "rank" = 'A')::int AS a,
                        COUNT(*) FILTER (WHERE "rank" = 'B2')::int AS b2,
                        COUNT(*) FILTER (WHERE "rank" = 'B')::int AS b,
                        COUNT(*) FILTER (WHERE "rank" = 'C')::int AS c,
                        COUNT(*) FILTER (WHERE "rank" = 'D')::int AS d,
                        COUNT(*) FILTER (WHERE "fc_type" = 2)::int AS f
                    FROM play_data
                    WHERE "user_id" = ${userId} AND "play_count" > 0`;
                await writePlayerStats(tx, userId, {
                    scoreP: counts.p,
                    scoreS: counts.s,
                    scoreA2: counts.a2,
                    scoreA: counts.a,
                    scoreB2: counts.b2,
                    scoreB: counts.b,
                    scoreC: counts.c,
                    scoreD: counts.d,
                    scoreF: counts.f,
                });
            }
            return {
                changedRecords: changed.size,
                changedChartIds: [...changed.keys()],
            };
        },
        { timeout: 30000 }
    );
}
