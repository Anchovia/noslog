import db from "../../db";
import {
    mapBemaniJudgeCounts,
    normalizeBemaniRank,
    type BemaniJudgeCounts,
} from "./bemaniRecordMapping";

interface RecentHistoryItem {
    artist: string;
    best_score: number;
    class_basic: string;
    difficulty: string;
    fast_count: number;
    is_onehand: boolean;
    judge_count: BemaniJudgeCounts;
    level: number;
    license: string;
    score: number;
    slow_count: number;
    max_combo: number;
    rank: string;
    play_time: string;
    music: string;
    title: string;
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
                      level: data.level,
                      source_play_time: data.play_time,
                      score: data.score,
                      previous_best_score: data.best_score,
                      max_combo: data.max_combo,
                      rank: normalizeBemaniRank(data.rank),
                      grade_basic: data.grade_basic,
                      class_basic: data.class_basic,
                      fast_count: data.fast_count,
                      slow_count: data.slow_count,
                      is_onehand: data.is_onehand,
                      ...mapBemaniJudgeCounts(data.judge_count),
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
