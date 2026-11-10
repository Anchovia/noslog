import "server-only";

import type { ActionResult } from "@/lib/actions/result";
import { isImageContentType } from "@/lib/blob";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { type Locale, resolveLocale } from "@/lib/i18n/routing";
import { logServerError } from "@/lib/observability/server";
import getSession from "@/lib/session";
import { getUploadLimitMessage } from "@/lib/upload-rate-limit";
import { requestImageUploadToken } from "@/lib/uploads/image-upload-token";

type AvatarUploadActionResult = ActionResult<{
    pathname: string;
    token: string;
}>;

// 로그인한 사용자에게 프로필 이미지 한 장 전용 업로드 토큰을 발급함
export async function requestProfileAvatarUpload(
    contentType: string,
    requestedLocale?: Locale
): Promise<AvatarUploadActionResult> {
    const locale = resolveLocale(requestedLocale);
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

    return requestImageUploadToken({
        userId: session.id,
        purpose: "profile-avatar",
        access: "public",
        pathnameWithoutExtension: `avatars/${session.id}/profile`,
        contentType,
        limitMessage: getUploadLimitMessage(locale),
        refusedTypeMessage: t("settings.invalidImage"),
        errorMessage: t("settings.uploadRequestError"),
        logError: (error) =>
            logServerError(error, {
                event: "profile.avatar-upload.request.failed",
                routePath: "/profile/settings",
                routeType: "action",
            }),
    });
}
