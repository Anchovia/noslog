import { z } from "zod";

// 채보 커뮤니티 의견 · 답글 신고 상태(2026-10-17) — 신고가 쌓이기만 하고 보는 곳이 없어 관리자 피드백 화면에서 처리한다
const OPINION_REPORT_STATUSES = ["pending", "resolved"] as const;

export const opinionReportStatusSchema = z.enum(OPINION_REPORT_STATUSES, {
    error: "신고 상태를 확인해주세요.",
});

export const opinionReportStatusUpdateSchema = z.object({
    reportId: z.coerce
        .number({ error: "잘못된 신고입니다." })
        .int("잘못된 신고입니다.")
        .positive("잘못된 신고입니다."),
    status: opinionReportStatusSchema,
});

export type OpinionReportStatus = z.infer<typeof opinionReportStatusSchema>;

export function opinionReportStatusUpdateInputFromFormData(formData: FormData) {
    return {
        reportId: formData.get("reportId"),
        status: String(formData.get("status") ?? ""),
    };
}

export function createOpinionReportStatusUpdateFormData(
    reportId: number,
    status: OpinionReportStatus
) {
    const formData = new FormData();
    formData.set("reportId", String(reportId));
    formData.set("status", status);
    return formData;
}
