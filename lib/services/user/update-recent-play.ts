import db from "../../db";
import {
    type BemaniJudgeCounts,
    mapBemaniJudgeCounts,
    normalizeBemaniRank,
} from "./bemani-record-mapping";
import { recordBestAt } from "./recent-record-merge";

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

interface RecentHistoryIdentity {
    chartId: number;
    playedAt: Date;
    score: number;
    maxCombo: number;
    rank: string;
}

export async function updateRecentPlay(
    user_id: number,
    history: RecentHistoryItem[],
    sync_id: number
) {
    const startTime = Date.now(); // 시작 시간
    const charts = await db.musicChart.findMany({
        select: { id: true, musicIdx: true, difficulty: true },
    });
    const chartIds = new Map(
        charts.map((chart) => [
            `${chart.musicIdx}:${chart.difficulty}`,
            chart.id,
        ])
    );

    const skippedCharts: { musicIndex: string; difficulty: string }[] = [];
    let untimed = 0;
    const mappedRows = history.flatMap((data) => {
        const chart_id =
            chartIds.get(`${data.music}:${data.difficulty}`) ?? null;

        if (!chart_id) {
            skippedCharts.push({
                musicIndex: data.music,
                difficulty: data.difficulty,
            });
        }
        // 플레이 시각(공식 KST)을 timestamptz 로 — 같은 플레이를 가르는 키라 시각을 못 읽은 줄은 넣지 않는다(2026-10-16 P5-1)
        const playedAt = recordBestAt(data.play_time);
        if (chart_id && !playedAt) untimed += 1;
        return chart_id && playedAt
            ? [
                  {
                      userId: user_id,
                      chartId: chart_id,
                      level: data.level,
                      playedAt,
                      score: data.score,
                      bestScore: data.best_score,
                      maxCombo: data.max_combo,
                      rank: normalizeBemaniRank(data.rank),
                      gradeBasic: data.grade_basic,
                      classBasic: data.class_basic,
                      fastCount: data.fast_count,
                      slowCount: data.slow_count,
                      isOnehand: data.is_onehand,
                      ...mapBemaniJudgeCounts(data.judge_count),
                      firstSyncId: sync_id,
                  },
              ]
            : [];
    });

    const identityKey = (row: RecentHistoryIdentity) =>
        [
            row.chartId,
            row.playedAt.getTime(),
            row.score,
            row.maxCombo,
            row.rank,
        ].join(":");
    const historyRows = [
        ...new Map(
            mappedRows.map((row) => [identityKey(row), row] as const)
        ).values(),
    ];

    const diagnostic = {
        syncId: sync_id,
        received: history.length,
        unmapped: history.length - mappedRows.length - untimed,
        untimed,
        duplicate: mappedRows.length - historyRows.length,
    };

    if (historyRows.length === 0) {
        console.info("Recent play ingestion", {
            ...diagnostic,
            existing: 0,
            inserted: 0,
        });
        return { insertedPlays: 0, skippedCharts };
    }

    const existingRows = await db.chartPlayHistory.findMany({
        where: {
            userId: user_id,
            OR: historyRows.map((row) => ({
                chartId: row.chartId,
                playedAt: row.playedAt,
                score: row.score,
                maxCombo: row.maxCombo,
                rank: row.rank,
            })),
        },
        select: {
            chartId: true,
            playedAt: true,
            score: true,
            maxCombo: true,
            rank: true,
            level: true,
            bestScore: true,
            gradeBasic: true,
            classBasic: true,
            fastCount: true,
            slowCount: true,
            isOnehand: true,
            judgeSjust: true,
            judgeJust: true,
            judgeGood: true,
            judgeMiss: true,
            judgeNear: true,
        },
    });
    const existingKeys = new Set(existingRows.map(identityKey));
    const existingByKey = new Map(
        existingRows.map((row) => [identityKey(row), row] as const)
    );
    // 새 플레이는 한 문장으로 넣고, 이미 있는 플레이는 값이 다를 때만 고친다(2026-10-15 S9) —
    // 예전처럼 받은 100건을 모두 upsert 하지 않는다. 고치는 열 · 결과 행은 예전과 같다
    const newRows = historyRows.filter(
        (row) => !existingKeys.has(identityKey(row))
    );
    const changedRows = historyRows.filter((row) => {
        const current = existingByKey.get(identityKey(row));
        return (
            current !== undefined &&
            (current.level !== row.level ||
                current.bestScore !== row.bestScore ||
                current.gradeBasic !== row.gradeBasic ||
                current.classBasic !== row.classBasic ||
                current.fastCount !== row.fastCount ||
                current.slowCount !== row.slowCount ||
                current.isOnehand !== row.isOnehand ||
                current.judgeSjust !== row.judgeSjust ||
                current.judgeJust !== row.judgeJust ||
                current.judgeGood !== row.judgeGood ||
                current.judgeMiss !== row.judgeMiss ||
                current.judgeNear !== row.judgeNear)
        );
    });

    await db.$transaction([
        ...(newRows.length
            ? [
                  db.chartPlayHistory.createMany({
                      data: newRows,
                      skipDuplicates: true,
                  }),
              ]
            : []),
        ...changedRows.map((row) =>
            db.chartPlayHistory.upsert({
                where: {
                    userId_chartId_playedAt_score_maxCombo_rank: {
                        userId: user_id,
                        chartId: row.chartId,
                        playedAt: row.playedAt,
                        score: row.score,
                        maxCombo: row.maxCombo,
                        rank: row.rank,
                    },
                },
                create: row,
                update: {
                    level: row.level,
                    bestScore: row.bestScore,
                    gradeBasic: row.gradeBasic,
                    classBasic: row.classBasic,
                    fastCount: row.fastCount,
                    slowCount: row.slowCount,
                    isOnehand: row.isOnehand,
                    judgeSjust: row.judgeSjust,
                    judgeJust: row.judgeJust,
                    judgeGood: row.judgeGood,
                    judgeMiss: row.judgeMiss,
                    judgeNear: row.judgeNear,
                },
            })
        ),
    ]);

    const duration = Date.now() - startTime;
    const inserted = newRows.length;
    console.info("Recent play ingestion", {
        ...diagnostic,
        existing: historyRows.length - inserted,
        inserted,
    });
    console.info(`===[최근 플레이 히스토리 업데이트 성공(${duration}ms)]===`);
    return { insertedPlays: inserted, skippedCharts };
}
