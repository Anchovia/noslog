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
    formatKstPlayTime,
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
                nostalgiaName: true,
                discordName: true,
                discordUsername: true,
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
                hideNostalgiaName: true,
                hideDiscordName: true,
                hidePlayCount: true,
                hidePreferredArcade: true,
                hidePlayActivity: true,
                hidePlayScores: true,
                createdAt: true,
                preferredArcade: { select: { name: true } },
            },
        }),
        db.chartPlayHistory.findMany({
            where: { userId: id },
            select: { playedAt: true },
            orderBy: [{ playedAt: "desc" }, { id: "desc" }],
            take: 1,
        }),
    ]);

    if (!user) return null;
    // 검정 급수는 승인된 합격 기록이 유일한 출처 — 공개 데이터에는 모드별 최고 급수만 싣는다
    const { examAchievements, stats } = user;
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
        // 화면이 받는 프로필 모양은 예전 이름 그대로(2026-10-16 D1-B — Prisma 이름만 camelCase)
        user: {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            country: user.country,
            hide_nostalgia_name: user.hideNostalgiaName,
            hide_discord_name: user.hideDiscordName,
            hide_play_count: user.hidePlayCount,
            hide_preferred_arcade: user.hidePreferredArcade,
            hide_play_activity: user.hidePlayActivity,
            hide_play_scores: user.hidePlayScores,
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
            nostalgia_name: user.hideNostalgiaName ? null : user.nostalgiaName,
            discord_name: user.hideDiscordName ? null : user.discordName,
            discord_username: user.hideDiscordName
                ? null
                : user.discordUsername,
            play_count: user.hidePlayCount ? null : (stats?.playCount ?? null),
            preferredArcade: user.hidePreferredArcade
                ? null
                : user.preferredArcade,
            rank_basic: rankBasic,
            rank_basic_country: rankBasicCountry,
            rank_recital: rankRecital,
            rank_recital_country: rankRecitalCountry,
            contribution,
            achievements,
            created_at: user.createdAt.toISOString(),
            last_played_at: user.hidePlayActivity
                ? null
                : formatKstPlayTime(recentPlays[0]?.playedAt),
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
