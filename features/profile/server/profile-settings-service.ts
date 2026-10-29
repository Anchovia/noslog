import "server-only";

import type { ActionResult } from "@/lib/actions/result";
import { createImageUploadToken, isImageContentType } from "@/lib/blob";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/routing";
import { logServerError } from "@/lib/observability/server";
import getSession from "@/lib/session";
import {
    claimUploadTokenQuota,
    getUploadLimitMessage,
    releaseUploadTokenQuota,
} from "@/lib/upload-rate-limit";

type AvatarUploadActionResult = ActionResult<{
    pathname: string;
    token: string;
}>;

// 로그인한 사용자에게 프로필 이미지 한 장 전용 업로드 토큰을 발급함
export async function requestProfileAvatarUpload(
    contentType: string,
    requestedLocale?: Locale
): Promise<AvatarUploadActionResult> {
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const t = createTranslator(getMessages(locale));
    const session = await getSession();
    if (!session.id) {
        return {
            success: false,
            message: t("settings.loginRequired"),
        };
    }
    if (!isImageContentType(contentType)) {
        return {
            success: false,
            message: t("settings.invalidImage"),
        };
    }

    let grantId: number | null = null;
    try {
        const quota = await claimUploadTokenQuota(session.id, "profile-avatar");
        if (!quota.allowed) {
            return {
                success: false,
                message: getUploadLimitMessage(locale),
            };
        }
        grantId = quota.grantId;

        const upload = await createImageUploadToken(
            `avatars/${session.id}/profile`,
            contentType
        );
        if (!upload) {
            await releaseUploadTokenQuota(session.id, grantId).catch(
                () => null
            );
            return {
                success: false,
                message: t("settings.invalidImage"),
            };
        }

        return {
            success: true,
            message: "",
            ...upload,
        };
    } catch (error) {
        logServerError(error, {
            event: "profile.avatar-upload.request.failed",
            routePath: "/profile/settings",
            routeType: "action",
        });
        if (grantId !== null) {
            await releaseUploadTokenQuota(session.id, grantId).catch(
                () => null
            );
        }
        return {
            success: false,
            message: t("settings.uploadRequestError"),
        };
    }
}
