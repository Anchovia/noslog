import { revalidatePath } from "next/cache";

import {
    examSubmissionDeleteInputFromFormData,
    examSubmissionDeleteSchema,
    examSubmissionReviewInputFromFormData,
    examSubmissionReviewSchema,
    type ExamSubmissionReviewFieldName,
    type ExamSubmissionStatus,
} from "@/features/exams/schemas/examSubmissionAdminSchema";
import type { AdminExamSubmission } from "@/features/exams/types/examSubmissionAdmin";
import type { ActionFieldErrors, ActionResult } from "@/lib/actions/result";
import { requireAdmin } from "@/lib/admin";
import { deleteBlobIfOwned } from "@/lib/blob";
import db from "@/lib/db";
import { logServerError } from "@/lib/observability/server";

type ExamSubmissionReviewResult = ActionResult<
    { status: "approved" | "rejected" },
    ExamSubmissionReviewFieldName
>;
type ExamSubmissionDeleteResult = ActionResult;

function refreshExamSubmissions() {
    revalidatePath("/admin");
    revalidatePath("/admin/submissions");
    revalidatePath("/exams");
}

function logExamSubmissionError(error: unknown, event: string) {
    logServerError(error, {
        event,
        routePath: "/admin/submissions",
        routeType: "action",
    });
}

function reviewFieldErrors(
    issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>
) {
    const fieldErrors: ActionFieldErrors<ExamSubmissionReviewFieldName> = {};

    for (const issue of issues) {
        const field = issue.path[0];
        if (typeof field !== "string") continue;
        const fieldName = field as ExamSubmissionReviewFieldName;
        fieldErrors[fieldName] ??= [];
        fieldErrors[fieldName]?.push(issue.message);
    }

    return fieldErrors;
}

export async function listExamSubmissions(
    status: ExamSubmissionStatus
): Promise<AdminExamSubmission[]> {
    await requireAdmin();

    try {
        const submissions = await db.examSubmission.findMany({
            where: { status },
            include: {
                user: {
                    select: {
                        username: true,
                        nostalgia_name: true,
                    },
                },
                exam: { select: { title: true } },
            },
            orderBy: { submittedAt: "desc" },
            take: 100,
        });

        return submissions.map((submission) => ({
            id: submission.id,
            status: submission.status as ExamSubmissionStatus,
            reviewerNote: submission.reviewerNote,
            submittedAt: submission.submittedAt.toISOString(),
            hasProofImage: Boolean(submission.proofImageUrl),
            userName:
                submission.user.nostalgia_name ??
                submission.user.username ??
                `유저 ${submission.userId}`,
            examTitle: submission.exam.title,
        }));
    } catch (error) {
        logExamSubmissionError(error, "admin.exam-submission.list.failed");
        throw error;
    }
}

export async function reviewExamSubmission(
    formData: FormData
): Promise<ExamSubmissionReviewResult> {
    await requireAdmin();
    const result = examSubmissionReviewSchema.safeParse(
        examSubmissionReviewInputFromFormData(formData)
    );
    if (!result.success) {
        const fieldErrors = reviewFieldErrors(result.error.issues);
        return {
            success: false,
            message:
                result.error.issues[0]?.message ??
                "검정 인증 심사 입력을 확인해주세요.",
            ...(Object.keys(fieldErrors).length > 0 ? { fieldErrors } : {}),
        };
    }
    const input = result.data;

    try {
        const submission = await db.examSubmission.findFirst({
            where: { id: input.submissionId, status: "pending" },
            select: { id: true, userId: true, examId: true },
        });
        if (!submission) {
            return {
                success: false,
                message: "대기 중인 검정 인증을 찾을 수 없습니다.",
            };
        }

        await db.$transaction(async (transaction) => {
            await transaction.examSubmission.update({
                where: { id: submission.id },
                data: {
                    status: input.status,
                    reviewerNote: input.reviewerNote || null,
                    reviewedAt: new Date(),
                },
            });

            if (input.status === "approved") {
                await transaction.examAchievement.upsert({
                    where: {
                        userId_examId: {
                            userId: submission.userId,
                            examId: submission.examId,
                        },
                    },
                    create: {
                        userId: submission.userId,
                        examId: submission.examId,
                        submissionId: submission.id,
                    },
                    update: {
                        submissionId: submission.id,
                        achievedAt: new Date(),
                    },
                });
            } else {
                await transaction.examAchievement.deleteMany({
                    where: { submissionId: submission.id },
                });
            }
        });
    } catch (error) {
        logExamSubmissionError(error, "admin.exam-submission.review.failed");
        return {
            success: false,
            message: "검정 인증을 심사하지 못했습니다.",
        };
    }

    refreshExamSubmissions();
    return {
        success: true,
        message:
            input.status === "approved"
                ? "검정 인증을 승인했습니다."
                : "검정 인증을 반려했습니다.",
        status: input.status,
    };
}

export async function deleteExamSubmission(
    formData: FormData
): Promise<ExamSubmissionDeleteResult> {
    await requireAdmin();
    const result = examSubmissionDeleteSchema.safeParse(
        examSubmissionDeleteInputFromFormData(formData)
    );
    if (!result.success) {
        return {
            success: false,
            message:
                result.error.issues[0]?.message ?? "잘못된 검정 인증입니다.",
        };
    }

    try {
        const submission = await db.examSubmission.findUnique({
            where: { id: result.data.submissionId },
            select: { id: true, proofImageUrl: true },
        });
        if (!submission) {
            return {
                success: false,
                message: "검정 인증을 찾을 수 없습니다.",
            };
        }

        await db.$transaction(async (transaction) => {
            await transaction.examAchievement.deleteMany({
                where: { submissionId: submission.id },
            });
            await transaction.examSubmission.delete({
                where: { id: submission.id },
            });
        });
        await deleteBlobIfOwned(submission.proofImageUrl);
    } catch (error) {
        logExamSubmissionError(error, "admin.exam-submission.delete.failed");
        return {
            success: false,
            message: "검정 인증을 삭제하지 못했습니다.",
        };
    }

    refreshExamSubmissions();
    return { success: true, message: "검정 인증을 삭제했습니다." };
}
