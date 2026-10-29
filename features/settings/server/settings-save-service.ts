import "server-only";

import { updateTag } from "next/cache";

import { setAchievementShowcase } from "@/features/achievements/server/achievement-service";
import { enqueueRecordsInvalidationForUser } from "@/features/partner/server/oauth-service";
import { pinnedRecordsValueSchema } from "@/features/profile/schemas/pinned-record-schema";
import { setPinnedRecords } from "@/features/profile/server/profile-pinned-service";
import type {
    SettingsPrivacyValues,
    SettingsProfileValues,
} from "@/features/settings/schemas/settings-schema";
import {
    createSettingsProfileSchema,
    settingsPrivacyInput,
    settingsPrivacySchema,
    settingsProfileInput,
} from "@/features/settings/schemas/settings-schema";
import type { ActionResult } from "@/lib/actions/result";
import { actionValidationFailure } from "@/lib/actions/validation";
import { deleteBlobIfOwned, isValidImageBlob } from "@/lib/blob";
import { CACHE_TAGS, getUserProfileTag } from "@/lib/cache-tags";
import db from "@/lib/db";
import { getServerI18n } from "@/lib/i18n/server";
import { logServerError } from "@/lib/observability/server";
import getSession from "@/lib/session";

/**
 * 바뀐 값이 들어 있는 캐시만 비운다(2026-10-15 S4) — 본인 프로필은 늘.
 * ranking: 랭킹 · 악곡 랭킹 · 점수 분포 줄에 나오는 닉네임 · 아바타 · 국가 · 점수 비공개(2026-09-18)
 * positions: 다른 사람 프로필의 순위 숫자 — 점수 비공개 · 국가가 바뀌면 남의 (국가) 순위가 한 칸 움직인다(2026-10-16 D8 · B6)
 * arcade: 선호 오락실(오락실 공개 정보)
 */
function refreshPublicIdentity(
    userId: number,
    changed: { ranking: boolean; positions: boolean; arcade: boolean }
) {
    updateTag(getUserProfileTag(userId));
    if (changed.ranking) {
        updateTag(CACHE_TAGS.userRankings);
        updateTag(CACHE_TAGS.chartRankings);
    }
    if (changed.positions) updateTag(CACHE_TAGS.userProfiles);
    if (changed.arcade) updateTag(CACHE_TAGS.arcades);
}

export async function saveSettingsProfile(
    formData: FormData
): Promise<
    ActionResult<{ values: SettingsProfileValues }, keyof SettingsProfileValues>
> {
    const { t } = await getServerI18n();
    const session = await getSession();
    if (!session.id || !session.profileCompleted)
        return { success: false, message: t("settings.loginRequired") };
    const parsed = createSettingsProfileSchema(t).safeParse(
        settingsProfileInput(formData)
    );
    if (!parsed.success)
        return actionValidationFailure(parsed.error, {
            message: t("settings.checkInput"),
            alwaysIncludeFieldErrors: true,
        });
    const values = parsed.data;
    const current = await db.user.findUnique({
        where: { id: session.id },
        select: {
            username: true,
            country: true,
            avatar: true,
            preferredArcadeId: true,
        },
    });
    if (!current)
        return { success: false, message: t("settings.userNotFound") };
    const avatarChanged = values.avatar !== (current.avatar ?? "");
    if (
        avatarChanged &&
        values.avatar &&
        !(await isValidImageBlob(
            values.avatar,
            `avatars/${session.id}/profile`
        ))
    ) {
        return {
            success: false,
            message: t("settings.invalidAvatarUrl"),
            fieldErrors: { avatar: [t("settings.invalidAvatarUrl")] },
        };
    }
    const preferredId = values.preferredArcadeId
        ? Number(values.preferredArcadeId)
        : null;
    if (preferredId !== null && preferredId !== current.preferredArcadeId) {
        const arcade = await db.arcade.findFirst({
            where: { id: preferredId, isActive: true },
            select: { id: true },
        });
        if (!arcade)
            return {
                success: false,
                message: t("settings.arcadeNotFound"),
                fieldErrors: {
                    preferredArcadeId: [t("settings.arcadeNotFound")],
                },
            };
    }
    // 업적 진열(2026-09-25 D1) — 얻은 업적 · 3개까지만. 잘못된 값이면 프로필도 저장하지 않는다
    const showcaseKeys =
        values.achievementShowcase === undefined
            ? null
            : values.achievementShowcase.split(",").filter(Boolean);
    try {
        if (showcaseKeys) {
            const showcase = await setAchievementShowcase(
                session.id,
                showcaseKeys
            );
            if (showcase.status !== "ok")
                return {
                    success: false,
                    message: t("achievement.pin.failed"),
                    fieldErrors: {
                        achievementShowcase: [t("achievement.pin.failed")],
                    },
                };
        }
        // 고정 기록(2026-09-26 S2) — 점수가 있는 채보만. 잘못된 값이면 프로필도 저장하지 않는다
        if (values.pinnedRecords !== undefined) {
            const pinned = await setPinnedRecords(
                session.id,
                pinnedRecordsValueSchema.parse(values.pinnedRecords)
            );
            if (pinned.status !== "ok")
                return {
                    success: false,
                    message: t("profile.pinned.failed"),
                    fieldErrors: {
                        pinnedRecords: [t("profile.pinned.failed")],
                    },
                };
        }
        await db.user.update({
            where: { id: session.id, avatar: current.avatar },
            data: {
                username: values.username,
                country: values.country,
                preferredArcadeId: preferredId,
                ...(avatarChanged
                    ? {
                          avatar: values.avatar || null,
                          avatarUserManaged: true,
                      }
                    : {}),
            },
        });
    } catch (error) {
        // Keep a staged upload after failure so it can be retried. Deleting it
        // here could also remove the winning upload from a concurrent save.
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return {
                success: false,
                message: t("settings.nicknameTaken"),
                fieldErrors: { username: [t("settings.nicknameTaken")] },
            };
        }
        logServerError(error, {
            event: "settings.profile.save.failed",
            routePath: "/settings",
            routeType: "action",
        });
        return { success: false, message: t("settings.saveError") };
    }
    refreshPublicIdentity(session.id, {
        ranking:
            avatarChanged ||
            values.username !== current.username ||
            values.country !== current.country,
        positions: values.country !== current.country,
        arcade: preferredId !== current.preferredArcadeId,
    });
    if (avatarChanged) await deleteBlobIfOwned(current.avatar);
    return { success: true, message: t("settings.saved"), values };
}

export async function saveSettingsPrivacy(
    formData: FormData
): Promise<ActionResult<{ values: SettingsPrivacyValues }>> {
    const { t } = await getServerI18n();
    const session = await getSession();
    if (!session.id || !session.profileCompleted)
        return { success: false, message: t("settings.loginRequired") };
    const parsed = settingsPrivacySchema.safeParse(
        settingsPrivacyInput(formData)
    );
    if (!parsed.success)
        return { success: false, message: t("settings.checkInput") };
    const values = parsed.data;
    const userId = session.id;
    let scoresVisibilityChanged: boolean;
    try {
        scoresVisibilityChanged = await db.$transaction(async (tx) => {
            const current = await tx.user.findUnique({
                where: { id: userId },
                select: { hidePlayScores: true, hidePlayActivity: true },
            });
            await tx.user.update({
                where: { id: userId },
                data: {
                    hideNostalgiaName: !values.showNostalgiaName,
                    hideDiscordName: !values.showDiscordIdentity,
                    hidePreferredArcade: !values.showPreferredArcade,
                    hidePlayCount: !values.showPlayCount,
                    hidePlayActivity: !values.showPlayActivity,
                    hidePlayScores: !values.showPlayScores,
                },
            });
            // 파트너가 이미 받아 간 기록도 거둬야 하니 공개 → 비공개일 때 무효화를 알린다
            if (
                (current?.hidePlayScores === false && !values.showPlayScores) ||
                (current?.hidePlayActivity === false &&
                    !values.showPlayActivity)
            ) {
                await enqueueRecordsInvalidationForUser(tx, userId);
            }
            return current?.hidePlayScores !== !values.showPlayScores;
        });
    } catch (error) {
        logServerError(error, {
            event: "settings.privacy.save.failed",
            routePath: "/settings",
            routeType: "action",
        });
        return { success: false, message: t("settings.privacySaveError") };
    }
    // 랭킹 줄에 영향을 주는 건 점수 비공개뿐 — 나머지 스위치는 본인 프로필만
    refreshPublicIdentity(userId, {
        ranking: scoresVisibilityChanged,
        positions: scoresVisibilityChanged,
        arcade: false,
    });
    return { success: true, message: t("settings.saved"), values };
}
