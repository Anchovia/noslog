"use server";

import { revalidatePath } from "next/cache";

import { createImageUploadToken, isValidImageBlob } from "@/lib/blob";
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
    if (!Number.isInteger(examId)) {
        return { success: false as const, message: "잘못된 검정입니다." };
    }

    const exam = await getAvailableExam(examId, session.id);
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
            `exam-proofs/${session.id}/${examId}/proof`,
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
    if (!Number.isInteger(examId)) {
        return { success: false as const, message: "잘못된 검정입니다." };
    }

    if (
        !(await isValidImageBlob(
            proofImageUrl,
            `exam-proofs/${session.id}/${examId}/proof`
        ))
    ) {
        return {
            success: false as const,
            message: "허용되지 않은 이미지 주소입니다.",
        };
    }

    const exam = await getAvailableExam(examId, session.id);

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

    await db.examSubmission.create({
        data: {
            userId: session.id,
            examId: exam.id,
            proofImageUrl,
        },
    });
    revalidatePath("/exams");

    return { success: true as const };
}
