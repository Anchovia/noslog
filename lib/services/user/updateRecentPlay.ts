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

    const historyRows = history.flatMap((data) => {
        const chart_id =
            chartIds.get(`${data.music}:${data.difficulty}`) ?? null;

        return chart_id
            ? [
                  {
                      user_id,
                      chart_id,
                      source_play_time: data.play_time,
                      score: data.score,
                      max_combo: data.max_combo,
                      rank: data.rank,
                      grade_basic: data.grade_basic,
                      first_sync_id: sync_id,
                  },
              ]
            : [];
    });
    const insertedPlays = await db.chartPlayHistory.createMany({
        data: historyRows,
        skipDuplicates: true,
    });

    const duration = Date.now() - startTime;
    console.info(`===[최근 플레이 히스토리 업데이트 성공(${duration}ms)]===`);
    return insertedPlays.count;
}
