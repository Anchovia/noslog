import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";

import { getAchievementRecords } from "@/features/achievements/server/achievement-service";
import { getContributionTotal } from "@/features/contributions/server/contribution-point-service";
import {
    examAchievementGradeSelect,
    getBestExamGrades,
} from "@/features/exams/exam-grades";
import { getUserRankingPosition } from "@/features/rankings/server/ranking-position";
import { PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cache-policy";
import { CACHE_TAGS, getUserProfileTag } from "@/lib/cache-tags";
import db from "@/lib/db";
import {
    STATS_GRADE_SELECT,
    STATS_RANK_COUNT_SELECT,
} from "@/lib/player-stats";

async function queryProfileData(id: number) {
    const [user, recentPlays] = await Promise.all([
        db.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                nostalgia_name: true,
                discord_name: true,
                discord_username: true,
                avatar: true,
                country: true,
                // 동기화 결과는 player_stats 에서(2026-10-16 DB 재설계 P4) — 화면에는 예전 이름으로 넘긴다
                stats: {
                    select: {
                        ...STATS_GRADE_SELECT,
                        ...STATS_RANK_COUNT_SELECT,
                        playCount: true,
                    },
                },
                examAchievements: examAchievementGradeSelect,
                hide_nostalgia_name: true,
                hide_discord_name: true,
                hide_play_count: true,
                hide_preferred_arcade: true,
                hide_play_activity: true,
                hide_play_scores: true,
                created_at: true,
                role: true,
                preferredArcade: { select: { name: true } },
            },
        }),
        db.chartPlayHistory.findMany({
            where: { user_id: id },
            select: { source_play_time: true },
            orderBy: [
                { playedAt: { sort: "desc", nulls: "last" } },
                { id: "desc" },
            ],
            take: 1,
        }),
    ]);

    if (!user) return null;
    // 검정 급수는 승인된 합격 기록이 유일한 출처 — 공개 데이터에는 모드별 최고 급수만 싣는다
    const { examAchievements, stats, ...publicUser } = user;
    const grade_basic = stats?.gradeBasic ?? null;
    const grade_recital = stats?.gradeRecital ?? null;

    const [
        rankBasic,
        rankBasicCountry,
        rankRecital,
        rankRecitalCountry,
        contribution,
        achievements,
    ] = await Promise.all([
        getUserRankingPosition({
            userId: user.id,
            grade: grade_basic,
            mode: "basic",
        }),
        getUserRankingPosition({
            userId: user.id,
            grade: grade_basic,
            mode: "basic",
            scope: { country: user.country },
        }),
        getUserRankingPosition({
            userId: user.id,
            grade: grade_recital,
            mode: "recital",
        }),
        getUserRankingPosition({
            userId: user.id,
            grade: grade_recital,
            mode: "recital",
            scope: { country: user.country },
        }),
        // 기여 점수 · 종류별 수(공개, 2026-09-24) — 적립되면 이 사람 프로필 캐시를 비운다
        getContributionTotal(user.id),
        // 업적(2026-09-24) — 동기화 · 머리에 걸기가 이 사람 프로필 캐시를 비운다
        getAchievementRecords(user.id),
    ]);

    return {
        user: {
            ...publicUser,
            grade_basic,
            grade_recital,
            score_p: stats?.scoreP ?? null,
            score_f: stats?.scoreF ?? null,
            score_s: stats?.scoreS ?? null,
            score_a2: stats?.scoreA2 ?? null,
            score_a: stats?.scoreA ?? null,
            score_b2: stats?.scoreB2 ?? null,
            score_b: stats?.scoreB ?? null,
            score_c: stats?.scoreC ?? null,
            score_d: stats?.scoreD ?? null,
            ...getBestExamGrades(examAchievements),
            nostalgia_name: user.hide_nostalgia_name
                ? null
                : user.nostalgia_name,
            discord_name: user.hide_discord_name ? null : user.discord_name,
            discord_username: user.hide_discord_name
                ? null
                : user.discord_username,
            play_count: user.hide_play_count
                ? null
                : (stats?.playCount ?? null),
            preferredArcade: user.hide_preferred_arcade
                ? null
                : user.preferredArcade,
            rank_basic: rankBasic,
            rank_basic_country: rankBasicCountry,
            rank_recital: rankRecital,
            rank_recital_country: rankRecitalCountry,
            contribution,
            achievements,
            created_at: user.created_at.toISOString(),
            last_played_at: user.hide_play_activity
                ? null
                : (recentPlays[0]?.source_play_time ?? null),
        },
    };
}

// 프로필 공개 데이터는 사용자 ID별로 캐시함.
// 한 요청 안의 메타데이터 · 레이아웃 · 페이지가 같은 결과를 나눠 쓴다(React cache) — 캐시가 비었을 때 계산이 겹치지 않게(2026-10-15 S6)
export const getCachedProfileData = cache((id: number) =>
    unstable_cache(
        () => queryProfileData(id),
        ["profile-public-visibility-v6", String(id)],
        {
            revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
            tags: [CACHE_TAGS.userProfiles, getUserProfileTag(id)],
        }
    )()
);
