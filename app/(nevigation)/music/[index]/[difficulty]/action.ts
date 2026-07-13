import db from "@/lib/db";
import getSession from "@/lib/session";

interface GetUserPlayDataProps {
    index: string;
    difficulty: string;
}

export async function getUserPlayData({
    index,
    difficulty,
}: GetUserPlayDataProps) {
    const session = await getSession();

    if (!session.id) {
        return null;
    }

    return db.playData.findFirst({
        where: {
            music_idx: index,
            user_id: session.id,
            difficulty,
        },
        select: {
            user_id: true,
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                },
            },
            rank: true,
            fc_type: true,
            grade_basic: true,
            grade_recital: true,
            level: true,
            score: true,
            max_combo: true,
            play_count: true,
            fullcombo_count: true,
            pianistic_count: true,
            besttime: true,
        },
    });
}

export async function getRecentChartPlays({
    index,
    difficulty,
}: GetUserPlayDataProps) {
    const session = await getSession();

    if (!session.id) {
        return [];
    }

    const plays = await db.chartPlayHistory.findMany({
        where: {
            user_id: session.id,
            chart: {
                music_idx: index,
                difficulty,
            },
        },
        select: {
            id: true,
            score: true,
            rank: true,
            source_play_time: true,
        },
        orderBy: [{ source_play_time: "desc" }, { id: "desc" }],
        take: 4,
    });

    return plays.reverse().map((play) => ({
        id: play.id,
        score: play.score,
        rank: play.rank,
        play_time: play.source_play_time,
    }));
}
