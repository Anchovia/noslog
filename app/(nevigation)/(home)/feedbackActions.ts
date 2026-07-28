"use server";

import { revalidatePath } from "next/cache";

import {
    createPrivateImageUploadToken,
    deleteBlobIfOwned,
    isImageContentType,
    isValidPrivateImageBlob,
} from "@/lib/blob";
import db from "@/lib/db";
import getSession from "@/lib/session";
import {
    claimUploadTokenQuota,
    getUploadLimitMessage,
    releaseUploadTokenQuota,
} from "@/lib/uploadRateLimit";

export async function requestFeedbackImageUpload(contentType: string) {
    const session = await getSession();
    if (!session.id) {
        return { success: false as const, message: "로그인이 필요합니다." };
    }
    if (!isImageContentType(contentType)) {
        return {
            success: false as const,
            message: "JPG, PNG, WebP 이미지만 첨부할 수 있습니다.",
        };
    }

    let grantId: number | null = null;
    try {
        const quota = await claimUploadTokenQuota(session.id, "feedback-image");
        if (!quota.allowed) {
            return {
                success: false as const,
                message: getUploadLimitMessage(),
            };
        }
        grantId = quota.grantId;

        const upload = await createPrivateImageUploadToken(
            `feedback/${session.id}/report`,
            contentType
        );
        if (!upload) throw new Error("invalid image type");

        return { success: true as const, ...upload };
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

export async function submitFeedbackReport(
    contentInput: string,
    imageUrlInput: string
) {
    const session = await getSession();
    if (!session.id) {
        return { success: false as const, message: "로그인이 필요합니다." };
    }

    const content = contentInput.trim();
    const imageUrl = imageUrlInput.trim() || null;
    if (content.length < 10 || content.length > 1000) {
        if (imageUrl) await deleteBlobIfOwned(imageUrl);
        return {
            success: false as const,
            message: "제보 내용은 10~1000자로 입력해주세요.",
        };
    }
    if (
        imageUrl &&
        !(await isValidPrivateImageBlob(
            imageUrl,
            `feedback/${session.id}/report`
        ))
    ) {
        return {
            success: false as const,
            message: "허용되지 않은 첨부 이미지입니다.",
        };
    }

    try {
        await db.feedbackReport.create({
            data: { content, imageUrl, userId: session.id },
        });
        revalidatePath("/admin");
        revalidatePath("/admin/feedback");
        return { success: true as const, message: "제보를 접수했습니다." };
    } catch {
        if (imageUrl) await deleteBlobIfOwned(imageUrl);
        return {
            success: false as const,
            message: "제보를 접수하지 못했습니다.",
        };
    }
}

export async function discardFeedbackImage(imageUrl: string) {
    const session = await getSession();
    if (!session.id) return;
    if (
        await isValidPrivateImageBlob(imageUrl, `feedback/${session.id}/report`)
    ) {
        await deleteBlobIfOwned(imageUrl);
    }
}
