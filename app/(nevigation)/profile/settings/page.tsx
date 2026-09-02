import { redirect } from "next/navigation";

import ProfileSettingCard from "@/features/profile/components/profileSettingCard";
import AccountDeletionCard from "@/features/profile/components/accountDeletionCard";
import { getActiveArcades } from "@/lib/arcades";
import db from "@/lib/db";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";
import getSession from "@/lib/session";

export async function generateMetadata() {
    const { locale, t } = await getServerI18n();
    return createPageMetadata({
        title: t("settings.title"),
        path: localizePath("/profile/settings", locale),
        noIndex: true,
    });
}

export default async function ProfileSettingsPage({
    searchParams,
}: {
    searchParams: Promise<{ discordError?: string }>;
}) {
    const [{ locale, t }, session] = await Promise.all([
        getServerI18n(),
        getSession(),
    ]);
    if (!session.id) redirect(localizePath("/login", locale));
    const { discordError } = await searchParams;

    const [user, arcades] = await Promise.all([
        db.user.findUnique({
            where: { id: session.id },
            select: {
                id: true,
                avatar: true,
                username: true,
                country: true,
                locale: true,
                show_localized_music_title: true,
                discord_id: true,
                discord_name: true,
                discord_username: true,
                preferred_arcade_id: true,
                hide_nostalgia_name: true,
                hide_discord_name: true,
                hide_play_count: true,
            },
        }),
        getActiveArcades(),
    ]);
    if (!user) redirect(localizePath("/login", locale));

    return (
        <div className="flex flex-col gap-5 px-4 py-5">
            <header>
                <h1 className="text-title">{t("settings.title")}</h1>
                <p className="text-caption mt-1">{t("settings.description")}</p>
            </header>

            {discordError ? (
                <p className="border-danger/40 bg-danger/10 text-danger rounded-card border px-3 py-2 text-sm">
                    {t("settings.discordError")}
                </p>
            ) : null}

            <ProfileSettingCard user={user} arcades={arcades} />
            <AccountDeletionCard />
        </div>
    );
}
