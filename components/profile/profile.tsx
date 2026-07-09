"use client";

import { useState } from "react";
import RecitalToggleButton from "../button/recitalToggleButton";
import BestPlay from "./bestPlay";
import OverView from "./overview";
import RecentPlay from "./recentPlay";
import Statistics from "./statistics";

interface ProfileProps {
    userData: {
        discord_name: string | null;
        discord_tag: string | null;
        id: number;
        username: string | null;
        avatar: string | null;
        country: string;
        rank_basic: number | null;
        rank_basic_country: number | null;
        rank_recital: number | null;
        rank_recital_country: number | null;
        grade_basic: number | null;
        grade_recital: number | null;
        play_count: number | null;
        score_p: number | null;
        score_f: number | null;
        score_s: number | null;
        score_a2: number | null;
        score_a: number | null;
    };
    initialRecentPlays: any[];
    initialBasicBestPlays: any[];
    initialRecitalBestPlays: any[];
    userBestGrades: any[];
    sessionId: number | undefined;
}

export default function ProfileDetail({
    userData,
    initialRecentPlays,
    initialBasicBestPlays,
    initialRecitalBestPlays,
    userBestGrades,
    sessionId,
}: ProfileProps) {
    const [isRecital, setIsRecital] = useState(false);

    return (
        <div className="mx-auto flex max-w-(--breakpoint-sm) flex-col gap-4 px-8 py-4">
            {/* 타이틀, 리사이틀 버튼 */}
            <section className="flex items-center justify-between">
                <h1 className="text-tertiary">
                    <span className="text-secondary">{userData.username}</span>
                    의 프로필
                </h1>
                <RecitalToggleButton
                    isRecital={isRecital}
                    setIsRecital={setIsRecital}
                />
            </section>
            {/* 오버뷰 */}
            <OverView
                userData={userData}
                isRecital={isRecital}
                sessionId={sessionId}
            />
            {/* 통계 */}
            <Statistics
                userData={userData}
                userBestGrades={userBestGrades}
                isRecital={isRecital}
            />
            {/* 최근 플레이 기록 */}
            <RecentPlay
                initialRecentPlays={initialRecentPlays}
                id={userData.id}
            />
            {/* 베스트 플레이 기록 */}
            <BestPlay
                initialBasicBestPlays={initialBasicBestPlays}
                initialRecitalBestPlays={initialRecitalBestPlays}
                id={userData.id}
                isRecital={isRecital}
            />
        </div>
    );
}
