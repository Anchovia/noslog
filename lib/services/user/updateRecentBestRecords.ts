import db from "@/lib/db";
import { planRecentRecordMerge } from "./recentRecordMerge";
import type { RecordValues } from "./recentRecordMerge";

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
                where: { user_id: userId, record_applied: false },
                include: {
                    chart: {
                        select: {
                            id: true,
                            music_idx: true,
                            difficulty: true,
                            level: true,
                            note_count: true,
                        },
                    },
                },
            });
            if (!history.length) return 0;
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
                const allRecords = await tx.playData.findMany({
                    where: { user_id: userId, play_count: { gt: 0 } },
                    select: { rank: true, fc_type: true },
                });
                const count = (rank: string) =>
                    allRecords.filter((record) => record.rank === rank).length;
                await tx.user.update({
                    where: { id: userId },
                    data: {
                        score_p: count("P"),
                        score_s: count("S"),
                        score_a2: count("A2"),
                        score_a: count("A"),
                        score_b2: count("B2"),
                        score_b: count("B"),
                        score_c: count("C"),
                        score_d: count("D"),
                        score_f: allRecords.filter(
                            (record) => record.fc_type === 2
                        ).length,
                    },
                });
            }
            return changed.size;
        },
        { timeout: 30000 }
    );
}
