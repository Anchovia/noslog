import "server-only";
import { requireAdmin } from "@/lib/admin";
import { STALE_SYNC_THRESHOLD_MS } from "@/lib/admin/syncHealth";
import db from "@/lib/db";

export async function getAdminDashboard() {
    await requireAdmin();
    const now = new Date();
    const recentSyncStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const staleSyncBefore = new Date(now.getTime() - STALE_SYNC_THRESHOLD_MS);
    const activityStart = new Date(now);
    activityStart.setHours(0, 0, 0, 0);
    activityStart.setDate(activityStart.getDate() - 6);

    const [
        pendingSubmissionCount,
        failedSyncCount,
        missingConstantCount,
        pendingCatalogCount,
        draftBingoCount,
        openFeedbackCount,
        userCount,
        musicCount,
        completedSyncCount,
        staleSyncCount,
        attentionUserCount,
        recentUsers,
        recentSyncs,
        recentFeedback,
    ] = await Promise.all([
        db.examSubmission.count({ where: { status: "pending" } }),
        db.dataSync.count({
            where: {
                status: "failed",
                started_at: { gte: recentSyncStart },
            },
        }),
        db.musicChart.count({ where: { level_constant: null } }),
        db.musicCatalogCandidate.count({ where: { status: "pending" } }),
        db.bingo.count({ where: { status: "draft" } }),
        db.feedbackReport.count({ where: { status: "open" } }),
        db.user.count(),
        db.music.count(),
        db.dataSync.count({
            where: {
                status: "completed",
                started_at: { gte: recentSyncStart },
            },
        }),
        db.dataSync.count({
            where: {
                status: "processing",
                started_at: { lte: staleSyncBefore },
            },
        }),
        db.user.count({
            where: {
                OR: [
                    { dataSyncs: { none: {} } },
                    { PlayData: { none: {} } },
                    {
                        PlayData: {
                            some: {
                                OR: [
                                    { judge_sjust: null },
                                    { judge_just: null },
                                    { judge_good: null },
                                    { judge_miss: null },
                                    { judge_near: null },
                                    { note_rate_standard: null },
                                ],
                            },
                        },
                    },
                ],
            },
        }),
        db.user.findMany({
            where: { created_at: { gte: activityStart } },
            select: { created_at: true },
        }),
        db.dataSync.findMany({
            where: { started_at: { gte: activityStart } },
            select: { started_at: true },
        }),
        db.feedbackReport.findMany({
            where: { createdAt: { gte: activityStart } },
            select: { createdAt: true },
        }),
    ]);

    const dateKey = (date: Date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const activity = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(activityStart);
        date.setDate(activityStart.getDate() + index);
        const key = dateKey(date);

        return {
            key,
            date: `${date.getMonth() + 1}.${String(date.getDate()).padStart(2, "0")}`,
            users: 0,
            syncs: 0,
            feedback: 0,
        };
    });
    const activityByDate = new Map(activity.map((row) => [row.key, row]));
    for (const row of recentUsers) {
        const target = activityByDate.get(dateKey(row.created_at));
        if (target) target.users += 1;
    }
    for (const row of recentSyncs) {
        const target = activityByDate.get(dateKey(row.started_at));
        if (target) target.syncs += 1;
    }
    for (const row of recentFeedback) {
        const target = activityByDate.get(dateKey(row.createdAt));
        if (target) target.feedback += 1;
    }

    return {
        pendingSubmissionCount,
        failedSyncCount,
        missingConstantCount,
        pendingCatalogCount,
        draftBingoCount,
        openFeedbackCount,
        userCount,
        musicCount,
        completedSyncCount,
        staleSyncCount,
        attentionUserCount,
        activity,
    };
}
