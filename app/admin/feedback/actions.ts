"use server";

import { updateFeedbackStatus as updateFeedbackStatusService } from "@/features/feedback/server/feedback-admin-service";
import { updateOpinionReportStatus as updateOpinionReportStatusService } from "@/features/feedback/server/opinion-report-admin-service";

export async function updateFeedbackStatus(formData: FormData) {
    return updateFeedbackStatusService(formData);
}

export async function updateOpinionReportStatus(formData: FormData) {
    return updateOpinionReportStatusService(formData);
}
