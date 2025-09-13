"use server";

import db from "@/lib/db";

export async function getMoreRecentPlays(page: number, id: number) {
    const recentPlays = await db.recentPlay.findMany({
        where: {
            user_id: id,
        },
        select: {
            play_time: true,
            score: true,
            rank: true,
            level: true,
            difficulty: true,
            max_combo: true,
            music_idx: true,
            grade_basic: true,
            music: {
                select: {
                    title: true,
                },
            },
        },
        skip: page * 5,
        take: 5,
        orderBy: {
            play_time: "desc",
        },
    });

    return recentPlays;
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
    const initialRecentPlays = await db.recentPlay.findMany({
        where: {
            user_id: id,
        },
        select: {
            play_time: true,
            score: true,
            rank: true,
            level: true,
            difficulty: true,
            max_combo: true,
            music_idx: true,
            grade_basic: true,
            music: {
                select: {
                    title: true,
                },
            },
        },
        take: 5,
        orderBy: {
            play_time: "desc",
        },
    });
    return initialRecentPlays;
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

export async function getInitialBestPlays(id: number) {
    const initialBestPlays = await db.recentPlay.findMany({
        where: {
            user_id: id,
        },
        select: {
            play_time: true,
            score: true,
            rank: true,
            level: true,
            difficulty: true,
            max_combo: true,
            music_idx: true,
            grade_basic: true,
            music: {
                select: {
                    title: true,
                },
            },
        },
        take: 5,
        orderBy: {
            play_time: "desc",
        },
    });
    return initialBestPlays;
}

export async function getUserData(id: number) {
    const userData = await db.user.findUnique({
        where: {
            id,
        },
        select: {
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
            score_b2: true,
            score_f: true,
        },
    });

    return userData;
}
