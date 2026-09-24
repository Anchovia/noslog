"use server";

import { updateTag } from "next/cache";
import { z } from "zod";

import { setAchievementPinned } from "@/features/achievements/server/achievementService";
import { getUserProfileTag } from "@/lib/cacheTags";
import { getServerI18n } from "@/lib/i18n/server";
import { logServerError } from "@/lib/observability/server";
import { getUser } from "@/lib/user";

const pinInputSchema = z.object({
    key: z.string().min(1).max(64),
    pinned: z.boolean(),
});

const PIN_MESSAGE_KEYS = {
    full: "achievement.pin.full",
    "not-earned": "achievement.pin.failed",
    unknown: "achievement.pin.failed",
} as const;

/** 프로필 머리에 걸기 · 빼기(2026-09-24 D1) — 본인 업적만. 머리가 바로 바뀌게 프로필 캐시를 비운다 */
export async function pinAchievement(key: string, pinned: boolean) {
    const { t } = await getServerI18n();
    const user = await getUser();
    if (!user) return { success: false, message: t("achievement.pin.failed") };
    const input = pinInputSchema.safeParse({ key, pinned });
    if (!input.success)
        return { success: false, message: t("achievement.pin.failed") };
    try {
        const result = await setAchievementPinned(
            user.id,
            input.data.key,
            input.data.pinned
        );
        if (result.status !== "ok")
            return {
                success: false,
                message: t(PIN_MESSAGE_KEYS[result.status]),
            };
        updateTag(getUserProfileTag(user.id));
        return { success: true, pins: result.pins };
    } catch (error) {
        logServerError(error, {
            event: "achievement.pin.failed",
            routeType: "action",
        });
        return { success: false, message: t("achievement.pin.failed") };
    }
}
