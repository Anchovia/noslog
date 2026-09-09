import "server-only";

import { revalidatePath } from "next/cache";

import {
    createFeedbackReportSchema,
    feedbackReportInputFromFormData,
    type FeedbackReportFormValues,
} from "@/features/feedback/schemas/feedbackReportSchema";
import type { ActionResult } from "@/lib/actions/result";
import {
    createPrivateImageUploadToken,
    deleteBlobIfOwned,
    isImageContentType,
    isValidPrivateImageBlob,
} from "@/lib/blob";
import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/routing";
import { logServerError } from "@/lib/observability/server";
import getSession from "@/lib/session";
import {
    claimUploadTokenQuota,
    getUploadLimitMessage,
    releaseUploadTokenQuota,
} from "@/lib/uploadRateLimit";

type FeedbackFieldName = Extract<keyof FeedbackReportFormValues, string>;
type FeedbackActionResult = ActionResult<
    Record<never, never>,
    FeedbackFieldName
>;
type FeedbackUploadActionResult = ActionResult<{
    pathname: string;
    token: string;
}>;

async function cleanupFeedbackImage(imageUrl: string, userId: number) {
    if (await isValidPrivateImageBlob(imageUrl, `feedback/${userId}/report`)) {
        await deleteBlobIfOwned(imageUrl);
    }
}

export async function requestFeedbackImageUpload(
    contentType: string,
    requestedLocale?: Locale
): Promise<FeedbackUploadActionResult> {
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const t = createTranslator(getMessages(locale));
    const session = await getSession();
    if (!session.id) {
        return { success: false, message: t("feedback.loginError") };
    }
    if (!isImageContentType(contentType)) {
        return {
            success: false,
            message: t("feedback.invalidImage"),
        };
    }

    let grantId: number | null = null;
    try {
        const quota = await claimUploadTokenQuota(session.id, "feedback-image");
        if (!quota.allowed) {
            return {
                success: false,
                message: getUploadLimitMessage(),
            };
        }
        grantId = quota.grantId;

        const upload = await createPrivateImageUploadToken(
            `feedback/${session.id}/report`,
            contentType
        );
        if (!upload) throw new Error("invalid image type");

        return { success: true, message: "", ...upload };
    } catch (error) {
        logServerError(error, {
            event: "feedback.image-upload.request.failed",
            routePath: "/",
            routeType: "action",
        });
        if (grantId !== null) {
            await releaseUploadTokenQuota(session.id, grantId).catch(
                () => null
            );
        }
        return {
            success: false,
            message: t("feedback.uploadError"),
        };
    }
}

export async function submitFeedbackReport(
    formData: FormData
): Promise<FeedbackActionResult> {
    const requestedLocale = String(formData.get("locale") ?? "");
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const t = createTranslator(getMessages(locale));
    const session = await getSession();
    if (!session.id) {
        return { success: false, message: t("feedback.loginError") };
    }

    const input = feedbackReportInputFromFormData(formData);
    const result = createFeedbackReportSchema(t).safeParse(input);
    if (!result.success) {
        if (input.imageUrl.trim()) {
            await cleanupFeedbackImage(input.imageUrl.trim(), session.id);
        }
        const fieldErrors = result.error.flatten().fieldErrors;
        return {
            success: false,
            message: fieldErrors.content?.length
                ? t("feedback.contentError")
                : t("feedback.attachmentError"),
            fieldErrors,
        };
    }

    const { content, imageUrl } = result.data;
    if (
        imageUrl &&
        !(await isValidPrivateImageBlob(
            imageUrl,
            `feedback/${session.id}/report`
        ))
    ) {
        return {
            success: false,
            message: t("feedback.attachmentError"),
        };
    }

    try {
        await db.feedbackReport.create({
            data: { content, imageUrl, userId: session.id },
        });
        revalidatePath("/admin");
        revalidatePath("/admin/feedback");
        return { success: true, message: t("feedback.success") };
    } catch (error) {
        logServerError(error, {
            event: "feedback.report.submit.failed",
            routePath: "/",
            routeType: "action",
        });
        if (imageUrl) await cleanupFeedbackImage(imageUrl, session.id);
        return {
            success: false,
            message: t("feedback.submitError"),
        };
    }
}

export async function discardFeedbackImage(imageUrl: string) {
    const session = await getSession();
    if (!session.id) return;
    await cleanupFeedbackImage(imageUrl, session.id);
}
