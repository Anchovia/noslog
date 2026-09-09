import "server-only";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { getActiveArcades } from "@/lib/arcades";
import { profileCountrySchema } from "@/features/profile/schemas/profileSettingsSchema";

export async function getSettingsPageData() {
    const session = await getSession();
    if (!session.id) return { user: null, arcades: [] };
    const [user, arcades] = await Promise.all([
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
            },
        }),
        getActiveArcades(),
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
            },
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
            },
        },
        arcades,
    };
}

export type SettingsPageData = Awaited<ReturnType<typeof getSettingsPageData>>;
export type SettingsUser = NonNullable<SettingsPageData["user"]>;
