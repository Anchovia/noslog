import MusicDetail from "@/components/music/musicDetail";
import db from "@/lib/db";
import { getBasicUserPlayData } from "./action";

export default async function BasicMusicDetail({
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

    const { grade_basic, level, score, max_combo, play_count, grade_recital } =
        await getBasicUserPlayData({
            index: params.index,
            difficulty: params.difficulty,
        });

    return (
        <>
            {music && (
                <MusicDetail
                    category={music.category}
                    index={music.index}
                    grade_basic={grade_basic}
                    grade_recital={grade_recital}
                    title={music.title}
                    artist={music.artist}
                    background={music.background}
                    score={score}
                    max_combo={max_combo}
                    play_count={play_count}
                    difficulty={params.difficulty}
                    sheet_len={music.sheet_len}
                    difficulty_levels={music.difficulty_levels}
                    level={level}
                />
            )}
        </>
    );
}
