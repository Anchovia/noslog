import db from "../../db";

export async function updateRecentPlay(user: any, history: any) {
    const startTime = Date.now(); // 시작 시간

    await db.$transaction(async (transaction) => {
        console.info("기존 플레이 히스토리 삭제 중...");
        // 기존 최근 플레이 데이터 삭제(deleteMany)
        await transaction.recentPlay.deleteMany({
            where: { user_id: user.id },
        });
        console.info("기존 플레이 히스토리 삭제 완료");

        // 새 최근 플레이 생성(createMany)
        console.info("최근 플레이 히스토리 생성 중...");
        await transaction.recentPlay.createMany({
            data: history.map((data: any) => ({
                difficulty: data.difficulty,
                level: data.level,
                score: data.score,
                max_combo: data.max_combo,
                rank: data.rank,
                play_time: data.play_time,
                user_id: user.id,
                music_idx: data.music,
            })),
        });
        console.info("최근 플레이 히스토리 생성 완료");
    });

    const duration = Date.now() - startTime;
    console.info(`--[최근 플레이 히스토리 업데이트 완료(${duration}ms)]--`);
}
