import "server-only";

import db from "@/lib/db";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/routing";

const HOUR_MS = 60 * 60 * 1000;
const IMAGE_UPLOAD_QUOTA = { limit: 10, windowMs: HOUR_MS };

// 목적마다 한도 · 창 — 이미지 업로드 토큰 말고도 비용이 드는 요청(이용자 글 번역)을 같은 표로 센다
const QUOTAS = {
    "profile-avatar": IMAGE_UPLOAD_QUOTA,
    "exam-proof": IMAGE_UPLOAD_QUOTA,
    "feedback-image": IMAGE_UPLOAD_QUOTA,
    "arcade-photo": IMAGE_UPLOAD_QUOTA,
    "music-jacket": IMAGE_UPLOAD_QUOTA,
    "event-banner": IMAGE_UPLOAD_QUOTA,
    "event-image": IMAGE_UPLOAD_QUOTA,
    "announcement-image": IMAGE_UPLOAD_QUOTA,
    "community-translation": { limit: 20, windowMs: HOUR_MS },
} satisfies Record<string, { limit: number; windowMs: number }>;

export type UploadPurpose = keyof typeof QUOTAS;

// 지난 기록 정리는 가장 긴 창보다 오래된 행만 지운다 — 다른 목적의 창 안 기록을 지우지 않게
const LONGEST_WINDOW_MS = Math.max(
    ...Object.values(QUOTAS).map((quota) => quota.windowMs)
);
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
    const { limit, windowMs } = QUOTAS[purpose];
    for (let attempt = 0; attempt < SERIALIZABLE_RETRY_LIMIT; attempt += 1) {
        const now = Date.now();
        const windowStart = new Date(now - windowMs);

        try {
            return await db.$transaction(
                async (tx) => {
                    await tx.uploadTokenGrant.deleteMany({
                        where: {
                            userId,
                            createdAt: {
                                lt: new Date(now - LONGEST_WINDOW_MS),
                            },
                        },
                    });

                    const recentGrantCount = await tx.uploadTokenGrant.count({
                        where: {
                            userId,
                            purpose,
                            createdAt: { gte: windowStart },
                        },
                    });
                    if (recentGrantCount >= limit) {
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

/** 업로드 한도 안내 — 공개 화면에서 쓰는 곳은 요청 언어를 넘긴다(관리자 화면은 한국어 기본) */
export function getUploadLimitMessage(locale: Locale = DEFAULT_LOCALE) {
    return createTranslator(getMessages(locale))("upload.limitReached", {
        count: IMAGE_UPLOAD_QUOTA.limit,
    });
}
