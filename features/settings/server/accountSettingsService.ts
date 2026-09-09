import "server-only";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { accountDeletionSummarySchema } from "../schemas/accountDeletionSchema";
import {
    DELETION_VERIFICATION_WINDOW_MS,
    hasRecentDeletionVerification,
} from "../schemas/deletionVerification";

export async function getAccountSettingsData() {
    const session = await getSession();
    if (!session.id) return null;
    const user = await db.user.findUnique({
        where: { id: session.id },
        select: {
            discord_id: true,
            avatar: true,
            avatar_user_managed: true,
            feedbackReports: { select: { imageUrl: true } },
            examSubmissions: { select: { proofImageUrl: true } },
            _count: {
                select: {
                    PlayData: true,
                    dataSyncs: true,
                    chartPlayHistory: true,
                    chartRecordSnapshots: true,
                    UserBestGrade: true,
                    ratingHistory: true,
                    chartEvaluations: true,
                    chartReactions: true,
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
            user.avatar_user_managed ? user.avatar : null,
            ...user.feedbackReports.map((row) => row.imageUrl),
            ...user.examSubmissions.map((row) => row.proofImageUrl),
        ].filter(Boolean)
    );
    const verified = hasRecentDeletionVerification(
        session.deletionVerification,
        session.id,
        user.discord_id
    );
    return {
        expiresAt: verified
            ? session.deletionVerification!.verifiedAt +
              DELETION_VERIFICATION_WINDOW_MS
            : null,
        summary: accountDeletionSummarySchema.parse({
            plays:
                counts.PlayData +
                counts.dataSyncs +
                counts.chartPlayHistory +
                counts.chartRecordSnapshots,
            growth: counts.UserBestGrade + counts.ratingHistory,
            community:
                counts.chartEvaluations +
                counts.chartReactions +
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
