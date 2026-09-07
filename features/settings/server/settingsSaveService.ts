import "server-only";
import { updateTag } from "next/cache";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { getServerI18n } from "@/lib/i18n/server";
import { CACHE_TAGS, getUserProfileTag } from "@/lib/cacheTags";
import { deleteBlobIfOwned, isValidImageBlob } from "@/lib/blob";
import { logServerError } from "@/lib/observability/server";
import type { ActionResult } from "@/lib/actions/result";
import {
    createSettingsProfileSchema,
    settingsPrivacySchema,
    settingsPrivacyInput,
    settingsProfileInput,
} from "@/features/settings/schemas/settingsSchema";
import type {
    SettingsProfileValues,
    SettingsPrivacyValues,
} from "@/features/settings/schemas/settingsSchema";

function refreshPublicIdentity(userId: number) {
    updateTag(getUserProfileTag(userId));
    updateTag(CACHE_TAGS.userRankings);
    updateTag(CACHE_TAGS.arcades);
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
        return {
            success: false,
            message: t("settings.checkInput"),
            fieldErrors: parsed.error.flatten().fieldErrors,
        };
    const values = parsed.data;
    const current = await db.user.findUnique({
        where: { id: session.id },
        select: { avatar: true, preferred_arcade_id: true },
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
    if (preferredId !== null && preferredId !== current.preferred_arcade_id) {
        const arcade = await db.arcade.findFirst({
            where: { id: preferredId, is_active: true },
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
    try {
        await db.user.update({
            where: { id: session.id, avatar: current.avatar },
            data: {
                username: values.username,
                country: values.country,
                preferred_arcade_id: preferredId,
                ...(avatarChanged
                    ? {
                          avatar: values.avatar || null,
                          avatar_user_managed: true,
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
    refreshPublicIdentity(session.id);
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
    try {
        await db.user.update({
            where: { id: session.id },
            data: {
                hide_nostalgia_name: !values.showNostalgiaName,
                hide_discord_name: !values.showDiscordIdentity,
                hide_preferred_arcade: !values.showPreferredArcade,
                hide_play_count: !values.showPlayCount,
                hide_play_activity: !values.showPlayActivity,
            },
        });
    } catch (error) {
        logServerError(error, {
            event: "settings.privacy.save.failed",
            routePath: "/settings",
            routeType: "action",
        });
        return { success: false, message: t("settings.saveError") };
    }
    refreshPublicIdentity(session.id);
    return { success: true, message: t("settings.saved"), values };
}
