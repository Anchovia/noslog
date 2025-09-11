import MusicDetail from "@/components/musicDetail";
import db from "@/lib/db";
import { getRecitalUserPlayData } from "./action";

export default async function RecitalMusicDetail({
    params,
}: {
    params: { index: string; difficulty: string };
}) {
    const music = await db.music.findUnique({
        where: { index: params.index },
        select: {
            index: true,
            background: true,
            title: true,
            artist: true,
            category: true,
            sheet_len: true,
            difficulty_levels: true,
        },
    });

    const { grade_recital, level, score, max_combo, play_count } =
        await getRecitalUserPlayData({
            index: params.index,
            difficulty: params.difficulty,
        });
    return (
        <>
            {music &&
                MusicDetail({
                    isRecital: true,
                    artist: music.artist,
                    difficulty: params.difficulty,
                    category: music.category,
                    grade: grade_recital,
                    index: params.index,
                    level: level,
                    play_count: play_count,
                    max_combo: max_combo,
                    score: score,
                    title: music.title,
                    sheet_len: music.sheet_len,
                    difficulty_levels: music.difficulty_levels,
                    background: music.background,
                })}
        </>
    );
}
