"use server";

import {
    requestFeedbackImageUpload as requestFeedbackImageUploadService,
    submitFeedbackReport as submitFeedbackReportService,
    discardFeedbackImage as discardFeedbackImageService,
} from "@/features/feedback/server/feedbackReportService";
import type { Locale } from "@/lib/i18n/routing";

export async function requestFeedbackImageUpload(
    contentType: string,
    requestedLocale?: Locale
) {
    return requestFeedbackImageUploadService(contentType, requestedLocale);
}

export async function submitFeedbackReport(formData: FormData) {
    return submitFeedbackReportService(formData);
}

export async function discardFeedbackImage(imageUrl: string) {
    return discardFeedbackImageService(imageUrl);
}
