"use server";

import { updateFeedbackStatus as updateFeedbackStatusService } from "@/features/feedback/server/feedback-admin-service";

export async function updateFeedbackStatus(formData: FormData) {
    return updateFeedbackStatusService(formData);
}
