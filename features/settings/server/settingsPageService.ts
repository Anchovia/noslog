import "server-only";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { getActiveArcades } from "@/lib/arcades";
import { profileCountrySchema } from "@/features/profile/schemas/profileSettingsSchema";
import { getAchievementRecords } from "@/features/achievements/server/achievementService";
import { getPinnableRecords } from "@/features/profile/server/profilePinnedService";

export async function getSettingsPageData() {
    const session = await getSession();
    if (!session.id) return { user: null, arcades: [] };
    const [user, arcades, achievements, pinned] = await Promise.all([
        db.user.findUnique({
            where: { id: session.id },
            select: {
                id: true,
                username: true,
                avatar: true,
                country: true,
                nostalgia_name: true,
                discord_name: true,
                discord_username: true,
                preferred_arcade_id: true,
                preferredArcade: {
                    select: {
                        id: true,
                        name: true,
                        region: true,
                        is_active: true,
                    },
                },
                hide_nostalgia_name: true,
                hide_discord_name: true,
                hide_preferred_arcade: true,
                hide_play_count: true,
                hide_play_activity: true,
                hide_play_scores: true,
            },
        }),
        getActiveArcades(),
        // 프로필 업적 칸(2026-09-25 D1) — 얻은 단계 · 건 업적 · 자동 진열 순서용 달성 인원
        getAchievementRecords(session.id),
        // 고정 기록 칸(2026-09-26 S2) — 고를 수 있는 기록(점수가 있는 채보) · 지금 고른 값
        getPinnableRecords(session.id),
    ]);
    if (!user) return { user: null, arcades: [] };
    return {
        user: {
            id: user.id,
            profile: {
                username: user.username ?? "",
                avatar: user.avatar ?? "",
                country: profileCountrySchema
                    .catch("global")
                    .parse(user.country),
                preferredArcadeId: user.preferred_arcade_id?.toString() ?? "",
                achievementShowcase: achievements.pins.join(","),
                pinnedRecords: pinned.pins.length
                    ? JSON.stringify(pinned.pins)
                    : "",
            },
            achievements,
            pinnableRecords: pinned.records,
            nostalgiaName: user.nostalgia_name,
            preferredArcade: user.preferredArcade,
            discordName:
                user.discord_name ?? user.discord_username ?? "Discord",
            privacy: {
                showNostalgiaName: !user.hide_nostalgia_name,
                showDiscordIdentity: !user.hide_discord_name,
                showPreferredArcade: !user.hide_preferred_arcade,
                showPlayCount: !user.hide_play_count,
                showPlayActivity: !user.hide_play_activity,
                showPlayScores: !user.hide_play_scores,
            },
        },
        arcades,
    };
}

export type SettingsPageData = Awaited<ReturnType<typeof getSettingsPageData>>;
export type SettingsUser = NonNullable<SettingsPageData["user"]>;
