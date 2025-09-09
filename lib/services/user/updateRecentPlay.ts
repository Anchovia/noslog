import db from "../../db";

export async function updateRecentPlay(user: any, history: any) {
    console.info("최근 플레이 히스토리 업데이트 시작...");
    console.info("기존 플레이 히스토리 삭제 중...");
    // 최근 플레이 히스토리 업데이트
    const recentPlayDeleteResult = await db.recentPlay.deleteMany({
        where: {
            user_id: user.id,
        },
    });
    if (recentPlayDeleteResult) {
        console.info("기존 플레이 히스토리 삭제 성공");
        console.info("최근 플레이 히스토리 생성 중...");
        history.map(async (data: any) => {
            await db.recentPlay.create({
                data: {
                    difficulty: data.difficulty,
                    level: data.level,
                    score: data.score,
                    max_combo: data.max_combo,
                    rank: data.rank,
                    play_time: data.play_time,
                    user_id: user.id,
                    music_idx: data.music,
                },
            });
        });
    }
    console.info("최근 플레이 히스토리 생성 완료");
    console.info("최근 플레이 히스토리 업데이트 완료");
}
