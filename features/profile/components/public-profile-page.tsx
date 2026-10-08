"use client";

import { useSearchParams } from "next/navigation";

import {
    useLocalizedHref,
    useTranslations,
} from "@/components/i18n/locale-provider";
import type { ProfileUser } from "@/components/profile/dashboard/profile-types";
import ButtonLink from "@/components/ui/button-link";
import { StatusMessage } from "@/components/ui/status-message";
import { summarizeAchievements } from "@/features/achievements/achievement-definitions";
import ProfileAchievements from "@/features/achievements/components/profile-achievements";
import ProfileContribution from "@/features/contributions/components/profile-contribution";
import type { ProfileLevelRow } from "@/features/profile/schemas/profile-stats-schema";
import type {
    ProfileListPayload,
    ProfileMode,
    ProfileProgressPayload,
} from "@/features/profile/schemas/public-profile-schema";
import type { ProfileOverviewContext } from "@/features/profile/server/profile-overview-service";
import type { ProfilePinnedRecords } from "@/features/profile/server/profile-pinned-service";

import ProfileLevels from "./profile-levels";
import ProfilePinned from "./profile-pinned";
import ProfilePlaysList from "./profile-plays-list";
import ProfileProgress from "./profile-progress";

/**
 * 프로필 「개요」 탭(2026-09-25 D2) — 머리 · 탭은 레이아웃이 그린다.
 * 넓은 화면 2 : 1 — 주 열(성장 추이 · 베스트 · 최근 플레이) | 옆 열(고정 기록 · 레벨별 달성 요약 · 업적 · 기여).
 * 랭크 분포 · 판정 요약은 「통계」 탭으로 옮겼다(2026-09-26).
 * 태블릿은 주 열 다음 옆 열이 두 칸 격자, 폰은 베스트 → 최근 → 성장 추이 → 나머지(F2)
 */
export default function PublicProfilePage({
    user,
    isOwner,
    overview,
    initialBest,
    initialRecent,
    initialProgress,
    levels = [],
    pinned = null,
    recentOnlyMe = false,
    scoresHidden = false,
}: {
    user: ProfileUser;
    isOwner: boolean;
    /** 점수 비공개 플레이어를 남이 볼 때 — 점수 · 기록 없이 잠금 한 줄(2026-09-18 S3) */
    scoresHidden?: boolean;
    overview: ProfileOverviewContext | null;
    initialBest: ProfileListPayload | null;
    initialRecent: ProfileListPayload | null;
    initialProgress: ProfileProgressPayload | null;
    /** 레벨별 달성 요약(옆 열, 2026-09-26 R2) */
    levels?: readonly ProfileLevelRow[];
    /** 고정 기록(옆 열 맨 위, 2026-09-26 S2) */
    pinned?: ProfilePinnedRecords | null;
    /** 숨긴 최근 플레이를 본인이 볼 때(2026-09-26 P1) */
    recentOnlyMe?: boolean;
}) {
    const t = useTranslations();
    const href = useLocalizedHref();
    const params = useSearchParams();
    const achievements = user.achievements
        ? summarizeAchievements(user.achievements, Boolean(scoresHidden))
        : null;
    const side = (
        <>
            {achievements ? (
                <ProfileAchievements
                    userId={user.id}
                    summary={achievements}
                    isOwner={isOwner}
                />
            ) : null}
            {/* 기여는 점수 비공개와 별개로 보인다(2026-09-24) */}
            <ProfileContribution totals={user.contribution} isOwner={isOwner} />
        </>
    );
    if (scoresHidden || !overview)
        return (
            <div className="nl-profile-body nl-profile-body--single">
                <div className="nl-profile-empty">
                    <StatusMessage
                        title={t("profile.scoresPrivate")}
                        description={t("profile.scoresPrivateBody")}
                    />
                </div>
                {side}
            </div>
        );
    const mode: ProfileMode =
        params.get("mode") === "recital" ? "recital" : "basic";
    const hasRecords = Boolean(
        overview.hasRecords ||
        user.grade_basic ||
        user.grade_recital ||
        initialBest?.items.length ||
        initialRecent?.items.length
    );
    if (!hasRecords)
        return (
            <div className="nl-profile-body nl-profile-body--single">
                <div className="nl-profile-empty">
                    <StatusMessage title={t("profile.noSyncedRecords")} />
                    {isOwner ? (
                        <ButtonLink
                            href={href("/bookmarklet")}
                            variant="primary"
                        >
                            {t("sync.title")}
                        </ButtonLink>
                    ) : null}
                </div>
                {side}
            </div>
        );
    return (
        <div className="nl-profile-body">
            <div className="nl-profile-main">
                <ProfileProgress
                    userId={user.id}
                    mode={mode}
                    initialData={initialProgress}
                />
                <ProfilePlaysList
                    userId={user.id}
                    kind="best"
                    mode={mode}
                    initialData={initialBest}
                />
                {initialRecent?.status !== "hidden" ? (
                    <ProfilePlaysList
                        userId={user.id}
                        kind="recent"
                        mode="basic"
                        initialData={initialRecent}
                        onlyMe={recentOnlyMe}
                    />
                ) : null}
            </div>
            <div className="nl-profile-side">
                {pinned ? <ProfilePinned pinned={pinned} /> : null}
                <ProfileLevels
                    userId={user.id}
                    levels={levels}
                    variant="summary"
                />
                {side}
            </div>
        </div>
    );
}
