import ProfileDashboard from "@/components/profile/profile";
import {
    getLocalizedMusicTitle,
    getMusicTitleDisplayPreference,
} from "@/lib/i18n/musicTitle";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";
import getSession from "@/lib/session";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCachedProfileData, getProfileOwnerAnalytics } from "./data";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const [{ id: rawId }, { locale, t }] = await Promise.all([
        params,
        getServerI18n(),
    ]);
    const id = Number(rawId);
    const profile = Number.isInteger(id)
        ? await getCachedProfileData(id)
        : null;

    return createPageMetadata({
        title: profile?.user.username
            ? t("profile.metaTitle", { name: profile.user.username })
            : t("profile.fallbackTitle"),
        description: t("profile.metaDescription"),
        path: localizePath(
            Number.isInteger(id) ? `/profile/${id}` : "/profile",
            locale
        ),
        noIndex: true,
    });
}

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: rawId } = await params;
    const id = Number(rawId);

    if (!Number.isInteger(id) || id < 1) notFound();

    const [{ locale }, profileData, session] = await Promise.all([
        getServerI18n(),
        getCachedProfileData(id),
        getSession(),
    ]);

    if (!profileData) notFound();

    const isOwner = session.id === profileData.user.id;
    const [ownerAnalytics, showLocalizedTitle] = await Promise.all([
        isOwner ? getProfileOwnerAnalytics(profileData.user.id) : null,
        getMusicTitleDisplayPreference(session.id),
    ]);
    const localizePlay = <
        T extends {
            music: {
                title: string;
                title_kana: string;
                translations: {
                    locale: string;
                    title: string;
                    status: string;
                }[];
            };
        },
    >(
        play: T
    ) => ({
        ...play,
        music: {
            ...play.music,
            localizedTitle: getLocalizedMusicTitle(
                play.music,
                locale,
                showLocalizedTitle
            ),
        },
    });

    return (
        <ProfileDashboard
            {...profileData}
            basicBestPlays={profileData.basicBestPlays.map(localizePlay)}
            recitalBestPlays={profileData.recitalBestPlays.map(localizePlay)}
            recentPlays={profileData.recentPlays.map(localizePlay)}
            isOwner={isOwner}
            ownerAnalytics={ownerAnalytics}
        />
    );
}
