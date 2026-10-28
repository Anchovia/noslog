import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProfileRecords from "@/features/profile/components/profile-records";
import PublicProfilePage from "@/features/profile/components/public-profile-page";
import { profileIdSchema } from "@/features/profile/schemas/public-profile-schema";
import { createProfileMetadata } from "@/features/profile/server/profile-metadata";
import {
    countPlayedRecords,
    countRecordsWithGrade,
} from "@/features/profile/server/profile-records-service";
import { getPublicProfileRecords } from "@/features/profile/server/profile-records-service";
import { hideProfileScores } from "@/features/profile/server/score-visibility";
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
        tab: "records",
        locale,
        t,
    });
}

/** 프로필 「기록」 탭 — 베스트 50 · 모든 기록 표와 정렬(검색 · 필터는 두지 않는다) */
export default async function ProfileRecordsRoute({
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
    const field = mode === "basic" ? "gradeBasic" : "gradeRecital";
    const [best, all, initialData] = await Promise.all([
        countRecordsWithGrade(id, field),
        countPlayedRecords(id),
        getPublicProfileRecords(id, {
            view: "best",
            mode,
            sort: "value",
            offset: 0,
        }),
    ]);
    return (
        <ProfileRecords
            userId={id}
            counts={{ best: Math.min(best, 50), all }}
            initialData={initialData}
        />
    );
}
