"use server";

import { revalidatePath } from "next/cache";

import {
    createImageUploadToken,
    deleteBlobIfOwned,
    isValidImageBlob,
} from "@/lib/blob";
import db from "@/lib/db";
import getSession from "@/lib/session";
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
    contentType: string
) {
    const session = await getSession();

    if (!session.id) {
        return { success: false as const, message: "로그인이 필요합니다." };
    }
    const userId = session.id;
    if (!Number.isInteger(examId)) {
        return { success: false as const, message: "잘못된 검정입니다." };
    }

    const exam = await getAvailableExam(examId, userId);
    if (!exam) {
        return {
            success: false as const,
            message: "현재 응시할 수 없는 검정입니다.",
        };
    }
    if (exam.achievements.length > 0) {
        return { success: false as const, message: "이미 합격한 검정입니다." };
    }
    if (exam.submissions.length > 0) {
        return { success: false as const, message: "현재 심사 중입니다." };
    }
    try {
        const upload = await createImageUploadToken(
            `exam-proofs/${userId}/${examId}/proof`,
            contentType
        );
        if (!upload) {
            return {
                success: false as const,
                message: "JPG, PNG, WebP 이미지만 사용할 수 있습니다.",
            };
        }

        return { success: true as const, ...upload };
    } catch {
        return {
            success: false as const,
            message: "Vercel Blob 업로드 설정을 확인해주세요.",
        };
    }
}

export async function submitExamProof(examId: number, proofImageUrl: string) {
    const session = await getSession();

    if (!session.id) {
        return { success: false as const, message: "로그인이 필요합니다." };
    }
    const userId = session.id;
    if (!Number.isInteger(examId)) {
        return { success: false as const, message: "잘못된 검정입니다." };
    }

    if (
        !(await isValidImageBlob(
            proofImageUrl,
            `exam-proofs/${userId}/${examId}/proof`
        ))
    ) {
        return {
            success: false as const,
            message: "허용되지 않은 이미지 주소입니다.",
        };
    }

    const exam = await getAvailableExam(examId, userId);

    if (!exam) {
        await deleteBlobIfOwned(proofImageUrl);
        return {
            success: false as const,
            message: "현재 응시할 수 없는 검정입니다.",
        };
    }
    if (exam.achievements.length > 0) {
        await deleteBlobIfOwned(proofImageUrl);
        return { success: false as const, message: "이미 합격한 검정입니다." };
    }
    if (exam.submissions.length > 0) {
        await deleteBlobIfOwned(proofImageUrl);
        return { success: false as const, message: "현재 심사 중입니다." };
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
            message: "합격 인증 제출에 실패했습니다.",
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
        !(await isValidImageBlob(
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
