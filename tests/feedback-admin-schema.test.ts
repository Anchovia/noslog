import { describe, expect, it } from "vitest";

import {
    createFeedbackStatusUpdateFormData,
    feedbackStatusUpdateInputFromFormData,
    feedbackStatusUpdateSchema,
    normalizeFeedbackStatus,
} from "@/features/feedback/schemas/feedbackAdminSchema";

describe("관리자 피드백 스키마", () => {
    it("지원하는 목록 상태만 유지한다", () => {
        expect(normalizeFeedbackStatus("resolved")).toBe("resolved");
        expect(normalizeFeedbackStatus("unknown")).toBe("open");
        expect(normalizeFeedbackStatus(undefined)).toBe("open");
    });

    it("상태 변경 FormData를 정규화한다", () => {
        const formData = createFeedbackStatusUpdateFormData(15, "resolved");

        expect(
            feedbackStatusUpdateSchema.parse(
                feedbackStatusUpdateInputFromFormData(formData)
            )
        ).toEqual({
            feedbackId: 15,
            status: "resolved",
        });
    });

    it("지원하지 않는 상태를 거부한다", () => {
        const result = feedbackStatusUpdateSchema.safeParse({
            feedbackId: 15,
            status: "pending",
        });

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.issues[0]?.path).toEqual(["status"]);
    });

    it("양의 정수가 아닌 피드백 ID를 거부한다", () => {
        const result = feedbackStatusUpdateSchema.safeParse({
            feedbackId: 0,
            status: "open",
        });

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.issues[0]?.path).toEqual(["feedbackId"]);
    });
});
