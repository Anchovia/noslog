import db from "@/lib/db";
import getSession from "@/lib/session";

interface getUserPlayDataProps {
    index: string;
    difficulty: string;
}

export async function getBasicUserPlayData({
    index,
    difficulty,
}: getUserPlayDataProps) {
    const session = await getSession();
    if (session.id) {
        const userData = await db.playData.findMany({
            where: {
                music_idx: index,
                user_id: session.id,
                difficulty: difficulty,
            },
            select: {
                grade_basic: true,
                grade_recital: true,
                level: true,
                score: true,
                max_combo: true,
                play_count: true,
            },
        });

        return userData[0];
    } else {
        return {
            grade_basic: 0,
            grade_recital: 0,
            level: null,
            score: 0,
            max_combo: 0,
            play_count: 0,
        };
    }
}
