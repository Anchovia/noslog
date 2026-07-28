"use server";

import { deleteBlobStrict } from "@/lib/blob";
import db from "@/lib/db";
import getSession from "@/lib/session";

const DELETE_CONFIRMATION = "회원 탈퇴";

export async function deleteAccount(confirmationInput: string) {
    const session = await getSession();
    if (!session.id) {
        return { success: false as const, message: "로그인이 필요합니다." };
    }
    if (confirmationInput.trim() !== DELETE_CONFIRMATION) {
        return {
            success: false as const,
            message: `확인을 위해 '${DELETE_CONFIRMATION}'를 정확히 입력해주세요.`,
        };
    }

    const user = await db.user.findUnique({
        where: { id: session.id },
        select: {
            avatar: true,
            feedbackReports: { select: { imageUrl: true } },
            examSubmissions: { select: { proofImageUrl: true } },
        },
    });
    if (!user) {
        await session.destroy();
        return { success: true as const };
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
        await session.destroy();
        return { success: true as const };
    } catch (error) {
        console.error("회원 탈퇴 처리에 실패했습니다.", error);
        return {
            success: false as const,
            message:
                "회원 탈퇴를 완료하지 못했습니다. 잠시 후 다시 시도하거나 운영자에게 문의해주세요.",
        };
    }
}
