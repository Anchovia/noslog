import "server-only";

import { revalidatePath } from "next/cache";
import { getExamEligibility } from "@/features/exams/examEligibility";

import {
    createExamProofSubmissionSchema,
    createExamProofUploadRequestSchema,
    examProofSubmissionInputFromFormData,
    type ExamProofSubmissionFormValues,
} from "@/features/exams/schemas/examProofSchema";
import type { ActionResult } from "@/lib/actions/result";
import {
    createPrivateImageUploadToken,
    deleteBlobIfOwned,
    isValidPrivateImageBlob,
} from "@/lib/blob";
import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/routing";
import { logServerError } from "@/lib/observability/server";
import getSession from "@/lib/session";
import {
    claimUploadTokenQuota,
    getUploadLimitMessage,
    releaseUploadTokenQuota,
} from "@/lib/uploadRateLimit";

type ExamProofFieldName = Extract<keyof ExamProofSubmissionFormValues, string>;
type ExamProofActionResult = ActionResult<
    Record<never, never>,
    ExamProofFieldName
> & { requiresLogin?: boolean };
type ExamProofUploadActionResult = ActionResult<{
    pathname: string;
    token: string;
}> & { requiresLogin?: boolean };

async function getAvailableExam(examId: number, userId: number) {
    const exam = await db.exam.findFirst({
        where: {
            id: examId,
            status: "published",
        },
        select: {
            id: true,
            mode: true,
            grade: true,
            requiredGrade: true,
            achievements: {
                where: { userId },
                select: { id: true },
                take: 1,
            },
            submissions: {
                where: { userId, status: "pending" },
                select: { id: true },
                take: 1,
            },
        },
    });

    if (!exam || (exam.mode !== "basic" && exam.mode !== "recital"))
        return null;

    const user = await db.user.findUnique({
        where: { id: userId },
        select: {
            nostalgia_name: true,
            grade_basic: true,
            grade_recital: true,
            examAchievements: {
                select: { exam: { select: { mode: true, grade: true } } },
            },
        },
    });
    const eligibility = getExamEligibility(exam, user);
    if (eligibility === "achieved") {
        return { ...exam, alreadyAchieved: true };
    }
    return eligibility === "eligible"
        ? { ...exam, alreadyAchieved: false }
        : null;
}

export async function requestExamProofUpload(
    examId: number,
    contentType: string,
    requestedLocale?: Locale
): Promise<ExamProofUploadActionResult> {
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const t = createTranslator(getMessages(locale));
    const session = await getSession();

    if (!session.id) {
        return {
            success: false as const,
            message: t("onboarding.error.loginRequired"),
            requiresLogin: true,
        };
    }

    const inputResult = createExamProofUploadRequestSchema(t).safeParse({
        examId,
        contentType,
    });
    if (!inputResult.success) {
        const fieldErrors = inputResult.error.flatten().fieldErrors;
        return {
            success: false,
            message: fieldErrors.examId?.length
                ? t("exams.error.invalid")
                : t("exams.proof.invalidImage"),
            fieldErrors,
        };
    }
    const userId = session.id;
    const input = inputResult.data;
    let grantId: number | null = null;

    try {
        const exam = await getAvailableExam(input.examId, userId);
        if (!exam) {
            return {
                success: false,
                message: t("exams.error.unavailable"),
            };
        }
        if (exam.alreadyAchieved || exam.achievements.length > 0) {
            return {
                success: false,
                message: t("exams.error.alreadyPassed"),
            };
        }
        if (exam.submissions.length > 0) {
            return { success: false, message: t("exams.error.pending") };
        }

        const quota = await claimUploadTokenQuota(userId, "exam-proof");
        if (!quota.allowed) {
            return {
                success: false,
                message:
                    locale === "ko"
                        ? getUploadLimitMessage()
                        : t("exams.error.uploadLimit"),
            };
        }
        grantId = quota.grantId;

        const upload = await createPrivateImageUploadToken(
            `exam-proofs/${userId}/${input.examId}/proof`,
            input.contentType
        );
        if (!upload) {
            await releaseUploadTokenQuota(userId, grantId).catch(() => null);
            return {
                success: false,
                message: t("exams.proof.invalidImage"),
            };
        }

        return { success: true, message: "", ...upload };
    } catch (error) {
        logServerError(error, {
            event: "exam.proof-upload.request.failed",
            routePath: "/exams",
            routeType: "action",
        });
        if (grantId !== null) {
            await releaseUploadTokenQuota(userId, grantId).catch(() => null);
        }
        return {
            success: false,
            message: t("exams.error.uploadRequest"),
        };
    }
}

export async function submitExamProof(
    formData: FormData
): Promise<ExamProofActionResult> {
    const requestedLocale = String(formData.get("locale") ?? "");
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const t = createTranslator(getMessages(locale));
    const session = await getSession();

    if (!session.id) {
        return {
            success: false as const,
            message: t("onboarding.error.loginRequired"),
            requiresLogin: true,
        };
    }

    const inputResult = createExamProofSubmissionSchema(t).safeParse(
        examProofSubmissionInputFromFormData(formData)
    );
    if (!inputResult.success) {
        const fieldErrors = inputResult.error.flatten().fieldErrors;
        return {
            success: false,
            message: fieldErrors.examId?.length
                ? t("exams.error.invalid")
                : t("exams.error.invalidUrl"),
            fieldErrors,
        };
    }
    const userId = session.id;
    const { examId, proofImageUrl } = inputResult.data;

    if (
        !(await isValidPrivateImageBlob(
            proofImageUrl,
            `exam-proofs/${userId}/${examId}/proof`
        ))
    ) {
        return {
            success: false,
            message: t("exams.error.invalidUrl"),
            fieldErrors: {
                proofImageUrl: [t("exams.error.invalidUrl")],
            },
        };
    }

    let exam: Awaited<ReturnType<typeof getAvailableExam>>;
    try {
        const existing = await db.examSubmission.findFirst({
            where: { userId, examId, proofImageUrl },
            select: { status: true },
        });
        if (existing && existing.status !== "rejected") {
            return { success: true, message: t("exams.proof.submitted") };
        }
        if (existing?.status === "rejected") {
            return { success: false, message: t("exams.proof.resubmit") };
        }
        exam = await getAvailableExam(examId, userId);
    } catch (error) {
        logServerError(error, {
            event: "exam.proof-submit.availability.failed",
            routePath: "/exams",
            routeType: "action",
        });
        return { success: false, message: t("exams.error.submit") };
    }

    if (!exam) {
        return {
            success: false,
            message: t("exams.error.unavailable"),
        };
    }
    if (exam.alreadyAchieved || exam.achievements.length > 0) {
        return {
            success: false,
            message: t("exams.error.alreadyPassed"),
        };
    }
    if (exam.submissions.length > 0) {
        return { success: false, message: t("exams.error.pending") };
    }

    let rejectedSubmissions: {
        id: number;
        proofImageUrl: string | null;
    }[];
    try {
        rejectedSubmissions = await db.examSubmission.findMany({
            where: {
                userId,
                examId: exam.id,
                status: "rejected",
            },
            select: { id: true, proofImageUrl: true },
        });

        await db.$transaction(async (tx) => {
            // 같은 사용자의 동시 제출을 직렬화하고 잠금 안에서 중복을 다시 확인함
            await tx.$queryRaw`SELECT id FROM "User" WHERE id = ${userId} FOR UPDATE`;
            const pending = await tx.examSubmission.findFirst({
                where: { userId, examId: exam.id, status: "pending" },
                select: { proofImageUrl: true },
            });
            if (pending) {
                if (pending.proofImageUrl === proofImageUrl) return;
                throw new Error("Exam submission is already pending");
            }
            if (rejectedSubmissions.length > 0) {
                await tx.examSubmission.deleteMany({
                    where: {
                        id: { in: rejectedSubmissions.map(({ id }) => id) },
                        status: "rejected",
                    },
                });
            }

            await tx.examSubmission.create({
                data: {
                    userId,
                    examId: exam.id,
                    proofImageUrl,
                },
            });
        });
    } catch (error) {
        logServerError(error, {
            event: "exam.proof-submit.persist.failed",
            routePath: "/exams",
            routeType: "action",
        });
        return {
            success: false,
            message: t("exams.error.submit"),
        };
    }

    await Promise.all(
        rejectedSubmissions.map(({ proofImageUrl: rejectedProofUrl }) =>
            deleteBlobIfOwned(rejectedProofUrl)
        )
    );
    revalidatePath("/exams");

    return { success: true, message: t("exams.proof.submitted") };
}

// 업로드 후 제출 요청이 중단된 경우 DB에서 사용하지 않는 Blob만 정리함
export async function discardExamProofUpload(
    examId: number,
    proofImageUrl: string
) {
    const session = await getSession();
    if (!session.id) return;

    const t = createTranslator(getMessages("ko"));
    const inputResult = createExamProofSubmissionSchema(t).safeParse({
        examId,
        proofImageUrl,
    });
    if (!inputResult.success) return;
    const input = inputResult.data;

    if (
        !(await isValidPrivateImageBlob(
            input.proofImageUrl,
            `exam-proofs/${session.id}/${input.examId}/proof`
        ))
    ) {
        return;
    }

    try {
        const storedSubmission = await db.examSubmission.findFirst({
            where: {
                userId: session.id,
                examId: input.examId,
                proofImageUrl: input.proofImageUrl,
            },
            select: { id: true },
        });
        if (!storedSubmission) {
            await deleteBlobIfOwned(input.proofImageUrl);
        }
    } catch (error) {
        logServerError(error, {
            event: "exam.proof-upload.discard.failed",
            routePath: "/exams",
            routeType: "action",
        });
    }
}
