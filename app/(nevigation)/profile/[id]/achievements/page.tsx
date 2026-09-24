import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { achievementRecordsForViewer } from "@/features/achievements/achievementDefinitions";
import AchievementsPage from "@/features/achievements/components/achievementsPage";
import {
    collectAchievementMetrics,
    getAchievementRecipientCounts,
} from "@/features/achievements/server/achievementService";
import { profileIdSchema } from "@/features/profile/schemas/publicProfileSchema";
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
        title: t("achievement.metaTitle", {
            name: profile?.user.username || t("common.unnamedUser"),
        }),
        description: t("achievement.metaDescription"),
        path: localizePath(
            id.success ? `/profile/${id.data}/achievements` : "/profile",
            locale
        ),
        noIndex: true,
    });
}

/** 업적 페이지(2026-09-24 C1) — 프로필 「업적」 구역 · 머리 숫자에서 들어온다 */
export default async function ProfileAchievementsRoute({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id: rawId } = await params;
    const parsedId = profileIdSchema.safeParse(rawId);
    if (!parsedId.success) notFound();
    const id = parsedId.data;
    const [{ locale, t }, profileData, session] = await Promise.all([
        getServerI18n(),
        getCachedProfileData(id),
        getSession(),
    ]);
    if (!profileData) notFound();
    const isOwner = session.id === profileData.user.id;
    // 점수 비공개(2026-09-18 S3) — 남에게는 점수에서 나온 업적(실력 · 수집)을 넘기지 않는다
    const scoresHidden = !isOwner && profileData.user.hide_play_scores;
    const records = achievementRecordsForViewer(
        profileData.user.achievements,
        scoresHidden
    );
    // 진행 값(K1)은 본인에게만 — 남의 기록 값은 불러오지 않는다
    const [metrics, recipients] = await Promise.all([
        isOwner ? collectAchievementMetrics(id) : null,
        getAchievementRecipientCounts(),
    ]);
    return (
        <AchievementsPage
            userName={profileData.user.username || t("common.unnamedUser")}
            profileHref={localizePath(`/profile/${id}`, locale)}
            records={records}
            metrics={metrics}
            recipients={recipients}
            scoresHidden={scoresHidden}
        />
    );
}
