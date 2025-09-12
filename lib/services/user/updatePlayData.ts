import db from "@/lib/db";

export async function updatePlayData(user: any, music: any) {
    const startTime = Date.now(); // 시작 시간
    // 전체 playData 삭제
    const deleteResult = await db.playData.deleteMany({
        where: { user_id: user.id },
    });
    if (deleteResult) {
        console.info("(1)기존 플레이 데이터 삭제 완료");
        const newPlayData: any = []; // 새로 생성할 playData 배열
        const score = {
            P: 0,
            S: 0,
            A2: 0,
            A: 0,
            B2: 0,
        }; // 클리어 랭크 저장 변수

        for (const data of music) {
            for (const sheet of data.sheet) {
                // 클리어 랭크 변수에 값 ++
                if (sheet.rank in score) {
                    score[sheet.rank as keyof typeof score]++;
                }
                // 새 playData 객체 생성 및 배열에 push
                newPlayData.push({
                    user_id: user.id,
                    music_idx: data["@index"],
                    level: sheet.level,
                    difficulty: sheet.difficulty,
                    score: sheet.score,
                    rank: sheet.rank,
                    fc_type: sheet.fc_type,
                    play_count: sheet.play_count,
                    fullcombo_count: sheet.fullcombo_count,
                    pianistic_count: sheet.pianistic_count,
                    max_combo: sheet.max_combo,
                    grade_basic: sheet.grade_basic,
                    grade_recital: sheet.grade_recital,
                    besttime: sheet.besttime,
                });
            }
        }
        // playData 생성(createMany)
        await db.playData.createMany({
            data: newPlayData,
        });
        console.info(`(2)새 플레이 데이터 생성 완료(${newPlayData.length}개)`);
        // 클리어 랭크 유저 데이터 업데이트
        await db.user.update({
            where: { id: user.id },
            data: {
                score_p: score.P,
                score_s: score.S,
                score_a2: score.A2,
                score_a: score.A,
                score_b2: score.B2,
            },
        });

        const duration = Date.now() - startTime; // 종료 시간
        console.info(`===[플레이 데이터 업데이트 성공(${duration}ms)]===`);
    } else {
        console.error("기존 플레이 데이터 삭제 실패");
    }
}
