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

    const basicPlayDatas = await db.playData.findMany({
        where: {
            music_idx: params.index,
            difficulty: params.difficulty,
        },
        select: {
            rank: true,
            score: true,
            user: {
                select: {
                    username: true,
                    id: true,
                },
            },
            max_combo: true,
            grade_basic: true,
            besttime: true,
            user_id: true,
        },
        distinct: ["user_id"],
        take: 50,
        orderBy: {
            grade_basic: "desc",
        },
    });
    const recitalPlayDatas = await db.playData.findMany({
        where: {
            music_idx: params.index,
            difficulty: params.difficulty,
        },
        select: {
            rank: true,
            score: true,
            user: {
                select: {
                    username: true,
                    id: true,
                },
            },
            max_combo: true,
            grade_recital: true,
            besttime: true,
            user_id: true,
        },
        distinct: ["user_id"],
        take: 50,
        orderBy: {
            grade_recital: "desc",
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
                    basicPlayDatas={basicPlayDatas}
                    recitalPlayDatas={recitalPlayDatas}
                />
            )}
        </>
    );
}
