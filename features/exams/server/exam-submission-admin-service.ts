import { revalidatePath, updateTag } from "next/cache";

import {
    examSubmissionDeleteInputFromFormData,
    examSubmissionDeleteSchema,
    type ExamSubmissionReviewFieldName,
    examSubmissionReviewInputFromFormData,
    examSubmissionReviewSchema,
    type ExamSubmissionStatus,
} from "@/features/exams/schemas/exam-submission-admin-schema";
import type { AdminExamSubmission } from "@/features/exams/types/exam-submission-admin";
import type { ActionResult } from "@/lib/actions/result";
import { actionValidationFailure } from "@/lib/actions/validation";
import { requireAdmin } from "@/lib/admin";
import { deleteBlobIfOwned } from "@/lib/blob";
import { CACHE_TAGS, getUserProfileTag } from "@/lib/cache-tags";
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
                        nostalgiaName: true,
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
            reviewerNote: submission.reviewNote,
            submittedAt: submission.submittedAt.toISOString(),
            hasProofImage: Boolean(submission.proofImageUrl),
            userName:
                submission.user.nostalgiaName ??
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
    if (!result.success)
        return actionValidationFailure<ExamSubmissionReviewFieldName>(
            result.error,
            {
                message: "검정 인증 심사 입력을 확인해주세요.",
                preferFirstIssue: true,
            }
        );
    const input = result.data;
    let reviewedUserId: number;

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
        reviewedUserId = submission.userId;

        // 대기 중일 때만 — 다른 운영자가 먼저 처리했으면 합격 기록을 건드리지 않는다(2026-10-16 D5)
        const claimed = await db.$transaction(async (transaction) => {
            const changed = await transaction.examSubmission.updateMany({
                where: { id: submission.id, status: "pending" },
                data: {
                    status: input.status,
                    reviewNote: input.reviewerNote || null,
                    reviewedAt: new Date(),
                },
            });
            if (!changed.count) return false;

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
            return true;
        });
        if (!claimed)
            return {
                success: false,
                message: "대기 중인 검정 인증을 찾을 수 없습니다.",
            };
    } catch (error) {
        logExamSubmissionError(error, "admin.exam-submission.review.failed");
        return {
            success: false,
            message: "검정 인증을 심사하지 못했습니다.",
        };
    }

    refreshExamSubmissions();
    // 검정 배지는 합격 기록에서 유도되므로 그 사용자의 프로필과 랭킹 행도 새로 그린다
    updateTag(getUserProfileTag(reviewedUserId));
    updateTag(CACHE_TAGS.userRankings);
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
        return actionValidationFailure(result.error, {
            message: "잘못된 검정 인증입니다.",
            preferFirstIssue: true,
            fieldPath: false,
        });
    }

    let deletedUserId: number;
    try {
        const submission = await db.examSubmission.findUnique({
            where: { id: result.data.submissionId },
            select: { id: true, proofImageUrl: true, userId: true },
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
        deletedUserId = submission.userId;
    } catch (error) {
        logExamSubmissionError(error, "admin.exam-submission.delete.failed");
        return {
            success: false,
            message: "검정 인증을 삭제하지 못했습니다.",
        };
    }

    refreshExamSubmissions();
    // 승인된 인증이면 합격 기록도 함께 지워지므로, 심사 때와 같이 프로필 · 랭킹을 새로 그린다(2026-10-16)
    updateTag(getUserProfileTag(deletedUserId));
    updateTag(CACHE_TAGS.userRankings);
    return { success: true, message: "검정 인증을 삭제했습니다." };
}
