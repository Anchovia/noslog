import "server-only";

import db from "@/lib/db";

// 동기화 시도 기록(DataSync) 읽기 · 쓰기 — 동기화 API 에서 옮김(2026-10-16 D8)
const SYNC_COOLDOWN_MS = 30 * 1000;
const SYNC_PROCESSING_TIMEOUT_MS = 5 * 60 * 1000;

export type SyncAttemptResult =
    | { allowed: true; syncId: number; previousCompleted: boolean }
    | { allowed: false; reason: "processing" | "cooldown"; retryAfter: number };

/** 연동 토큰 확인 · 권한 · 동기화 전 Grd(바뀌었는지로 공용 캐시를 비운다, 2026-10-16 P4 — player_stats 에서) */
export function getSyncUser(userId: number) {
    return db.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            syncTokenVersion: true,
            role: true,
            stats: { select: { gradeBasic: true, gradeRecital: true } },
        },
    });
}

// 사용자별 DB 잠금으로 여러 서버 인스턴스에서도 동기화 시작을 직렬화함
export async function createSyncAttempt(
    userId: number,
    syncScope: "full" | "recent",
    receivedPlays: number
): Promise<SyncAttemptResult> {
    return db.$transaction(async (tx) => {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(73051, ${userId}::integer)`;

        const now = new Date();
        const latestSync = await tx.dataSync.findFirst({
            where: { userId: userId },
            select: { id: true, status: true, startedAt: true },
            orderBy: { startedAt: "desc" },
        });

        if (latestSync?.status === "processing") {
            const processingAge =
                now.getTime() - latestSync.startedAt.getTime();
            if (processingAge < SYNC_PROCESSING_TIMEOUT_MS) {
                return {
                    allowed: false,
                    reason: "processing",
                    retryAfter: Math.max(
                        1,
                        Math.ceil(
                            (SYNC_PROCESSING_TIMEOUT_MS - processingAge) / 1000
                        )
                    ),
                };
            }

            await tx.dataSync.update({
                where: { id: latestSync.id },
                data: {
                    status: "failed",
                    errorMessage: "동기화 처리 시간이 초과되었습니다.",
                    completedAt: now,
                },
            });
        } else if (latestSync) {
            const elapsed = now.getTime() - latestSync.startedAt.getTime();
            if (elapsed < SYNC_COOLDOWN_MS) {
                return {
                    allowed: false,
                    reason: "cooldown",
                    retryAfter: Math.max(
                        1,
                        Math.ceil((SYNC_COOLDOWN_MS - elapsed) / 1000)
                    ),
                };
            }
        }

        const sync = await tx.dataSync.create({
            data: {
                userId: userId,
                syncScope: syncScope,
                receivedPlays: receivedPlays,
            },
            select: { id: true },
        });
        return {
            allowed: true,
            syncId: sync.id,
            previousCompleted: latestSync?.status === "completed",
        };
    });
}

/** 처리를 마친 시도 — 안내(제외한 채보 등)가 있으면 errorMessage 에 남긴다 */
export async function completeSyncAttempt(
    syncId: number,
    result: {
        insertedPlays: number;
        changedRecords: number;
        notice: string | null;
    }
) {
    await db.dataSync.update({
        where: { id: syncId },
        data: {
            status: "completed",
            insertedPlays: result.insertedPlays,
            changedRecords: result.changedRecords,
            errorMessage: result.notice,
            completedAt: new Date(),
        },
    });
}

/** 처리 중 실패한 시도 */
export async function failSyncAttempt(syncId: number, message: string) {
    await db.dataSync.update({
        where: { id: syncId },
        data: {
            status: "failed",
            errorMessage: message,
            completedAt: new Date(),
        },
    });
}
