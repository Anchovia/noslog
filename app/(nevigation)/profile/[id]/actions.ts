"use server";

import db from "@/lib/db";
import { getUserRankingPosition } from "@/lib/rankings";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

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
            background: true,
        },
    },
} as const;

// 프로필 대시보드에 필요한 데이터를 한곳에서 조회함
export async function getProfileData(id: number) {
    const [user, gradeHistory, basicBestPlays, recitalBestPlays, recentPlays] =
        await Promise.all([
            db.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    username: true,
                    nostalgia_name: true,
                    discord_name: true,
                    avatar: true,
                    country: true,
                    grade_basic: true,
                    grade_recital: true,
                    exam_basic: true,
                    exam_recital: true,
                    play_count: true,
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
            db.basicBestPlay.findMany({
                where: { user_id: id },
                select: { ...bestPlaySelect, grade_basic: true },
                orderBy: [{ grade_basic: "desc" }, { score: "desc" }],
                take: 10,
            }),
            db.recitalBestPlay.findMany({
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
                                    background: true,
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
            rank_basic: rankBasic,
            rank_basic_country: rankBasicCountry,
            rank_recital: rankRecital,
            rank_recital_country: rankRecitalCountry,
            created_at: user.created_at.toISOString(),
            last_played_at: recentPlays[0]?.source_play_time ?? null,
        },
        gradeHistory,
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

export async function logout() {
    const session = await getSession();
    session.destroy();
    redirect("/");
}
