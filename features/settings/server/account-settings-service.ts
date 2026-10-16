import "server-only";

import { accountDeletionSummarySchema } from "@/features/settings/schemas/account-deletion-schema";
import {
    DELETION_VERIFICATION_WINDOW_MS,
    hasRecentDeletionVerification,
} from "@/features/settings/schemas/deletion-verification";
import db from "@/lib/db";
import getSession from "@/lib/session";

export async function getAccountSettingsData() {
    const session = await getSession();
    if (!session.id) return null;
    const user = await db.user.findUnique({
        where: { id: session.id },
        select: {
            discordId: true,
            avatar: true,
            avatarUserManaged: true,
            feedbackReports: { select: { imageUrl: true } },
            examSubmissions: { select: { proofImageUrl: true } },
            _count: {
                select: {
                    playData: true,
                    dataSyncs: true,
                    chartPlayHistory: true,
                    chartRecordSnapshots: true,
                    bestGrades: true,
                    ratingHistory: true,
                    communityEvaluations: true,
                    communityHelpful: true,
                    communityReports: true,
                    chartGoalVotes: true,
                    chartGoalVoteAudit: true,
                    bingoProgress: true,
                    examSubmissions: true,
                    examAchievements: true,
                    feedbackReports: true,
                },
            },
        },
    });
    if (!user) return null;
    const counts = user._count;
    const uploads = new Set(
        [
            user.avatarUserManaged ? user.avatar : null,
            ...user.feedbackReports.map((row) => row.imageUrl),
            ...user.examSubmissions.map((row) => row.proofImageUrl),
        ].filter(Boolean)
    );
    const verified = hasRecentDeletionVerification(
        session.deletionVerification,
        session.id,
        user.discordId
    );
    return {
        expiresAt: verified
            ? session.deletionVerification!.verifiedAt +
              DELETION_VERIFICATION_WINDOW_MS
            : null,
        summary: accountDeletionSummarySchema.parse({
            plays:
                counts.playData +
                counts.dataSyncs +
                counts.chartPlayHistory +
                counts.chartRecordSnapshots,
            growth: counts.bestGrades + counts.ratingHistory,
            community:
                counts.communityEvaluations +
                counts.communityHelpful +
                counts.communityReports +
                counts.chartGoalVotes +
                counts.chartGoalVoteAudit +
                counts.feedbackReports,
            progress:
                counts.bingoProgress +
                counts.examSubmissions +
                counts.examAchievements,
            uploads: uploads.size,
        }),
    };
}
