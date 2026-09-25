"use client";

import { useSearchParams } from "next/navigation";

import { useTranslations } from "@/components/i18n/localeProvider";
import { StatusMessage } from "@/components/ui/statusMessage";
import type { ProfileUser } from "@/components/profile/dashboard/profileTypes";
import type { ProfileStats as ProfileStatsData } from "@/features/profile/schemas/profileStatsSchema";
import type { ProfileProgressPayload } from "@/features/profile/schemas/publicProfileSchema";
import ProfileLevels from "./profileLevels";
import ProfileProgress from "./profileProgress";
import {
    ProfileJudgementSummary,
    ProfileNoteRates,
    ProfileRankDistribution,
} from "./profileRecordOverview";

/**
 * 프로필 「통계」 탭(2026-09-26) — 넓은 화면: 성장 추이(2) | 레벨별 달성(1), 아래 판정 · 랭크 · 노트 세 칸.
 * 태블릿: 레벨별 달성 → 성장 추이 → 판정 | 랭크 → 노트, 폰: 한 줄로 같은 순서. 모드는 성장 추이만 바꾼다
 */
export default function ProfileStats({
    user,
    stats,
    initialProgress,
}: {
    user: ProfileUser;
    stats: ProfileStatsData;
    initialProgress: ProfileProgressPayload | null;
}) {
    const t = useTranslations();
    const params = useSearchParams();
    const mode = params.get("mode") === "recital" ? "recital" : "basic";
    if (!stats.played && !user.grade_basic && !user.grade_recital)
        return (
            <div className="nl-profile-empty">
                <StatusMessage title={t("profile.noSyncedRecords")} />
            </div>
        );
    return (
        <div className="nl-profile-stats">
            <ProfileProgress
                userId={user.id}
                mode={mode}
                initialData={initialProgress}
            />
            <ProfileLevels
                userId={user.id}
                levels={stats.levels}
                variant="full"
            />
            <ProfileJudgementSummary judgement={stats.judgement} />
            <ProfileRankDistribution user={user} />
            <ProfileNoteRates notes={stats.notes} />
        </div>
    );
}
