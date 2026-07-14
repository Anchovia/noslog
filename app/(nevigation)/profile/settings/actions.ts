"use server";

import { redirect } from "next/navigation";

import db from "@/lib/db";
import getSession from "@/lib/session";

import { settingSchema } from "./schema";

type SettingActionResult = {
    success: false;
    message: string;
    fieldErrors?: Record<string, string[]>;
};

const CLOUDFLARE_DELIVERY_ACCOUNT = "zAwkQO6bEReNpmM7QzHHXA";

function isCloudflareDeliveryUrl(url: string) {
    try {
        const parsed = new URL(url);
        const path = parsed.pathname.split("/").filter(Boolean);

        return (
            parsed.protocol === "https:" &&
            parsed.hostname === "imagedelivery.net" &&
            path.length === 2 &&
            path[0] === CLOUDFLARE_DELIVERY_ACCOUNT &&
            !parsed.search &&
            !parsed.hash
        );
    } catch {
        return false;
    }
}

function cloudflareImageId(url: string | null) {
    if (!url) return null;

    try {
        const parsed = new URL(url);
        if (parsed.hostname !== "imagedelivery.net") return null;
        return parsed.pathname.split("/").filter(Boolean)[1] ?? null;
    } catch {
        return null;
    }
}

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
        discord_name: String(formData.get("discord_name") ?? ""),
        discord_tag: String(formData.get("discord_tag") ?? ""),
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

    const submittedAvatar = result.data.avatar.replace(/\/profile$/, "");
    const currentAvatarBase =
        currentUser.avatar?.replace(/\/profile$/, "") ?? "";
    const avatarChanged =
        submittedAvatar.length > 0 && submittedAvatar !== currentAvatarBase;
    if (avatarChanged && !isCloudflareDeliveryUrl(submittedAvatar)) {
        return {
            success: false,
            message: "허용되지 않은 프로필 이미지 주소입니다.",
        };
    }
    const nextAvatar = avatarChanged
        ? `${submittedAvatar}/profile`
        : currentUser.avatar;

    try {
        await db.user.update({
            where: { id: session.id },
            data: {
                username: result.data.username,
                discord_name: result.data.discord_name || null,
                discord_tag: result.data.discord_tag || null,
                avatar: nextAvatar,
            },
        });
    } catch (error) {
        const code =
            typeof error === "object" && error !== null && "code" in error
                ? String(error.code)
                : null;

        if (code === "P2002") {
            return {
                success: false,
                message: "이미 사용 중인 닉네임 또는 Discord 태그입니다.",
            };
        }
        return { success: false, message: "프로필 저장에 실패했습니다." };
    }

    const previousAvatarId = cloudflareImageId(currentUser.avatar);
    if (avatarChanged && previousAvatarId) {
        await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${previousAvatarId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
                },
            }
        ).catch(() => null);
    }

    redirect(`/profile/${session.id}`);
}

// 로그인한 사용자에게 일회용 이미지 업로드 주소를 발급함
export async function getImageUploadUrl() {
    const session = await getSession();
    if (!session.id) {
        return { success: false as const, message: "로그인이 필요합니다." };
    }

    try {
        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
                },
                cache: "no-store",
            }
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
            return {
                success: false as const,
                message: "이미지 업로드 주소를 만들지 못했습니다.",
            };
        }

        return {
            success: true as const,
            result: {
                uploadURL: String(data.result.uploadURL),
                deliveryURL: `https://imagedelivery.net/${CLOUDFLARE_DELIVERY_ACCOUNT}/${String(data.result.id)}`,
            },
        };
    } catch {
        return {
            success: false as const,
            message: "이미지 업로드 서버에 연결하지 못했습니다.",
        };
    }
}
