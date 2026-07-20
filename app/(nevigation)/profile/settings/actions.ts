"use server";

import { redirect } from "next/navigation";

import {
    createImageUploadToken,
    deleteBlobIfOwned,
    isImageContentType,
    isValidImageBlob,
} from "@/lib/blob";
import db from "@/lib/db";
import { CACHE_TAGS, getUserProfileTag } from "@/lib/cacheTags";
import getSession from "@/lib/session";
import {
    claimUploadTokenQuota,
    getUploadLimitMessage,
    releaseUploadTokenQuota,
} from "@/lib/uploadRateLimit";
import { updateTag } from "next/cache";

import { settingSchema } from "./schema";

type SettingActionResult = {
    success: false;
    message: string;
    fieldErrors?: Record<string, string[]>;
};

// 프로필 입력값과 새 아바타를 한 번에 저장함
export async function uploadUserSetting(
    formData: FormData
): Promise<SettingActionResult | never> {
    const session = await getSession();
    if (!session.id) {
        return { success: false, message: "로그인이 필요합니다." };
    }

    const result = settingSchema.safeParse({
        avatar: String(formData.get("avatar") ?? ""),
        username: String(formData.get("username") ?? ""),
        country: String(formData.get("country") ?? ""),
        preferredArcadeId: String(formData.get("preferredArcadeId") ?? ""),
        hideNostalgiaName: formData.get("hideNostalgiaName") === "true",
        hideDiscordName: formData.get("hideDiscordName") === "true",
        hidePlayCount: formData.get("hidePlayCount") === "true",
    });

    if (!result.success) {
        return {
            success: false,
            message: "입력한 정보를 확인해주세요.",
            fieldErrors: result.error.flatten().fieldErrors,
        };
    }

    const currentUser = await db.user.findUnique({
        where: { id: session.id },
        select: { avatar: true },
    });
    if (!currentUser) {
        return { success: false, message: "사용자 정보를 찾을 수 없습니다." };
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
            message: "허용되지 않은 프로필 이미지 주소입니다.",
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
                message: "선택한 오락실을 찾을 수 없습니다.",
            };
        }
    }

    try {
        await db.user.update({
            where: { id: session.id },
            data: {
                username: result.data.username,
                country: result.data.country,
                avatar: nextAvatar,
                preferred_arcade_id: preferredArcadeId,
                hide_nostalgia_name: result.data.hideNostalgiaName,
                hide_discord_name: result.data.hideDiscordName,
                hide_play_count: result.data.hidePlayCount,
            },
        });
        updateTag(CACHE_TAGS.userRankings);
        updateTag(getUserProfileTag(session.id));
    } catch (error) {
        const code =
            typeof error === "object" && error !== null && "code" in error
                ? String(error.code)
                : null;

        if (code === "P2002") {
            if (avatarChanged) await deleteBlobIfOwned(submittedAvatar);
            return {
                success: false,
                message: "이미 사용 중인 닉네임입니다.",
            };
        }
        if (avatarChanged) await deleteBlobIfOwned(submittedAvatar);
        return { success: false, message: "프로필 저장에 실패했습니다." };
    }

    if (avatarChanged) await deleteBlobIfOwned(currentUser.avatar);

    redirect(`/profile/${session.id}`);
}

// 로그인한 사용자에게 프로필 이미지 한 장 전용 업로드 토큰을 발급함
export async function requestProfileAvatarUpload(contentType: string) {
    const session = await getSession();
    if (!session.id) {
        return { success: false as const, message: "로그인이 필요합니다." };
    }
    if (!isImageContentType(contentType)) {
        return {
            success: false as const,
            message: "JPG, PNG, WebP 이미지만 사용할 수 있습니다.",
        };
    }

    let grantId: number | null = null;
    try {
        const quota = await claimUploadTokenQuota(session.id, "profile-avatar");
        if (!quota.allowed) {
            return {
                success: false as const,
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
                success: false as const,
                message: "JPG, PNG, WebP 이미지만 사용할 수 있습니다.",
            };
        }

        return {
            success: true as const,
            ...upload,
        };
    } catch {
        if (grantId !== null) {
            await releaseUploadTokenQuota(session.id, grantId).catch(
                () => null
            );
        }
        return {
            success: false as const,
            message: "이미지 업로드 요청을 처리하지 못했습니다.",
        };
    }
}
