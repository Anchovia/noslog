import db from "@/lib/db";

export async function updatePlayData(user: any, music: any) {
    console.info("유저 플레이 데이터 업데이트 시작...");
    // PlayData 생성 로직 전 전체 playData 삭제
    // 전체 playData 삭제
    console.info("기존 유저 플레이 데이터 삭제 중...");
    const playdataDeleteResult = await db.playData.deleteMany({
        where: {
            user_id: user.id,
        },
    });
    console.info("기존 유저 플레이 데이터 삭제 완료");
    // 삭제 성공시 플레이 데이터 생성 시작
    if (playdataDeleteResult) {
        console.info("새로운 유저 플레이 데이터 생성 중...");
        // 클리어 랭크 리스트
        const rankList = ["P", "S", "A2", "A", "B2"];
        // 클리어 랭크 저장 변수 선언
        const score = {
            P: 0,
            S: 0,
            A2: 0,
            A: 0,
            B2: 0,
        };
        // 플레이어 데이터 생성 시작
        await music.map(async (data: any) => {
            await data.sheet.map(async (sheet: any) => {
                // 클리어 랭크 변수에 값 추가
                rankList.map((rank) => {
                    if (sheet.rank === rank) {
                        score[rank as keyof typeof score] += 1;
                    }
                });
                // playData 생성
                await db.playData.create({
                    data: {
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
                    },
                });
            });
        });
        console.info("새 플레이 데이터 생성 완료");

        console.info("클리어 랭크 업데이트 시작...");
        // 유저 테이블에 클리어 랭크 저장
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
        console.info("클리어 랭크 업데이트 완료");
    }
    console.info("유저 전체 플레이 데이터 업데이트 완료");
}
