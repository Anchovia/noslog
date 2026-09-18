import "server-only";

import db from "@/lib/db";

// 점수 비공개(2026-09-18 S3) — 본인이 아니면 그 사람의 점수 · 기록 API 가 값을 돌려주지 않는다
export async function scoresHiddenFrom(
    targetUserId: number,
    viewerId: number | undefined
) {
    if (viewerId === targetUserId) return false;
    const user = await db.user.findUnique({
        where: { id: targetUserId },
        select: { hide_play_scores: true },
    });
    return Boolean(user?.hide_play_scores);
}
