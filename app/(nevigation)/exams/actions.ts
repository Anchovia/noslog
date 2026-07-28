"use server";

import { revalidatePath } from "next/cache";

import {
    createPrivateImageUploadToken,
    deleteBlobIfOwned,
    isImageContentType,
    isValidPrivateImageBlob,
} from "@/lib/blob";
import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { isLocale } from "@/lib/i18n/routing";
import getSession from "@/lib/session";
import {
    claimUploadTokenQuota,
    getUploadLimitMessage,
    releaseUploadTokenQuota,
} from "@/lib/uploadRateLimit";
import { normalizeStoredGrade } from "@/lib/utils";

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
    requestedLocale = "ko"
) {
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const t = createTranslator(getMessages(locale));
    const session = await getSession();

    if (!session.id) {
        return {
            success: false as const,
            message: t("onboarding.error.loginRequired"),
        };
    }
    const userId = session.id;
    if (!Number.isInteger(examId)) {
        return { success: false as const, message: t("exams.error.invalid") };
    }
    if (!isImageContentType(contentType)) {
        return {
            success: false as const,
            message: t("exams.proof.invalidImage"),
        };
    }

    const exam = await getAvailableExam(examId, userId);
    if (!exam) {
        return {
            success: false as const,
            message: t("exams.error.unavailable"),
        };
    }
    if (exam.achievements.length > 0) {
        return {
            success: false as const,
            message: t("exams.error.alreadyPassed"),
        };
    }
    if (exam.submissions.length > 0) {
        return { success: false as const, message: t("exams.error.pending") };
    }
    let grantId: number | null = null;
    try {
        const quota = await claimUploadTokenQuota(userId, "exam-proof");
        if (!quota.allowed) {
            return {
                success: false as const,
                message:
                    locale === "ko"
                        ? getUploadLimitMessage()
                        : t("exams.error.uploadLimit"),
            };
        }
        grantId = quota.grantId;

        const upload = await createPrivateImageUploadToken(
            `exam-proofs/${userId}/${examId}/proof`,
            contentType
        );
        if (!upload) {
            await releaseUploadTokenQuota(userId, grantId).catch(() => null);
            return {
                success: false as const,
                message: t("exams.proof.invalidImage"),
            };
        }

        return { success: true as const, ...upload };
    } catch {
        if (grantId !== null) {
            await releaseUploadTokenQuota(userId, grantId).catch(() => null);
        }
        return {
            success: false as const,
            message: t("exams.error.uploadRequest"),
        };
    }
}

export async function submitExamProof(
    examId: number,
    proofImageUrl: string,
    requestedLocale = "ko"
) {
    const locale = isLocale(requestedLocale) ? requestedLocale : "ko";
    const t = createTranslator(getMessages(locale));
    const session = await getSession();

    if (!session.id) {
        return {
            success: false as const,
            message: t("onboarding.error.loginRequired"),
        };
    }
    const userId = session.id;
    if (!Number.isInteger(examId)) {
        return { success: false as const, message: t("exams.error.invalid") };
    }

    if (
        !(await isValidPrivateImageBlob(
            proofImageUrl,
            `exam-proofs/${userId}/${examId}/proof`
        ))
    ) {
        return {
            success: false as const,
            message: t("exams.error.invalidUrl"),
        };
    }

    const exam = await getAvailableExam(examId, userId);

    if (!exam) {
        await deleteBlobIfOwned(proofImageUrl);
        return {
            success: false as const,
            message: t("exams.error.unavailable"),
        };
    }
    if (exam.achievements.length > 0) {
        await deleteBlobIfOwned(proofImageUrl);
        return {
            success: false as const,
            message: t("exams.error.alreadyPassed"),
        };
    }
    if (exam.submissions.length > 0) {
        await deleteBlobIfOwned(proofImageUrl);
        return { success: false as const, message: t("exams.error.pending") };
    }

    const rejectedSubmissions = await db.examSubmission.findMany({
        where: {
            userId,
            examId: exam.id,
            status: "rejected",
        },
        select: { id: true, proofImageUrl: true },
    });

    try {
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
    } catch {
        await deleteBlobIfOwned(proofImageUrl);
        return {
            success: false as const,
            message: t("exams.error.submit"),
        };
    }

    await Promise.all(
        rejectedSubmissions.map(({ proofImageUrl: rejectedProofUrl }) =>
            deleteBlobIfOwned(rejectedProofUrl)
        )
    );
    revalidatePath("/exams");

    return { success: true as const };
}

// 업로드 후 제출 요청이 중단된 경우 DB에서 사용하지 않는 Blob만 정리함
export async function discardExamProofUpload(
    examId: number,
    proofImageUrl: string
) {
    const session = await getSession();
    if (!session.id || !Number.isInteger(examId)) return;

    if (
        !(await isValidPrivateImageBlob(
            proofImageUrl,
            `exam-proofs/${session.id}/${examId}/proof`
        ))
    ) {
        return;
    }

    const storedSubmission = await db.examSubmission.findFirst({
        where: {
            userId: session.id,
            examId,
            proofImageUrl,
        },
        select: { id: true },
    });
    if (!storedSubmission) await deleteBlobIfOwned(proofImageUrl);
}
