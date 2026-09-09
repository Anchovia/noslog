"use server";

import { updateFeedbackStatus as updateFeedbackStatusService } from "@/features/feedback/server/feedbackAdminService";

export async function updateFeedbackStatus(formData: FormData) {
    return updateFeedbackStatusService(formData);
}
