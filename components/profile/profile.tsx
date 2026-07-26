"use client";

import { useState } from "react";

import { logout } from "@/app/(nevigation)/profile/[id]/actions";
import ProfileBestPlays from "@/components/profile/dashboard/profileBestPlays";
import ProfileGradeTrend from "@/components/profile/dashboard/profileGradeTrend";
import ProfileHeader from "@/components/profile/dashboard/profileHeader";
import ProfileJudgementSummary from "@/components/profile/dashboard/profileJudgementSummary";
import ProfileModeTabs from "@/components/profile/dashboard/profileModeTabs";
import ProfileRankDistribution from "@/components/profile/dashboard/profileRankDistribution";
import ProfileRecentPlays from "@/components/profile/dashboard/profileRecentPlays";
import ProfileSummary from "@/components/profile/dashboard/profileSummary";
import {
    type ProfileDashboardProps,
    type ProfileMode,
} from "@/components/profile/dashboard/profileTypes";
import { getProfileRankRows } from "@/components/profile/dashboard/profileUtils";

export type {
    BestPlayItem,
    ProfileDashboardProps,
    ProfileUser,
    RecentPlayItem,
} from "@/components/profile/dashboard/profileTypes";

// 프로필 모드와 목록 확장 상태를 하위 대시보드 영역에 연결함
export default function ProfileDashboard({
    user,
    gradeHistory,
    basicBestPlays,
    recitalBestPlays,
    recentPlays,
    isOwner,
    ownerAnalytics,
}: ProfileDashboardProps) {
    const [mode, setMode] = useState<ProfileMode>("basic");
    const [showAllRanks, setShowAllRanks] = useState(false);
    const [showAllBest, setShowAllBest] = useState(false);
    const [showAllRecent, setShowAllRecent] = useState(false);

    const isBasic = mode === "basic";
    const grade = isBasic ? user.grade_basic : user.grade_recital;
    const globalRank = isBasic ? user.rank_basic : user.rank_recital;
    const countryRank = isBasic
        ? user.rank_basic_country
        : user.rank_recital_country;
    const bestPlays = isBasic ? basicBestPlays : recitalBestPlays;
    const rankRows = getProfileRankRows(user);

    return (
        <div className="flex flex-col gap-3 px-4 py-4">
            <ProfileHeader user={user} isOwner={isOwner} mode={mode} />
            <ProfileModeTabs mode={mode} onChange={setMode} />
            <ProfileSummary
                user={user}
                grade={grade}
                globalRank={globalRank}
                countryRank={countryRank}
            />
            <ProfileGradeTrend data={gradeHistory} mode={mode} />
            {ownerAnalytics ? (
                <ProfileJudgementSummary analytics={ownerAnalytics.judgement} />
            ) : null}
            <ProfileRankDistribution
                rows={rankRows}
                playCount={user.play_count}
                isPlayCountPrivate={user.hide_play_count}
                expanded={showAllRanks}
                onToggle={() => setShowAllRanks((value) => !value)}
            />
            <ProfileBestPlays
                plays={bestPlays}
                mode={mode}
                expanded={showAllBest}
                onToggle={() => setShowAllBest((value) => !value)}
            />
            <ProfileRecentPlays
                plays={recentPlays}
                expanded={showAllRecent}
                onToggle={() => setShowAllRecent((value) => !value)}
            />

            {isOwner ? (
                <form action={logout}>
                    <button
                        type="submit"
                        className="border-danger/50 text-danger hover:bg-danger/10 focus-visible:ring-danger/30 rounded-card flex h-11 w-full cursor-pointer items-center justify-center border text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                        로그아웃
                    </button>
                </form>
            ) : null}
        </div>
    );
}
