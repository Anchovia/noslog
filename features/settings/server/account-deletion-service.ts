import "server-only";

import { revalidateTag } from "next/cache";
import { after } from "next/server";

import { disconnectMusecat } from "@/features/musecat/server/musecat-connection-service";
import { revokeGrantByUser } from "@/features/partner/server/oauth-grant-service";
import { dispatchPartnerOutbox } from "@/features/partner/server/partner-outbox";
import { MUSECAT_OAUTH_CLIENT_ID } from "@/features/partner/server/partner-settings-data";
import { deleteBlobStrict } from "@/lib/blob";
import { CACHE_TAGS, getUserProfileTag } from "@/lib/cache-tags";
import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { type Locale } from "@/lib/i18n/routing";
import { logSecurityEvent, logServerError } from "@/lib/observability/server";
import { hasRecentDiscordVerification } from "@/lib/recent-discord-verification";
import getSession from "@/lib/session";

function invalidateDeletedAccount(userId: number) {
    for (const tag of [
        getUserProfileTag(userId),
        CACHE_TAGS.userProfiles,
        CACHE_TAGS.userRankings,
        CACHE_TAGS.chartRankings,
        CACHE_TAGS.chartEvaluations,
        CACHE_TAGS.tierLists,
        CACHE_TAGS.musicDetails,
        CACHE_TAGS.events,
    ]) {
        revalidateTag(tag, { expire: 0 });
    }
}

/** 계정을 지울 때 함께 지울 업로드 파일이 든 칸 */
export const ACCOUNT_UPLOADS_SELECT = {
    avatar: true,
    feedbackReports: { select: { imageUrl: true } },
    examSubmissions: { select: { proofImageUrl: true } },
} as const;

/**
 * 계정과 딸린 데이터 삭제 — 탈퇴와 가입을 끝내지 않은 계정 정리가 함께 쓴다.
 * 재인증 · 세션 · 기록은 부르는 쪽이 맡는다
 */
export async function deleteAccountData(
    userId: number,
    uploads: {
        avatar: string | null;
        feedbackReports: { imageUrl: string | null }[];
        examSubmissions: { proofImageUrl: string | null }[];
    }
) {
    const uploadedUrls = new Set(
        [
            uploads.avatar,
            ...uploads.feedbackReports.map(({ imageUrl }) => imageUrl),
            ...uploads.examSubmissions.map(
                ({ proofImageUrl }) => proofImageUrl
            ),
        ].filter((url): url is string => Boolean(url))
    );
    // DB를 먼저 지우면 Blob 정리에 실패해도 파일을 다시 찾을 수 없으므로
    // 파일 삭제가 모두 성공한 뒤 계정과 연관 데이터를 삭제함
    for (const url of uploadedUrls) {
        await deleteBlobStrict(url);
    }
    // 연결 표는 계정과 함께 지워지므로, 그 전에 뮤즈캣 쪽 토큰을 폐기하고 해제 알림을 outbox 에 넣는다
    await revokeGrantByUser(userId, MUSECAT_OAUTH_CLIENT_ID);
    await disconnectMusecat(userId);
    await db.user.delete({ where: { id: userId } });
    invalidateDeletedAccount(userId);
}

export async function deleteAccount(
    confirmationInput: string,
    locale: Locale = "ko"
) {
    const t = createTranslator(getMessages(locale));
    const deleteConfirmation = t("settings.deleteConfirmation");
    const session = await getSession();
    if (!session.id) {
        return {
            success: false as const,
            message: t("settings.loginRequired"),
        };
    }
    if (confirmationInput !== deleteConfirmation) {
        return {
            success: false as const,
            message: t("settings.deleteConfirmationError", {
                confirmation: deleteConfirmation,
            }),
        };
    }

    const user = await db.user.findUnique({
        where: { id: session.id },
        select: { discordId: true, ...ACCOUNT_UPLOADS_SELECT },
    });
    if (!user) {
        invalidateDeletedAccount(session.id);
        await session.destroy();
        return { success: true as const };
    }

    if (
        !hasRecentDiscordVerification(
            session.deletionVerification,
            session.id,
            user.discordId
        )
    ) {
        return {
            success: false as const,
            message: t("settings.reauthenticate"),
            reauthenticationRequired: true,
        };
    }

    try {
        await deleteAccountData(session.id, user);
        logSecurityEvent({
            event: "account.deleted",
            actorUserId: session.id,
            targetUserId: session.id,
        });
        after(() => dispatchPartnerOutbox().catch(() => null));
        await session.destroy();
        return { success: true as const };
    } catch (error) {
        logServerError(error, {
            event: "profile.account-deletion.failed",
            routePath: "/settings",
            routeType: "action",
        });
        return {
            success: false as const,
            message: t("settings.deleteError"),
        };
    }
}
