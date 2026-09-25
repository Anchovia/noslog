import "server-only";

import db from "@/lib/db";
import type { ProfileUser } from "@/components/profile/dashboard/profileTypes";
import { achievementRecordsForViewer } from "@/features/achievements/achievementDefinitions";

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

/** 점수 비공개(2026-09-18 S3) — 본인이 아니면 점수 · 순위 · 점수에서 나온 업적을 넘기지 않는다 */
export function hideProfileScores(user: ProfileUser): ProfileUser {
    return {
        ...user,
        grade_basic: null,
        grade_recital: null,
        rank_basic: null,
        rank_basic_country: null,
        rank_recital: null,
        rank_recital_country: null,
        score_p: null,
        score_f: null,
        score_s: null,
        score_a2: null,
        score_a: null,
        score_b2: null,
        score_b: null,
        score_c: null,
        score_d: null,
        achievements: user.achievements
            ? achievementRecordsForViewer(user.achievements, true)
            : undefined,
    };
}
