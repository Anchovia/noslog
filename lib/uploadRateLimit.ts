import "server-only";

import db from "@/lib/db";

export type UploadPurpose = "profile-avatar" | "exam-proof" | "feedback-image";

const UPLOAD_LIMIT = 10;
const UPLOAD_WINDOW_MS = 60 * 60 * 1000;
const SERIALIZABLE_RETRY_LIMIT = 3;

type UploadQuotaResult =
    { allowed: true; grantId: number } | { allowed: false; grantId: null };

function isTransactionConflict(error: unknown) {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        String(error.code) === "P2034"
    );
}

// 여러 Vercel 인스턴스에서도 같은 사용자 제한을 공유하도록 DB에서 처리함
export async function claimUploadTokenQuota(
    userId: number,
    purpose: UploadPurpose
): Promise<UploadQuotaResult> {
    for (let attempt = 0; attempt < SERIALIZABLE_RETRY_LIMIT; attempt += 1) {
        const windowStart = new Date(Date.now() - UPLOAD_WINDOW_MS);

        try {
            return await db.$transaction(
                async (tx) => {
                    await tx.uploadTokenGrant.deleteMany({
                        where: {
                            userId,
                            createdAt: { lt: windowStart },
                        },
                    });

                    const recentGrantCount = await tx.uploadTokenGrant.count({
                        where: {
                            userId,
                            purpose,
                            createdAt: { gte: windowStart },
                        },
                    });
                    if (recentGrantCount >= UPLOAD_LIMIT) {
                        return { allowed: false, grantId: null };
                    }

                    const grant = await tx.uploadTokenGrant.create({
                        data: { userId, purpose },
                        select: { id: true },
                    });
                    return { allowed: true, grantId: grant.id };
                },
                { isolationLevel: "Serializable" }
            );
        } catch (error) {
            if (
                !isTransactionConflict(error) ||
                attempt === SERIALIZABLE_RETRY_LIMIT - 1
            ) {
                throw error;
            }
        }
    }

    throw new Error("Upload quota transaction failed");
}

export async function releaseUploadTokenQuota(userId: number, grantId: number) {
    await db.uploadTokenGrant.deleteMany({
        where: { id: grantId, userId },
    });
}

export function getUploadLimitMessage() {
    return "이미지는 한 시간에 최대 10회까지 업로드할 수 있습니다.";
}
