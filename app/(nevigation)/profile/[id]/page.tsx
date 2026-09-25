import PublicProfilePage from "@/features/profile/components/publicProfilePage";
import { getProfileOverviewContext } from "@/features/profile/server/profileOverviewService";
import { getPublicProfilePlays } from "@/features/profile/server/profilePlaysService";
import { getPublicProfileProgress } from "@/features/profile/server/profileProgressService";
import { profileIdSchema } from "@/features/profile/schemas/publicProfileSchema";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";
import getSession from "@/lib/session";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCachedProfileData } from "./data";
import { hideProfileScores } from "@/features/profile/server/scoreVisibility";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const [{ id: rawId }, { locale, t }] = await Promise.all([
        params,
        getServerI18n(),
    ]);
    const id = profileIdSchema.safeParse(rawId);
    const profile = id.success ? await getCachedProfileData(id.data) : null;

    return createPageMetadata({
        title: profile?.user.username
            ? t("profile.metaTitle", { name: profile.user.username })
            : t("profile.fallbackTitle"),
        description: t("profile.metaDescription"),
        path: localizePath(
            id.success ? `/profile/${id.data}` : "/profile",
            locale
        ),
        noIndex: true,
    });
}

export default async function ProfilePage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const { id: rawId } = await params;
    const parsedId = profileIdSchema.safeParse(rawId);
    if (!parsedId.success) notFound();
    const id = parsedId.data;

    const [profileData, session, query] = await Promise.all([
        getCachedProfileData(id),
        getSession(),
        searchParams,
    ]);

    if (!profileData) notFound();

    const isOwner = session.id === profileData.user.id;
    const mode = query.mode === "recital" ? "recital" : "basic";
    // 점수 비공개(2026-09-18 S3) — 본인이 아니면 점수 · 기록을 아예 불러오지 않고, 넘기는 값에서도 지운다
    if (!isOwner && profileData.user.hide_play_scores)
        return (
            <PublicProfilePage
                user={hideProfileScores(profileData.user)}
                isOwner={false}
                scoresHidden
                overview={null}
                initialBest={null}
                initialRecent={null}
                initialProgress={null}
            />
        );
    const [overview, initialBest, initialRecent, initialProgress] =
        await Promise.all([
            getProfileOverviewContext(id, isOwner),
            getPublicProfilePlays(id, {
                kind: "best",
                mode,
                metric: "grade",
                offset: 0,
            }),
            getPublicProfilePlays(id, {
                kind: "recent",
                mode: "basic",
                metric: "grade",
                offset: 0,
            }),
            getPublicProfileProgress(id, {
                mode,
                metric: "grade",
                range: "90",
            }),
        ]);

    return (
        <PublicProfilePage
            user={profileData.user}
            initialProgress={initialProgress}
            isOwner={isOwner}
            overview={overview}
            initialBest={initialBest}
            initialRecent={initialRecent}
        />
    );
}
