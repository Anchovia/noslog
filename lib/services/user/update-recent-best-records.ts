import db from "@/lib/db";

import type { RecordValues } from "./recent-record-merge";
import { planRecentRecordMerge } from "./recent-record-merge";

// History ingestion is separate. The projection and its receipt commit together,
// so a failure/retry cannot increment a play twice or lose a stored attempt.
export async function updateRecentBestRecords(userId: number, syncId: number) {
    return db.$transaction(
        async (tx) => {
            await tx.$queryRaw`SELECT id FROM "User" WHERE id = ${userId} FOR UPDATE`;
            await tx.dataSync.findUniqueOrThrow({
                where: { id: syncId, user_id: userId, status: "processing" },
                select: { id: true },
            });
            const user = await tx.user.findUniqueOrThrow({
                where: { id: userId },
                select: { last_full_record_at: true },
            });
            const history = await tx.chartPlayHistory.findMany({
                where: {
                    user_id: userId,
                    OR: [{ record_applied: false }, { grade_basic: 0 }],
                },
                include: {
                    chart: {
                        select: {
                            id: true,
                            music_idx: true,
                            difficulty: true,
                            level: true,
                            level_constant: true,
                            note_count: true,
                        },
                    },
                },
            });
            if (!history.length)
                return { changedRecords: 0, changedChartIds: [] };
            const oldRecords = await tx.playData.findMany({
                where: {
                    user_id: userId,
                    chart_id: {
                        in: [...new Set(history.map((p) => p.chart_id))],
                    },
                },
            });
            const previous = new Map<number, RecordValues>(
                oldRecords.flatMap(
                    ({
                        id: _id,
                        created_at: _created,
                        updated_at: _updated,
                        user_id: _user,
                        chart_id,
                        music_idx: _music,
                        difficulty: _difficulty,
                        ...values
                    }) => (chart_id === null ? [] : [[chart_id, values]])
                )
            );
            const plan = planRecentRecordMerge(
                previous,
                history,
                user.last_full_record_at
            );
            const records = plan.changes;
            const changed = new Map(
                history
                    .filter((play) => records.has(play.chart_id))
                    .map((play) => [play.chart_id, play.chart])
            );
            for (const [chartId, chart] of changed) {
                const values = records.get(chartId)!;
                await tx.playData.upsert({
                    where: {
                        user_id_chart_id: {
                            user_id: userId,
                            chart_id: chartId,
                        },
                    },
                    create: {
                        ...values,
                        user_id: userId,
                        chart_id: chartId,
                        music_idx: chart.music_idx,
                        difficulty: chart.difficulty,
                    },
                    update: values,
                });
                await tx.chartRecordSnapshot.upsert({
                    where: {
                        sync_id_chart_id: {
                            sync_id: syncId,
                            chart_id: chartId,
                        },
                    },
                    create: {
                        ...values,
                        user_id: userId,
                        chart_id: chartId,
                        sync_id: syncId,
                    },
                    update: values,
                });
            }
            await tx.chartPlayHistory.updateMany({
                where: { user_id: userId, id: { in: plan.appliedIds } },
                data: { record_applied: true },
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
                    FROM "PlayData"
                    WHERE "user_id" = ${userId} AND "play_count" > 0`;
                await tx.user.update({
                    where: { id: userId },
                    data: {
                        score_p: counts.p,
                        score_s: counts.s,
                        score_a2: counts.a2,
                        score_a: counts.a,
                        score_b2: counts.b2,
                        score_b: counts.b,
                        score_c: counts.c,
                        score_d: counts.d,
                        score_f: counts.f,
                    },
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
