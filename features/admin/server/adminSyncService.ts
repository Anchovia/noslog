import "server-only";
import { requireAdmin } from "@/lib/admin";
import {
    getSyncAttemptHealth,
    STALE_SYNC_THRESHOLD_MS,
} from "@/lib/admin/syncHealth";
import db from "@/lib/db";
import { adminSyncFilterSchema } from "@/features/admin/schemas/adminSyncSchema";

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
                            nostalgia_name: true,
                        },
                    },
                    _count: {
                        select: {
                            playHistory: true,
                            recordSnapshots: true,
                        },
                    },
                },
                orderBy: { started_at: "desc" },
                take: 100,
            }),
            db.dataSync.count({
                where: {
                    status: "completed",
                    started_at: { gte: recentStart },
                },
            }),
            db.dataSync.count({
                where: { status: "failed", started_at: { gte: recentStart } },
            }),
            db.dataSync.count({ where: { status: "processing" } }),
            db.dataSync.count({
                where: {
                    status: "processing",
                    started_at: { lte: staleBefore },
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
            by: ["first_sync_id"],
            where: {
                first_sync_id: { in: syncIds },
                judge_sjust: { not: null },
                judge_just: { not: null },
                judge_good: { not: null },
                judge_miss: { not: null },
                judge_near: { not: null },
            },
            _count: { _all: true },
        }),
        db.chartPlayHistory.groupBy({
            by: ["first_sync_id"],
            where: {
                first_sync_id: { in: syncIds },
                fast_count: { not: null },
                slow_count: { not: null },
            },
            _count: { _all: true },
        }),
        db.chartRecordSnapshot.groupBy({
            by: ["sync_id"],
            where: {
                sync_id: { in: syncIds },
                judge_sjust: { not: null },
                judge_just: { not: null },
                judge_good: { not: null },
                judge_miss: { not: null },
                judge_near: { not: null },
            },
            _count: { _all: true },
        }),
        db.chartRecordSnapshot.groupBy({
            by: ["sync_id"],
            where: {
                sync_id: { in: syncIds },
                note_rate_standard: { not: null },
            },
            _count: { _all: true },
        }),
    ]);
    const recentJudgementBySync = new Map(
        recentJudgementGroups.flatMap((row) =>
            row.first_sync_id === null
                ? []
                : [[row.first_sync_id, row._count._all] as const]
        )
    );
    const recentFastSlowBySync = new Map(
        recentFastSlowGroups.flatMap((row) =>
            row.first_sync_id === null
                ? []
                : [[row.first_sync_id, row._count._all] as const]
        )
    );
    const snapshotJudgementBySync = new Map(
        snapshotJudgementGroups.map(
            (row) => [row.sync_id, row._count._all] as const
        )
    );
    const snapshotNoteRateBySync = new Map(
        snapshotNoteRateGroups.map(
            (row) => [row.sync_id, row._count._all] as const
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
                startedAt: sync.started_at,
                insertedPlays: sync.inserted_plays,
                changedRecords: sync.changed_records,
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
