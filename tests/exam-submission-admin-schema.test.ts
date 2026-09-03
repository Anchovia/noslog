import { describe, expect, it } from "vitest";

import {
    examSubmissionReviewInputFromFormData,
    examSubmissionReviewSchema,
    normalizeExamSubmissionStatus,
} from "@/features/exams/schemas/examSubmissionAdminSchema";

describe("관리자 검정 인증 심사 스키마", () => {
    it("지원하는 목록 상태만 유지한다", () => {
        expect(normalizeExamSubmissionStatus("approved")).toBe("approved");
        expect(normalizeExamSubmissionStatus("unknown")).toBe("pending");
        expect(normalizeExamSubmissionStatus(undefined)).toBe("pending");
    });

    it("심사 FormData를 정규화한다", () => {
        const formData = new FormData();
        formData.set("submissionId", "50");
        formData.set("status", "rejected");
        formData.set("reviewerNote", "  증빙을 확인해주세요.  ");

        const result = examSubmissionReviewSchema.parse(
            examSubmissionReviewInputFromFormData(formData)
        );

        expect(result).toEqual({
            submissionId: 50,
            status: "rejected",
            reviewerNote: "증빙을 확인해주세요.",
        });
    });

    it("승인과 반려 외의 심사 결과를 거부한다", () => {
        const result = examSubmissionReviewSchema.safeParse({
            submissionId: 50,
            status: "pending",
            reviewerNote: "",
        });

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.issues[0]?.path).toEqual(["status"]);
    });

    it("양의 정수가 아닌 인증 ID를 거부한다", () => {
        const result = examSubmissionReviewSchema.safeParse({
            submissionId: 0,
            status: "approved",
            reviewerNote: "",
        });

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.issues[0]?.path).toEqual(["submissionId"]);
    });
});
