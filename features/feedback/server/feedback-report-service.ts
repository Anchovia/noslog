import "server-only";

import { revalidatePath } from "next/cache";

import {
    createFeedbackReportSchema,
    type FeedbackReportFormValues,
    feedbackReportInputFromFormData,
} from "@/features/feedback/schemas/feedback-report-schema";
import type { ActionResult } from "@/lib/actions/result";
import { actionValidationFailure } from "@/lib/actions/validation";
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
} from "@/lib/upload-rate-limit";

/** 오락실이 아닌 일반 피드백은 사람마다 24시간에 이만큼 — 오락실 제보와 따로 센다 */
const FEEDBACK_DAILY_LIMIT = 10;

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
                message: getUploadLimitMessage(locale),
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
        return actionValidationFailure(result.error, {
            message: t("feedback.attachmentError"),
            messageFields: ["content", "category"],
            alwaysIncludeFieldErrors: true,
        });
    }

    const { category, content, imageUrl } = result.data;
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
        const userId = session.id;
        // 세기와 넣기 사이를 사람마다 잠가 동시에 보낸 요청이 하루 한도를 넘지 않게 한다
        const saved = await db.$transaction(async (tx) => {
            await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`feedback-report:${userId}`}))`;
            const recent = await tx.feedbackReport.count({
                where: {
                    userId,
                    arcadeReportType: null,
                    createdAt: { gte: new Date(Date.now() - 86_400_000) },
                },
            });
            if (recent >= FEEDBACK_DAILY_LIMIT) return false;
            await tx.feedbackReport.create({
                data: { category, content, imageUrl, userId },
            });
            return true;
        });
        if (!saved) {
            if (imageUrl) await cleanupFeedbackImage(imageUrl, userId);
            return { success: false, message: t("feedback.dailyLimit") };
        }
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
