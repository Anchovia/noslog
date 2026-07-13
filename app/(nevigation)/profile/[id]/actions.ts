"use server";

import db from "@/lib/db";

async function getRecentPlays(page: number, user_id: number) {
    const plays = await db.chartPlayHistory.findMany({
        where: { user_id },
        select: {
            source_play_time: true,
            score: true,
            rank: true,
            max_combo: true,
            grade_basic: true,
            chart: {
                select: {
                    level: true,
                    difficulty: true,
                    music_idx: true,
                    music: { select: { title: true } },
                },
            },
        },
        skip: page * 5,
        take: 5,
        orderBy: [{ source_play_time: "desc" }, { id: "desc" }],
    });

    return plays.map((play) => ({
        play_time: play.source_play_time,
        score: play.score,
        rank: play.rank,
        level: play.chart.level,
        difficulty: play.chart.difficulty,
        max_combo: play.max_combo,
        music_idx: play.chart.music_idx,
        grade_basic: play.grade_basic,
        music: play.chart.music,
    }));
}

export async function getMoreRecentPlays(page: number, id: number) {
    return getRecentPlays(page, id);
}

export async function getMoreBasicBestPlays(page: number, id: number) {
    const recentPlays = await db.basicBestPlay.findMany({
        where: {
            user_id: id,
        },
        select: {
            besttime: true,
            score: true,
            rank: true,
            level: true,
            difficulty: true,
            max_combo: true,
            music_idx: true,
            grade_basic: true,
            fc_type: true,
            music: {
                select: {
                    title: true,
                },
            },
        },
        skip: page * 5,
        take: 5,
        orderBy: {
            grade_basic: "desc",
        },
    });

    return recentPlays;
}

export async function getMoreRecitalBestPlays(page: number, id: number) {
    const recentPlays = await db.recitalBestPlay.findMany({
        where: {
            user_id: id,
        },
        select: {
            besttime: true,
            score: true,
            rank: true,
            level: true,
            difficulty: true,
            max_combo: true,
            music_idx: true,
            grade_recital: true,
            fc_type: true,
            music: {
                select: {
                    title: true,
                },
            },
        },
        skip: page * 5,
        take: 5,
        orderBy: {
            grade_recital: "desc",
        },
    });

    return recentPlays;
}

export async function getInitialRecentPlays(id: number) {
    return getRecentPlays(0, id);
}

export async function getInitialBasicBestPlays(id: number) {
    const initialBasicBestPlays = await db.basicBestPlay.findMany({
        where: {
            user_id: id,
        },
        select: {
            besttime: true,
            score: true,
            rank: true,
            level: true,
            difficulty: true,
            max_combo: true,
            music_idx: true,
            grade_basic: true,
            fc_type: true,
            music: {
                select: {
                    title: true,
                },
            },
        },
        take: 5,
        orderBy: {
            grade_basic: "desc",
        },
    });
    return initialBasicBestPlays;
}

export async function getInitialRecitalBestPlays(id: number) {
    const initialRecitalBestPlays = await db.recitalBestPlay.findMany({
        where: {
            user_id: id,
        },
        select: {
            besttime: true,
            score: true,
            rank: true,
            level: true,
            difficulty: true,
            max_combo: true,
            music_idx: true,
            grade_recital: true,
            fc_type: true,
            music: {
                select: {
                    title: true,
                },
            },
        },
        take: 5,
        orderBy: {
            grade_recital: "desc",
        },
    });
    return initialRecitalBestPlays;
}

export async function getUserData(id: number) {
    const userData = await db.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            discord_name: true,
            discord_tag: true,
            username: true,
            avatar: true,
            country: true,
            rank_basic: true,
            rank_basic_country: true,
            rank_recital: true,
            rank_recital_country: true,
            grade_basic: true,
            grade_recital: true,
            play_count: true,
            score_p: true,
            score_s: true,
            score_a2: true,
            score_a: true,
            score_f: true,
        },
    });

    return userData;
}
