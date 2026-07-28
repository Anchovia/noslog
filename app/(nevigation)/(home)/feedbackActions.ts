"use server";

import { revalidatePath } from "next/cache";

import {
    createPrivateImageUploadToken,
    deleteBlobIfOwned,
    isImageContentType,
    isValidPrivateImageBlob,
} from "@/lib/blob";
import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/routing";
import getSession from "@/lib/session";
import {
    claimUploadTokenQuota,
    getUploadLimitMessage,
    releaseUploadTokenQuota,
} from "@/lib/uploadRateLimit";

export async function requestFeedbackImageUpload(
    contentType: string,
    requestedLocale?: Locale
) {
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const t = createTranslator(getMessages(locale));
    const session = await getSession();
    if (!session.id) {
        return { success: false as const, message: t("feedback.loginError") };
    }
    if (!isImageContentType(contentType)) {
        return {
            success: false as const,
            message: t("feedback.invalidImage"),
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
            message: t("feedback.uploadError"),
        };
    }
}

export async function submitFeedbackReport(
    contentInput: string,
    imageUrlInput: string,
    requestedLocale?: Locale
) {
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const t = createTranslator(getMessages(locale));
    const session = await getSession();
    if (!session.id) {
        return { success: false as const, message: t("feedback.loginError") };
    }

    const content = contentInput.trim();
    const imageUrl = imageUrlInput.trim() || null;
    if (content.length < 10 || content.length > 1000) {
        if (imageUrl) await deleteBlobIfOwned(imageUrl);
        return {
            success: false as const,
            message: t("feedback.contentError"),
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
            message: t("feedback.attachmentError"),
        };
    }

    try {
        await db.feedbackReport.create({
            data: { content, imageUrl, userId: session.id },
        });
        revalidatePath("/admin");
        revalidatePath("/admin/feedback");
        return { success: true as const, message: t("feedback.success") };
    } catch {
        if (imageUrl) await deleteBlobIfOwned(imageUrl);
        return {
            success: false as const,
            message: t("feedback.submitError"),
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
