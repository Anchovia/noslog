"use server";

import { revalidatePath } from "next/cache";

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
import { normalizeStoredGrade } from "@/lib/utils";

type ExamProofFieldName = Extract<keyof ExamProofSubmissionFormValues, string>;
type ExamProofActionResult = ActionResult<
    Record<never, never>,
    ExamProofFieldName
>;
type ExamProofUploadActionResult = ActionResult<{
    pathname: string;
    token: string;
}>;

async function getAvailableExam(examId: number, userId: number) {
    const exam = await db.exam.findFirst({
        where: {
            id: examId,
            status: "published",
        },
        select: {
            id: true,
            mode: true,
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

    if (!exam || exam.requiredGrade === 0) return exam;

    const user = await db.user.findUnique({
        where: { id: userId },
        select: { grade_basic: true, grade_recital: true },
    });
    const storedGrade =
        exam.mode === "recital"
            ? (user?.grade_recital ?? null)
            : (user?.grade_basic ?? null);
    const playerGrade = normalizeStoredGrade(storedGrade);

    return playerGrade !== null && playerGrade >= exam.requiredGrade
        ? exam
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
        if (exam.achievements.length > 0) {
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
        exam = await getAvailableExam(examId, userId);
    } catch (error) {
        logServerError(error, {
            event: "exam.proof-submit.availability.failed",
            routePath: "/exams",
            routeType: "action",
        });
        await deleteBlobIfOwned(proofImageUrl);
        return { success: false, message: t("exams.error.submit") };
    }

    if (!exam) {
        await deleteBlobIfOwned(proofImageUrl);
        return {
            success: false,
            message: t("exams.error.unavailable"),
        };
    }
    if (exam.achievements.length > 0) {
        await deleteBlobIfOwned(proofImageUrl);
        return {
            success: false,
            message: t("exams.error.alreadyPassed"),
        };
    }
    if (exam.submissions.length > 0) {
        await deleteBlobIfOwned(proofImageUrl);
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
        await deleteBlobIfOwned(proofImageUrl);
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
