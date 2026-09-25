import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProfileRecords from "@/features/profile/components/profileRecords";
import PublicProfilePage from "@/features/profile/components/publicProfilePage";
import { profileIdSchema } from "@/features/profile/schemas/publicProfileSchema";
import { getPublicProfileRecords } from "@/features/profile/server/profileRecordsService";
import { hideProfileScores } from "@/features/profile/server/scoreVisibility";
import db from "@/lib/db";
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
            id.success ? `/profile/${id.data}/records` : "/profile",
            locale
        ),
        noIndex: true,
    });
}

/** 프로필 「기록」 탭(2026-09-25 2단계) — 베스트 50 · 모든 기록 표, 검색 · 필터 · 정렬 */
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
    const field = mode === "basic" ? "grade_basic" : "grade_recital";
    const [best, all, initialData] = await Promise.all([
        db.playData.count({ where: { user_id: id, [field]: { gt: 0 } } }),
        db.playData.count({ where: { user_id: id, score: { gt: 0 } } }),
        getPublicProfileRecords(id, {
            view: "best",
            mode,
            q: "",
            difficulty: [],
            rank: [],
            lamp: [],
            sort: "value",
            offset: 0,
            size: 20,
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
