import "server-only";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS, getUserProfileTag } from "@/lib/cacheTags";

import { deleteBlobStrict } from "@/lib/blob";
import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { type Locale } from "@/lib/i18n/routing";
import getSession from "@/lib/session";
import { hasRecentDeletionVerification } from "@/features/settings/schemas/deletionVerification";

function invalidateDeletedAccount(userId: number) {
    for (const tag of [
        getUserProfileTag(userId),
        CACHE_TAGS.userProfiles,
        CACHE_TAGS.userRankings,
        CACHE_TAGS.chartRankings,
        CACHE_TAGS.chartEvaluations,
        CACHE_TAGS.tierLists,
        CACHE_TAGS.musicDetails,
    ]) {
        revalidateTag(tag, { expire: 0 });
    }
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
        select: {
            discord_id: true,
            avatar: true,
            feedbackReports: { select: { imageUrl: true } },
            examSubmissions: { select: { proofImageUrl: true } },
        },
    });
    if (!user) {
        invalidateDeletedAccount(session.id);
        await session.destroy();
        return { success: true as const };
    }

    if (
        !hasRecentDeletionVerification(
            session.deletionVerification,
            session.id,
            user.discord_id
        )
    ) {
        return {
            success: false as const,
            message: t("settings.reauthenticate"),
            reauthenticationRequired: true,
        };
    }

    const uploadedUrls = new Set(
        [
            user.avatar,
            ...user.feedbackReports.map(({ imageUrl }) => imageUrl),
            ...user.examSubmissions.map(({ proofImageUrl }) => proofImageUrl),
        ].filter((url): url is string => Boolean(url))
    );

    try {
        // DB를 먼저 지우면 Blob 정리에 실패해도 파일을 다시 찾을 수 없으므로
        // 파일 삭제가 모두 성공한 뒤 계정과 연관 데이터를 삭제함
        for (const url of uploadedUrls) {
            await deleteBlobStrict(url);
        }
        await db.user.delete({ where: { id: session.id } });
        invalidateDeletedAccount(session.id);
        await session.destroy();
        return { success: true as const };
    } catch (error) {
        console.error("회원 탈퇴 처리에 실패했습니다.", error);
        return {
            success: false as const,
            message: t("settings.deleteError"),
        };
    }
}
