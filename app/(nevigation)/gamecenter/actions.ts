"use server";

import { revalidatePath, updateTag } from "next/cache";

import { CACHE_TAGS, getUserProfileTag } from "@/lib/cacheTags";
import db from "@/lib/db";
import getSession from "@/lib/session";

export type PreferredArcadeActionResult =
    { success: true; message: string } | { success: false; message: string };

export async function setPreferredArcade(
    arcadeId: number
): Promise<PreferredArcadeActionResult> {
    const session = await getSession();
    if (!session.id) {
        return { success: false, message: "로그인이 필요합니다." };
    }
    if (!Number.isInteger(arcadeId)) {
        return { success: false, message: "오락실을 다시 선택해주세요." };
    }

    const arcade = await db.arcade.findFirst({
        where: { id: arcadeId, is_active: true },
        select: { id: true, name: true },
    });
    if (!arcade) {
        return {
            success: false,
            message: "선택한 오락실을 찾을 수 없습니다.",
        };
    }

    await db.user.update({
        where: { id: session.id },
        data: { preferred_arcade_id: arcade.id },
    });

    updateTag(CACHE_TAGS.arcades);
    updateTag(CACHE_TAGS.userProfiles);
    updateTag(getUserProfileTag(session.id));
    revalidatePath("/gamecenter");
    revalidatePath(`/profile/${session.id}`);
    revalidatePath("/profile/settings");

    return {
        success: true,
        message: `${arcade.name}을(를) 선호 오락실로 지정했습니다.`,
    };
}
