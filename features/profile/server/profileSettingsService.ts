import "server-only";

import { redirect } from "next/navigation";

import type { ActionFailure, ActionResult } from "@/lib/actions/result";
import {
    createImageUploadToken,
    deleteBlobIfOwned,
    isImageContentType,
    isValidImageBlob,
} from "@/lib/blob";
import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { isLocale, localizePath, type Locale } from "@/lib/i18n/routing";
import { CACHE_TAGS, getUserProfileTag } from "@/lib/cacheTags";
import getSession from "@/lib/session";
import {
    claimUploadTokenQuota,
    getUploadLimitMessage,
    releaseUploadTokenQuota,
} from "@/lib/uploadRateLimit";
import { updateTag } from "next/cache";
import { logServerError } from "@/lib/observability/server";

import {
    createProfileSettingsSchema,
    profileSettingsInputFromFormData,
    type ProfileSettingsFormValues,
} from "@/features/profile/schemas/profileSettingsSchema";

type ProfileSettingsFieldName = Extract<
    keyof ProfileSettingsFormValues,
    string
>;
type SettingActionResult = ActionFailure<ProfileSettingsFieldName>;
type AvatarUploadActionResult = ActionResult<{
    pathname: string;
    token: string;
}>;

// 프로필 입력값과 새 아바타를 한 번에 저장함
export async function uploadUserSetting(
    formData: FormData
): Promise<SettingActionResult | never> {
    const requestedLocale = String(formData.get("locale") ?? "");
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const t = createTranslator(getMessages(locale));
    const session = await getSession();
    if (!session.id) {
        return { success: false, message: t("settings.loginRequired") };
    }

    const result = createProfileSettingsSchema(t).safeParse(
        profileSettingsInputFromFormData(formData)
    );

    if (!result.success) {
        return {
            success: false,
            message: t("settings.checkInput"),
            fieldErrors: result.error.flatten().fieldErrors,
        };
    }

    const currentUser = await db.user.findUnique({
        where: { id: session.id },
        select: { avatar: true, discord_id: true },
    });
    if (!currentUser) {
        return { success: false, message: t("settings.userNotFound") };
    }

    const submittedAvatar = result.data.avatar;
    const currentAvatarBase = currentUser.avatar ?? "";
    const avatarChanged =
        submittedAvatar.length > 0 && submittedAvatar !== currentAvatarBase;
    if (
        avatarChanged &&
        !(await isValidImageBlob(
            submittedAvatar,
            `avatars/${session.id}/profile`
        ))
    ) {
        return {
            success: false,
            message: t("settings.invalidAvatarUrl"),
        };
    }
    const nextAvatar = avatarChanged ? submittedAvatar : currentUser.avatar;
    const preferredArcadeId = result.data.preferredArcadeId
        ? Number(result.data.preferredArcadeId)
        : null;
    if (preferredArcadeId !== null) {
        const arcade = await db.arcade.findFirst({
            where: { id: preferredArcadeId, is_active: true },
            select: { id: true },
        });
        if (!arcade) {
            return {
                success: false,
                message: t("settings.arcadeNotFound"),
            };
        }
    }

    try {
        await db.user.update({
            where: { id: session.id },
            data: {
                username: result.data.username,
                country: result.data.country,
                locale: result.data.locale,
                show_localized_music_title: result.data.showLocalizedMusicTitle,
                avatar: nextAvatar,
                discord_name: currentUser.discord_id
                    ? result.data.discordName || null
                    : null,
                discord_username: currentUser.discord_id
                    ? result.data.discordUsername || null
                    : null,
                preferred_arcade_id: preferredArcadeId,
                hide_nostalgia_name: result.data.hideNostalgiaName,
                hide_discord_name: result.data.hideDiscordName,
                hide_play_count: result.data.hidePlayCount,
            },
        });
        updateTag(CACHE_TAGS.userRankings);
        updateTag(getUserProfileTag(session.id));
        session.locale = result.data.locale;
        await session.save();
    } catch (error) {
        const code =
            typeof error === "object" && error !== null && "code" in error
                ? String(error.code)
                : null;

        if (code === "P2002") {
            if (avatarChanged) await deleteBlobIfOwned(submittedAvatar);
            return {
                success: false,
                message: t("settings.nicknameTaken"),
            };
        }
        logServerError(error, {
            event: "profile.settings.save.failed",
            routePath: "/profile/settings",
            routeType: "action",
        });
        if (avatarChanged) await deleteBlobIfOwned(submittedAvatar);
        return { success: false, message: t("settings.saveError") };
    }

    if (avatarChanged) await deleteBlobIfOwned(currentUser.avatar);

    redirect(localizePath(`/profile/${session.id}`, result.data.locale));
}

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
                message: getUploadLimitMessage(),
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
