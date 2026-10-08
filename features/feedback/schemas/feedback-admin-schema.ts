import { z } from "zod";

const FEEDBACK_STATUSES = ["open", "resolved"] as const;

export const feedbackStatusSchema = z.enum(FEEDBACK_STATUSES, {
    error: "피드백 상태를 확인해주세요.",
});

export const feedbackStatusUpdateSchema = z.object({
    feedbackId: z.coerce
        .number({ error: "잘못된 피드백입니다." })
        .int("잘못된 피드백입니다.")
        .positive("잘못된 피드백입니다."),
    status: feedbackStatusSchema,
    // 처리 완료 때 쓰는 답변(선택) — 제보한 사람의 「내 제보」 에 보인다(2026-09-18)
    reply: z
        .string()
        .trim()
        .max(1000, "답변은 1,000자까지 쓸 수 있습니다.")
        .default(""),
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
        reply: String(formData.get("reply") ?? ""),
    };
}

export function createFeedbackStatusUpdateFormData(
    feedbackId: number,
    status: FeedbackStatus,
    reply = ""
) {
    const formData = new FormData();
    formData.set("feedbackId", String(feedbackId));
    formData.set("status", status);
    formData.set("reply", reply);
    return formData;
}
