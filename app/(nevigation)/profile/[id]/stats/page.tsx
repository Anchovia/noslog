import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProfileStats from "@/features/profile/components/profileStats";
import PublicProfilePage from "@/features/profile/components/publicProfilePage";
import { profileIdSchema } from "@/features/profile/schemas/publicProfileSchema";
import { getPublicProfileProgress } from "@/features/profile/server/profileProgressService";
import { getProfileStats } from "@/features/profile/server/profileStatsService";
import { getOwnerPrivateFields } from "@/features/profile/server/ownerPrivateService";
import { hideProfileScores } from "@/features/profile/server/scoreVisibility";
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
            id.success ? `/profile/${id.data}/stats` : "/profile",
            locale
        ),
        noIndex: true,
    });
}

/** 프로필 「통계」 탭(2026-09-26) — 성장 추이 · 레벨별 달성 전체 · 판정 · 랭크 분포 · 노트 종류별 성공률 */
export default async function ProfileStatsRoute({
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
    // 점수 비공개(2026-09-18 S3) — 탭은 숨기지만 주소로 들어오면 개요와 같은 잠금
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
    const mode = query.mode === "recital" ? "recital" : "basic";
    const [stats, initialProgress, ownerPrivate] = await Promise.all([
        getProfileStats(id),
        getPublicProfileProgress(id, { mode, metric: "grade", range: "90" }),
        // 본인에게는 숨긴 플레이 횟수도 자물쇠와 함께(2026-09-26 P1)
        isOwner ? getOwnerPrivateFields(id) : null,
    ]);
    return (
        <ProfileStats
            user={profileData.user}
            stats={stats}
            initialProgress={initialProgress}
            privatePlayCount={ownerPrivate?.playCount ?? null}
        />
    );
}
