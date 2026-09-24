"use server";

import { updateTag } from "next/cache";
import { z } from "zod";

import { rejudgeAchievementsBatch } from "@/features/achievements/server/achievementService";
import { requireAdmin } from "@/lib/admin";
import { CACHE_TAGS, getUserProfileTag } from "@/lib/cacheTags";
import { logServerError } from "@/lib/observability/server";

const cursorSchema = z.number().int().min(0);

/**
 * 업적 다시 판정 한 묶음(2026-09-25 B1) — 관리자만. 화면이 nextCursor 가 null 이 될 때까지 이어 부른다.
 * 새 단계를 얻은 사람의 프로필 캐시를 비운다.
 */
export async function rejudgeAchievements(cursor: number) {
    await requireAdmin();
    const parsed = cursorSchema.safeParse(cursor);
    if (!parsed.success)
        return { success: false as const, message: "잘못된 요청입니다." };
    try {
        const batch = await rejudgeAchievementsBatch(parsed.data);
        for (const userId of batch.awardedUserIds)
            updateTag(getUserProfileTag(userId));
        if (batch.awarded) updateTag(CACHE_TAGS.userProfiles);
        return {
            success: true as const,
            judged: batch.judged,
            awarded: batch.awarded,
            nextCursor: batch.nextCursor,
        };
    } catch (error) {
        logServerError(error, {
            event: "admin.achievements.rejudge.failed",
            routePath: "/admin/syncs",
            routeType: "action",
        });
        return {
            success: false as const,
            message: "판정 중 오류가 났습니다. 잠시 후 다시 시도해 주세요.",
        };
    }
}
