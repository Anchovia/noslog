"use server";

import { revalidatePath } from "next/cache";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { normalizeStoredGrade } from "@/lib/utils";

interface CloudflareUploadResponse {
    success: boolean;
    result?: {
        id: string;
        uploadURL: string;
    };
}

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

export async function requestExamProofUpload(examId: number) {
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
    if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_API_KEY) {
        return {
            success: false as const,
            message: "이미지 업로드 설정이 필요합니다.",
        };
    }

    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
            },
            cache: "no-store",
        }
    );
    const data = (await response.json()) as CloudflareUploadResponse;

    if (!response.ok || !data.success || !data.result) {
        return {
            success: false as const,
            message: "업로드 주소를 생성하지 못했습니다.",
        };
    }

    const deliveryHash =
        process.env.CLOUDFLARE_IMAGES_DELIVERY_HASH ?? "zAwkQO6bEReNpmM7QzHHXA";

    return {
        success: true as const,
        uploadUrl: data.result.uploadURL,
        imageUrl: `https://imagedelivery.net/${deliveryHash}/${data.result.id}/public`,
    };
}

export async function submitExamProof(examId: number, proofImageUrl: string) {
    const session = await getSession();

    if (!session.id) {
        return { success: false as const, message: "로그인이 필요합니다." };
    }
    if (!Number.isInteger(examId)) {
        return { success: false as const, message: "잘못된 검정입니다." };
    }

    let proofUrl: URL;
    try {
        proofUrl = new URL(proofImageUrl);
    } catch {
        return {
            success: false as const,
            message: "잘못된 이미지 주소입니다.",
        };
    }
    if (
        proofUrl.protocol !== "https:" ||
        proofUrl.hostname !== "imagedelivery.net" ||
        !proofUrl.pathname.startsWith(
            `/${process.env.CLOUDFLARE_IMAGES_DELIVERY_HASH ?? "zAwkQO6bEReNpmM7QzHHXA"}/`
        )
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
