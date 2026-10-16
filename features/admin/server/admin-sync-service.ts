import "server-only";

import { adminSyncFilterSchema } from "@/features/admin/schemas/admin-sync-schema";
import { requireAdmin } from "@/lib/admin";
import {
    getSyncAttemptHealth,
    STALE_SYNC_THRESHOLD_MS,
} from "@/lib/admin/sync-health";
import db from "@/lib/db";

export async function getAdminSyncs(input: unknown) {
    await requireAdmin();
    const { status } = adminSyncFilterSchema.parse(input);
    const now = new Date();
    const recentStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const staleBefore = new Date(now.getTime() - STALE_SYNC_THRESHOLD_MS);
    const [syncs, completedCount, failedCount, processingCount, staleCount] =
        await Promise.all([
            db.dataSync.findMany({
                where: status === "all" ? undefined : { status },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            nostalgiaName: true,
                        },
                    },
                    _count: {
                        select: {
                            playHistory: true,
                            recordSnapshots: true,
                        },
                    },
                },
                orderBy: { startedAt: "desc" },
                take: 100,
            }),
            db.dataSync.count({
                where: {
                    status: "completed",
                    startedAt: { gte: recentStart },
                },
            }),
            db.dataSync.count({
                where: { status: "failed", startedAt: { gte: recentStart } },
            }),
            db.dataSync.count({ where: { status: "processing" } }),
            db.dataSync.count({
                where: {
                    status: "processing",
                    startedAt: { lte: staleBefore },
                },
            }),
        ]);
    const syncIds = syncs.map((sync) => sync.id);
    const [
        recentJudgementGroups,
        recentFastSlowGroups,
        snapshotJudgementGroups,
        snapshotNoteRateGroups,
    ] = await Promise.all([
        db.chartPlayHistory.groupBy({
            by: ["firstSyncId"],
            where: {
                firstSyncId: { in: syncIds },
                judgeSjust: { not: null },
                judgeJust: { not: null },
                judgeGood: { not: null },
                judgeMiss: { not: null },
                judgeNear: { not: null },
            },
            _count: { _all: true },
        }),
        db.chartPlayHistory.groupBy({
            by: ["firstSyncId"],
            where: {
                firstSyncId: { in: syncIds },
                fastCount: { not: null },
                slowCount: { not: null },
            },
            _count: { _all: true },
        }),
        db.chartRecordSnapshot.groupBy({
            by: ["syncId"],
            where: {
                syncId: { in: syncIds },
                judgeSjust: { not: null },
                judgeJust: { not: null },
                judgeGood: { not: null },
                judgeMiss: { not: null },
                judgeNear: { not: null },
            },
            _count: { _all: true },
        }),
        db.chartRecordSnapshot.groupBy({
            by: ["syncId"],
            where: {
                syncId: { in: syncIds },
                noteRateStandard: { not: null },
            },
            _count: { _all: true },
        }),
    ]);
    const recentJudgementBySync = new Map(
        recentJudgementGroups.flatMap((row) =>
            row.firstSyncId === null
                ? []
                : [[row.firstSyncId, row._count._all] as const]
        )
    );
    const recentFastSlowBySync = new Map(
        recentFastSlowGroups.flatMap((row) =>
            row.firstSyncId === null
                ? []
                : [[row.firstSyncId, row._count._all] as const]
        )
    );
    const snapshotJudgementBySync = new Map(
        snapshotJudgementGroups.map(
            (row) => [row.syncId, row._count._all] as const
        )
    );
    const snapshotNoteRateBySync = new Map(
        snapshotNoteRateGroups.map(
            (row) => [row.syncId, row._count._all] as const
        )
    );
    const rows = syncs.map((sync) => {
        const storedRecentCount = sync._count.playHistory;
        const storedSnapshotCount = sync._count.recordSnapshots;
        const recentJudgementCount = recentJudgementBySync.get(sync.id) ?? 0;
        const recentFastSlowCount = recentFastSlowBySync.get(sync.id) ?? 0;
        const snapshotJudgementCount =
            snapshotJudgementBySync.get(sync.id) ?? 0;
        const snapshotNoteRateCount = snapshotNoteRateBySync.get(sync.id) ?? 0;
        const health = getSyncAttemptHealth(
            {
                status: sync.status,
                startedAt: sync.startedAt,
                insertedPlays: sync.insertedPlays,
                changedRecords: sync.changedRecords,
                playHistoryCount: storedRecentCount,
                snapshotCount: storedSnapshotCount,
            },
            now
        );
        return {
            ...sync,
            storedRecentCount,
            storedSnapshotCount,
            recentJudgementCount,
            recentFastSlowCount,
            snapshotJudgementCount,
            snapshotNoteRateCount,
            health,
        };
    });
    return {
        status,
        syncs: rows,
        completedCount,
        failedCount,
        processingCount,
        staleCount,
    };
}
