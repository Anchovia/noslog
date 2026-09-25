import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProfileActivity from "@/features/profile/components/profileActivity";
import ProfileActivityHidden from "@/features/profile/components/profileActivityHidden";
import {
    PROFILE_ACTIVITY_BATCH_SIZE,
    profileIdSchema,
} from "@/features/profile/schemas/publicProfileSchema";
import { getProfileActivity } from "@/features/profile/server/profileActivityService";
import { getPublicProfilePlays } from "@/features/profile/server/profilePlaysService";
import { localizePath } from "@/lib/i18n/routing";
import { getServerI18n } from "@/lib/i18n/server";
import { createPageMetadata } from "@/lib/metadata/site";
import getSession from "@/lib/session";
import { getCachedProfileData } from "../data";

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
            id.success ? `/profile/${id.data}/activity` : "/profile",
            locale
        ),
        noIndex: true,
    });
}

/**
 * 프로필 「활동」 탭(2026-09-26) — 활동 달력 · 요약 · 최근 플레이(한 판씩). 「플레이 활동 비공개」 면 탭이 없고 주소로 들어오면 잠금,
 * 점수 비공개 프로필을 남이 보면 달력 · 요약만(점수가 있는 목록 없음)
 */
export default async function ProfileActivityRoute({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: rawId } = await params;
    const parsedId = profileIdSchema.safeParse(rawId);
    if (!parsedId.success) notFound();
    const id = parsedId.data;
    const [profileData, session] = await Promise.all([
        getCachedProfileData(id),
        getSession(),
    ]);
    if (!profileData) notFound();
    if (profileData.user.hide_play_activity) return <ProfileActivityHidden />;
    const scoresHidden =
        session.id !== profileData.user.id && profileData.user.hide_play_scores;
    const [activity, initialRecent] = await Promise.all([
        getProfileActivity(id),
        scoresHidden
            ? null
            : getPublicProfilePlays(id, {
                  kind: "recent",
                  mode: "basic",
                  metric: "grade",
                  offset: 0,
                  limit: PROFILE_ACTIVITY_BATCH_SIZE,
              }),
    ]);
    return (
        <ProfileActivity
            userId={id}
            activity={activity}
            initialRecent={initialRecent}
        />
    );
}
