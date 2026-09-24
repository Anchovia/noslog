import { CACHE_TAGS, getUserProfileTag } from "@/lib/cacheTags";
import { PUBLIC_DATA_REVALIDATE_SECONDS } from "@/lib/cachePolicy";
import db from "@/lib/db";
import { getUserRankingPosition } from "@/features/rankings/server/rankingPosition";
import {
    examAchievementGradeSelect,
    getBestExamGrades,
} from "@/features/exams/examGrades";
import { unstable_cache } from "next/cache";
import { getContributionTotal } from "@/features/contributions/server/contributionPointService";

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
                grade_basic: true,
                grade_recital: true,
                examAchievements: examAchievementGradeSelect,
                play_count: true,
                hide_nostalgia_name: true,
                hide_discord_name: true,
                hide_play_count: true,
                hide_preferred_arcade: true,
                hide_play_activity: true,
                hide_play_scores: true,
                score_p: true,
                score_f: true,
                score_s: true,
                score_a2: true,
                score_a: true,
                score_b2: true,
                score_b: true,
                score_c: true,
                score_d: true,
                created_at: true,
                role: true,
                preferredArcade: { select: { name: true } },
            },
        }),
        db.chartPlayHistory.findMany({
            where: { user_id: id },
            select: { source_play_time: true },
            orderBy: [{ source_play_time: "desc" }, { id: "desc" }],
            take: 1,
        }),
    ]);

    if (!user) return null;

    const [
        rankBasic,
        rankBasicCountry,
        rankRecital,
        rankRecitalCountry,
        contribution,
    ] = await Promise.all([
        getUserRankingPosition({
            userId: user.id,
            grade: user.grade_basic,
            mode: "basic",
        }),
        getUserRankingPosition({
            userId: user.id,
            grade: user.grade_basic,
            mode: "basic",
            scope: { country: user.country },
        }),
        getUserRankingPosition({
            userId: user.id,
            grade: user.grade_recital,
            mode: "recital",
        }),
        getUserRankingPosition({
            userId: user.id,
            grade: user.grade_recital,
            mode: "recital",
            scope: { country: user.country },
        }),
        // 기여 점수 · 종류별 수(공개, 2026-09-24) — 적립되면 이 사람 프로필 캐시를 비운다
        getContributionTotal(user.id),
    ]);

    // 검정 급수는 승인된 합격 기록이 유일한 출처 — 공개 데이터에는 모드별 최고 급수만 싣는다
    const { examAchievements, ...publicUser } = user;
    return {
        user: {
            ...publicUser,
            ...getBestExamGrades(examAchievements),
            nostalgia_name: user.hide_nostalgia_name
                ? null
                : user.nostalgia_name,
            discord_name: user.hide_discord_name ? null : user.discord_name,
            discord_username: user.hide_discord_name
                ? null
                : user.discord_username,
            play_count: user.hide_play_count ? null : user.play_count,
            preferredArcade: user.hide_preferred_arcade
                ? null
                : user.preferredArcade,
            rank_basic: rankBasic,
            rank_basic_country: rankBasicCountry,
            rank_recital: rankRecital,
            rank_recital_country: rankRecitalCountry,
            contribution,
            created_at: user.created_at.toISOString(),
            last_played_at: user.hide_play_activity
                ? null
                : (recentPlays[0]?.source_play_time ?? null),
        },
    };
}

// 프로필 공개 데이터는 사용자 ID별로 캐시함
export function getCachedProfileData(id: number) {
    return unstable_cache(
        () => queryProfileData(id),
        ["profile-public-visibility-v5", String(id)],
        {
            revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
            tags: [CACHE_TAGS.userProfiles, getUserProfileTag(id)],
        }
    )();
}
