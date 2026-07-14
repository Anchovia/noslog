import db from "../../db";

interface RecentHistoryItem {
    difficulty: string;
    level: number;
    score: number;
    max_combo: number;
    rank: string;
    play_time: string;
    music: string;
    grade_basic: number;
}

export async function updateRecentPlay(
    user_id: number,
    history: RecentHistoryItem[],
    sync_id: number
) {
    const startTime = Date.now(); // 시작 시간
    const charts = await db.musicChart.findMany({
        select: { id: true, music_idx: true, difficulty: true },
    });
    const chartIds = new Map(
        charts.map((chart) => [
            `${chart.music_idx}:${chart.difficulty}`,
            chart.id,
        ])
    );

    const insertedPlays = await db.$transaction(async (transaction) => {
        let insertedCount = 0;

        for (const data of history) {
            const chart_id =
                chartIds.get(`${data.music}:${data.difficulty}`) ?? null;

            if (!chart_id) {
                continue;
            }

            const uniqueKey = {
                user_id,
                chart_id,
                source_play_time: data.play_time,
                score: data.score,
                max_combo: data.max_combo,
                rank: data.rank,
            };
            const existing = await transaction.chartPlayHistory.findUnique({
                where: {
                    user_id_chart_id_source_play_time_score_max_combo_rank:
                        uniqueKey,
                },
                select: { id: true },
            });

            if (!existing) {
                await transaction.chartPlayHistory.create({
                    data: {
                        ...uniqueKey,
                        grade_basic: data.grade_basic,
                        first_sync_id: sync_id,
                    },
                });
                insertedCount++;
            }
        }

        // 기존 최근 플레이 데이터 삭제(deleteMany)
        await transaction.recentPlay.deleteMany({
            where: { user_id },
        });
        console.info("(1)기존 플레이 히스토리 삭제 완료");

        // 새 최근 플레이 생성(createMany)
        await transaction.recentPlay.createMany({
            data: history.map((data) => ({
                difficulty: data.difficulty,
                level: data.level,
                score: data.score,
                max_combo: data.max_combo,
                rank: data.rank,
                play_time: data.play_time,
                user_id,
                music_idx: data.music,
                chart_id:
                    chartIds.get(`${data.music}:${data.difficulty}`) ?? null,
                grade_basic: data.grade_basic,
            })),
        });

        return insertedCount;
    });

    const duration = Date.now() - startTime;
    console.info(`===[최근 플레이 히스토리 업데이트 성공(${duration}ms)]===`);
    return insertedPlays;
}
