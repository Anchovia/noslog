"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function regenerateSyncToken() {
    const session = await getSession();
    if (!session.id) {
        return {
            success: false as const,
            message: "로그인이 필요합니다.",
        };
    }

    try {
        await db.user.update({
            where: { id: session.id },
            data: { sync_token_version: { increment: 1 } },
        });

        revalidatePath("/bookmarklet");
        return {
            success: true as const,
            message:
                "연동 토큰을 재발급했습니다. 북마클릿을 다시 등록해주세요.",
        };
    } catch (error) {
        console.error("연동 토큰 재발급에 실패했습니다.", error);
        return {
            success: false as const,
            message: "연동 토큰을 재발급하지 못했습니다. 다시 시도해주세요.",
        };
    }
}
