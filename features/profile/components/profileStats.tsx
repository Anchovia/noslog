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
    ProfileRankDistribution,
} from "./profileRecordOverview";

/**
 * 프로필 「통계」 탭(2026-09-26) — 넓은 화면: 성장 추이(2) | 레벨별 달성(1, 두 줄), 성장 추이 아래 판정 | 랭크.
 * 태블릿: 레벨별 달성 → 성장 추이 → 판정 | 랭크, 폰: 한 줄로 같은 순서. 노트 종류별 성공률은 뺐다(사용자). 모드는 성장 추이만 바꾼다
 */
export default function ProfileStats({
    user,
    stats,
    initialProgress,
    privatePlayCount = null,
}: {
    user: ProfileUser;
    stats: ProfileStatsData;
    initialProgress: ProfileProgressPayload | null;
    /** 본인에게만 — 숨긴 플레이 횟수(2026-09-26 P1) */
    privatePlayCount?: number | null;
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
            <ProfileRankDistribution
                user={user}
                privatePlayCount={privatePlayCount}
            />
        </div>
    );
}
