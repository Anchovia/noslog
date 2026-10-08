"use server";

import {
    discardFeedbackImage as discardFeedbackImageService,
    requestFeedbackImageUpload as requestFeedbackImageUploadService,
    submitFeedbackReport as submitFeedbackReportService,
} from "@/features/feedback/server/feedback-report-service";
import { listMyFeedback as listMyFeedbackService } from "@/features/feedback/server/my-feedback-service";
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

export async function listMyFeedback() {
    return listMyFeedbackService();
}
