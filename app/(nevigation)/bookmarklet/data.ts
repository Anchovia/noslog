import "server-only";

import db from "@/lib/db";

export interface LatestSyncSummary {
    id: number;
    status: string;
    syncScope: string;
    receivedPlays: number;
    insertedPlays: number;
    changedRecords: number;
    hasNotice: boolean;
    startedAt: Date;
    completedAt: Date | null;
    playedChartCount: number;
    judgementChartCount: number;
    timingChartCount: number;
}

export async function getLatestSyncSummary(
    userId: number
): Promise<LatestSyncSummary | null> {
    const sync = await db.dataSync.findFirst({
        where: { user_id: userId },
        orderBy: { started_at: "desc" },
        select: {
            id: true,
            status: true,
            sync_scope: true,
            received_plays: true,
            inserted_plays: true,
            changed_records: true,
            error_message: true,
            started_at: true,
            completed_at: true,
        },
    });

    if (!sync) return null;

    const [playedChartCount, judgementChartCount, timingCharts] =
        await Promise.all([
            db.playData.count({
                where: {
                    user_id: userId,
                    play_count: { gt: 0 },
                },
            }),
            db.playData.count({
                where: {
                    user_id: userId,
                    play_count: { gt: 0 },
                    judge_sjust: { not: null },
                    judge_just: { not: null },
                    judge_good: { not: null },
                    judge_miss: { not: null },
                    judge_near: { not: null },
                },
            }),
            db.chartPlayHistory.groupBy({
                by: ["chart_id"],
                where: {
                    user_id: userId,
                    fast_count: { not: null },
                    slow_count: { not: null },
                },
            }),
        ]);

    return {
        id: sync.id,
        status: sync.status,
        syncScope: sync.sync_scope,
        receivedPlays: sync.received_plays,
        insertedPlays: sync.inserted_plays,
        changedRecords: sync.changed_records,
        hasNotice: Boolean(sync.error_message),
        startedAt: sync.started_at,
        completedAt: sync.completed_at,
        playedChartCount,
        judgementChartCount,
        timingChartCount: timingCharts.length,
    };
}
