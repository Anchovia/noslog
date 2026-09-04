import { z } from "zod";

export const FEEDBACK_STATUSES = ["open", "resolved"] as const;

export const feedbackStatusSchema = z.enum(FEEDBACK_STATUSES, {
    error: "피드백 상태를 확인해주세요.",
});

export const feedbackStatusUpdateSchema = z.object({
    feedbackId: z.coerce
        .number({ error: "잘못된 피드백입니다." })
        .int("잘못된 피드백입니다.")
        .positive("잘못된 피드백입니다."),
    status: feedbackStatusSchema,
});

export type FeedbackStatus = z.infer<typeof feedbackStatusSchema>;

export function normalizeFeedbackStatus(value: string | undefined) {
    const result = feedbackStatusSchema.safeParse(value);
    return result.success ? result.data : "open";
}

export function feedbackStatusUpdateInputFromFormData(formData: FormData) {
    return {
        feedbackId: formData.get("feedbackId"),
        status: String(formData.get("status") ?? ""),
    };
}

export function createFeedbackStatusUpdateFormData(
    feedbackId: number,
    status: FeedbackStatus
) {
    const formData = new FormData();
    formData.set("feedbackId", String(feedbackId));
    formData.set("status", status);
    return formData;
}
