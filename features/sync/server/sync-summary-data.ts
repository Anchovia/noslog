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
        where: { userId: userId },
        orderBy: { startedAt: "desc" },
        select: {
            id: true,
            status: true,
            syncScope: true,
            receivedPlays: true,
            insertedPlays: true,
            changedRecords: true,
            errorMessage: true,
            startedAt: true,
            completedAt: true,
        },
    });

    if (!sync) return null;

    const [playedChartCount, judgementChartCount, timingCharts] =
        await Promise.all([
            db.playData.count({
                where: {
                    userId: userId,
                    playCount: { gt: 0 },
                },
            }),
            db.playData.count({
                where: {
                    userId: userId,
                    playCount: { gt: 0 },
                    judgeSjust: { not: null },
                    judgeJust: { not: null },
                    judgeGood: { not: null },
                    judgeMiss: { not: null },
                    judgeNear: { not: null },
                },
            }),
            db.chartPlayHistory.groupBy({
                by: ["chartId"],
                where: {
                    userId: userId,
                    fastCount: { not: null },
                    slowCount: { not: null },
                },
            }),
        ]);

    return {
        id: sync.id,
        status: sync.status,
        syncScope: sync.syncScope,
        receivedPlays: sync.receivedPlays,
        insertedPlays: sync.insertedPlays,
        changedRecords: sync.changedRecords,
        hasNotice: Boolean(sync.errorMessage),
        startedAt: sync.startedAt,
        completedAt: sync.completedAt,
        playedChartCount,
        judgementChartCount,
        timingChartCount: timingCharts.length,
    };
}
