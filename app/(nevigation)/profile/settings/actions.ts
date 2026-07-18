"use server";

import { redirect } from "next/navigation";

import {
    createImageUploadToken,
    deleteBlobIfOwned,
    isValidImageBlob,
} from "@/lib/blob";
import db from "@/lib/db";
import { CACHE_TAGS, getUserProfileTag } from "@/lib/cacheTags";
import getSession from "@/lib/session";
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

    try {
        await db.user.update({
            where: { id: session.id },
            data: {
                username: result.data.username,
                avatar: nextAvatar,
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

    try {
        const upload = await createImageUploadToken(
            `avatars/${session.id}/profile`,
            contentType
        );
        if (!upload) {
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
        return {
            success: false as const,
            message: "Vercel Blob 업로드 설정을 확인해주세요.",
        };
    }
}
