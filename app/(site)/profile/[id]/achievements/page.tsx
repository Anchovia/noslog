import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { achievementRecordsForViewer } from "@/features/achievements/achievement-definitions";
import AchievementsPage from "@/features/achievements/components/achievements-page";
import {
    collectAchievementMetrics,
    getAchievementRecipientCounts,
} from "@/features/achievements/server/achievement-service";
import { profileIdSchema } from "@/features/profile/schemas/public-profile-schema";
import { createProfileMetadata } from "@/features/profile/server/profile-metadata";
import { getServerI18n } from "@/lib/i18n/server";
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
    return createProfileMetadata({
        id: id.success ? id.data : null,
        profile,
        tab: "achievements",
        locale,
        t,
    });
}

/** 프로필 「업적」 탭(2026-09-25 D2) — 머리 · 탭은 레이아웃이 그리고 여기는 내용만(2026-09-24 C1 업적 페이지 그대로) */
export default async function ProfileAchievementsRoute({
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
            embedded
            records={records}
            metrics={metrics}
            recipients={recipients}
            scoresHidden={scoresHidden}
        />
    );
}
