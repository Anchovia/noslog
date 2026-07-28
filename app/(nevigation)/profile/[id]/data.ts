import { CACHE_TAGS, getUserProfileTag } from "@/lib/cacheTags";
import db from "@/lib/db";
import { buildProfileSJustAnalytics } from "@/lib/profile/profileAnalytics";
import { getUserRankingPosition } from "@/lib/rankings";
import { normalizeStoredGrade } from "@/lib/utils";
import { unstable_cache } from "next/cache";

const bestPlaySelect = {
    besttime: true,
    score: true,
    rank: true,
    level: true,
    difficulty: true,
    max_combo: true,
    music_idx: true,
    fc_type: true,
    music: {
        select: {
            title: true,
            title_kana: true,
            background: true,
            translations: {
                where: {
                    status: "approved",
                    locale: { in: ["ko", "en"] as string[] },
                },
                select: {
                    locale: true,
                    title: true,
                    status: true,
                },
            },
        },
    },
} as const;

async function queryProfileData(id: number) {
    const [user, gradeHistory, basicBestPlays, recitalBestPlays, recentPlays] =
        await Promise.all([
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
                    exam_basic: true,
                    exam_recital: true,
                    play_count: true,
                    hide_nostalgia_name: true,
                    hide_discord_name: true,
                    hide_play_count: true,
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
                    preferredArcade: { select: { name: true } },
                },
            }),
            db.userBestGrade.findMany({
                where: { user_id: id },
                select: {
                    besttime: true,
                    grade_basic: true,
                    grade_recital: true,
                },
                orderBy: { besttime: "asc" },
            }),
            db.playData.findMany({
                where: { user_id: id },
                select: { ...bestPlaySelect, grade_basic: true },
                orderBy: [{ grade_basic: "desc" }, { score: "desc" }],
                take: 10,
            }),
            db.playData.findMany({
                where: { user_id: id },
                select: { ...bestPlaySelect, grade_recital: true },
                orderBy: [{ grade_recital: "desc" }, { score: "desc" }],
                take: 10,
            }),
            db.chartPlayHistory.findMany({
                where: { user_id: id },
                select: {
                    id: true,
                    source_play_time: true,
                    score: true,
                    rank: true,
                    grade_basic: true,
                    chart: {
                        select: {
                            difficulty: true,
                            level: true,
                            music_idx: true,
                            music: {
                                select: {
                                    title: true,
                                    title_kana: true,
                                    background: true,
                                    translations: {
                                        where: {
                                            status: "approved",
                                            locale: { in: ["ko", "en"] },
                                        },
                                        select: {
                                            locale: true,
                                            title: true,
                                            status: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: [{ source_play_time: "desc" }, { id: "desc" }],
                take: 10,
            }),
        ]);

    if (!user) return null;

    const [rankBasic, rankBasicCountry, rankRecital, rankRecitalCountry] =
        await Promise.all([
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
        ]);

    return {
        user: {
            ...user,
            nostalgia_name: user.hide_nostalgia_name
                ? null
                : user.nostalgia_name,
            discord_name: user.hide_discord_name ? null : user.discord_name,
            discord_username: user.hide_discord_name
                ? null
                : user.discord_username,
            play_count: user.hide_play_count ? null : user.play_count,
            rank_basic: rankBasic,
            rank_basic_country: rankBasicCountry,
            rank_recital: rankRecital,
            rank_recital_country: rankRecitalCountry,
            created_at: user.created_at.toISOString(),
            last_played_at: recentPlays[0]?.source_play_time ?? null,
        },
        gradeHistory: gradeHistory.map((point) => ({
            ...point,
            grade_basic: normalizeStoredGrade(point.grade_basic) ?? 0,
            grade_recital: normalizeStoredGrade(point.grade_recital) ?? 0,
        })),
        basicBestPlays,
        recitalBestPlays,
        recentPlays: recentPlays.map((play) => ({
            id: play.id,
            play_time: play.source_play_time,
            score: play.score,
            rank: play.rank,
            grade_basic: play.grade_basic,
            difficulty: play.chart.difficulty,
            level: play.chart.level,
            music_idx: play.chart.music_idx,
            music: play.chart.music,
        })),
    };
}

// 프로필 공개 데이터는 사용자 ID별로 캐시함
export function getCachedProfileData(id: number) {
    return unstable_cache(() => queryProfileData(id), ["profile", String(id)], {
        revalidate: 300,
        tags: [CACHE_TAGS.userProfiles, getUserProfileTag(id)],
    })();
}

// 상세 판정은 공개 캐시에 넣지 않고 본인 프로필에서만 조회함
export async function getProfileOwnerAnalytics(id: number) {
    const records = await db.playData.findMany({
        where: { user_id: id, play_count: { gt: 0 } },
        select: {
            judge_sjust: true,
            judge_just: true,
            judge_good: true,
            judge_miss: true,
            judge_near: true,
        },
    });

    return {
        judgement: buildProfileSJustAnalytics(records),
    };
}
