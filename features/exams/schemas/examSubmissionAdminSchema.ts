import { z } from "zod";

export const examSubmissionStatusSchema = z.enum(
    ["pending", "approved", "rejected"],
    { error: "인증 상태를 확인해주세요." }
);

const examSubmissionReviewStatusSchema = z.enum(["approved", "rejected"], {
    error: "심사 결과를 확인해주세요.",
});

const examSubmissionIdSchema = z
    .number({ error: "잘못된 인증입니다." })
    .int("잘못된 인증입니다.")
    .positive("잘못된 인증입니다.");

export const examSubmissionReviewSchema = z.object({
    submissionId: examSubmissionIdSchema,
    status: examSubmissionReviewStatusSchema,
    reviewerNote: z.string().trim(),
});

export const examSubmissionDeleteSchema = z.object({
    submissionId: examSubmissionIdSchema,
});

export type ExamSubmissionStatus = z.infer<typeof examSubmissionStatusSchema>;
export type ExamSubmissionReviewFormValues = z.input<
    typeof examSubmissionReviewSchema
>;
export type ExamSubmissionReviewValues = z.output<
    typeof examSubmissionReviewSchema
>;
export type ExamSubmissionReviewFieldName = Extract<
    keyof ExamSubmissionReviewFormValues,
    string
>;

export function normalizeExamSubmissionStatus(value: string | undefined) {
    const result = examSubmissionStatusSchema.safeParse(value);
    return result.success ? result.data : "pending";
}

export function examSubmissionReviewInputFromFormData(formData: FormData) {
    return {
        submissionId: Number(formData.get("submissionId")),
        status: String(formData.get("status") ?? ""),
        reviewerNote: String(formData.get("reviewerNote") ?? ""),
    };
}

export function examSubmissionDeleteInputFromFormData(formData: FormData) {
    return { submissionId: Number(formData.get("submissionId")) };
}

export function createExamSubmissionReviewFormData(
    values: ExamSubmissionReviewValues
) {
    const formData = new FormData();
    formData.set("submissionId", String(values.submissionId));
    formData.set("status", values.status);
    formData.set("reviewerNote", values.reviewerNote);
    return formData;
}

export function createExamSubmissionDeleteFormData(submissionId: number) {
    const formData = new FormData();
    formData.set("submissionId", String(submissionId));
    return formData;
}
