import { Prisma } from "@prisma/client";

import db from "@/lib/db";
import type { SyncMusicInput } from "@/lib/services/music/update-music";
import {
    getBemaniClearFlag,
    mapBemaniJudgeCounts,
    mapBemaniNoteSuccessRates,
    normalizeBemaniRank,
} from "@/lib/services/user/bemani-record-mapping";
import { type ChartIdMap, loadChartIds } from "@/lib/services/user/chart-ids";
import { writePlayerStats } from "@/lib/services/user/player-stats";
import { recordBestAt } from "@/lib/services/user/recent-record-merge";

// 한 문장에 넣는 줄 수 — 줄마다 값 27개라 Postgres 인자 한도(65535) 안에 넉넉히 든다
const UPSERT_CHUNK = 500;

type PlayDataRow = Prisma.PlayDataCreateManyInput & { chartId: number };

/**
 * 바뀐 기록만 (user_id, chart_id) 기준으로 넣거나 고친다 — id · created_at 은 그대로 남는다(2026-10-15 D6).
 * 예전에는 동기화마다 그 사람의 기록을 모두 지우고 다시 썼다
 */
function upsertPlayData(tx: Prisma.TransactionClient, rows: PlayDataRow[]) {
    const values = rows.map(
        (row) => Prisma.sql`(
            ${row.userId}::int, ${row.chartId}::int,
            ${row.level}::int, ${row.score}::int, ${row.rank}::text, ${row.fcType}::int,
            ${row.playCount}::int, ${row.clearCount ?? null}::int, ${row.clearFlag ?? null}::int,
            ${row.fullcomboCount}::int, ${row.pianisticCount}::int, ${row.maxCombo}::int,
            ${row.gradeBasic}::int, ${row.gradeRecital ?? null}::int,
            ${row.judgeSjust ?? null}::int, ${row.judgeJust ?? null}::int, ${row.judgeGood ?? null}::int,
            ${row.judgeMiss ?? null}::int, ${row.judgeNear ?? null}::int,
            ${row.noteRateStandard ?? null}::int, ${row.noteRateTenuto ?? null}::int,
            ${row.noteRateGlissando ?? null}::int, ${row.noteRateTrill ?? null}::int,
            ${row.bestAt ?? null}::timestamptz, CURRENT_TIMESTAMP
        )`
    );
    return tx.$executeRaw`
        INSERT INTO "PlayData" (
            "user_id", "chart_id",
            "level", "score", "rank", "fc_type",
            "play_count", "clear_count", "clear_flag",
            "fullcombo_count", "pianistic_count", "max_combo",
            "grade_basic", "grade_recital",
            "judge_sjust", "judge_just", "judge_good", "judge_miss", "judge_near",
            "note_rate_standard", "note_rate_tenuto", "note_rate_glissando", "note_rate_trill",
            "best_at", "updated_at"
        )
        VALUES ${Prisma.join(values)}
        ON CONFLICT ("user_id", "chart_id") DO UPDATE SET
            "level" = EXCLUDED."level",
            "score" = EXCLUDED."score",
            "rank" = EXCLUDED."rank",
            "fc_type" = EXCLUDED."fc_type",
            "play_count" = EXCLUDED."play_count",
            "clear_count" = EXCLUDED."clear_count",
            "clear_flag" = EXCLUDED."clear_flag",
            "fullcombo_count" = EXCLUDED."fullcombo_count",
            "pianistic_count" = EXCLUDED."pianistic_count",
            "max_combo" = EXCLUDED."max_combo",
            "grade_basic" = EXCLUDED."grade_basic",
            "grade_recital" = EXCLUDED."grade_recital",
            "judge_sjust" = EXCLUDED."judge_sjust",
            "judge_just" = EXCLUDED."judge_just",
            "judge_good" = EXCLUDED."judge_good",
            "judge_miss" = EXCLUDED."judge_miss",
            "judge_near" = EXCLUDED."judge_near",
            "note_rate_standard" = EXCLUDED."note_rate_standard",
            "note_rate_tenuto" = EXCLUDED."note_rate_tenuto",
            "note_rate_glissando" = EXCLUDED."note_rate_glissando",
            "note_rate_trill" = EXCLUDED."note_rate_trill",
            "best_at" = EXCLUDED."best_at",
            "updated_at" = EXCLUDED."updated_at"`;
}

export async function updatePlayData(
    user_id: number,
    music: SyncMusicInput[],
    sync_id: number,
    // 동기화 라우트가 곡 목록 반영 뒤 한 번 읽어 넘긴다 — 없으면 여기서 읽는다
    knownChartIds?: ChartIdMap
) {
    const startTime = Date.now(); // 시작 시간
    const chartIds = knownChartIds ?? (await loadChartIds());
    const previousRecords = await db.playData.findMany({
        where: { userId: user_id },
        select: {
            chartId: true,
            level: true,
            score: true,
            rank: true,
            fcType: true,
            playCount: true,
            clearCount: true,
            clearFlag: true,
            fullcomboCount: true,
            pianisticCount: true,
            maxCombo: true,
            gradeBasic: true,
            gradeRecital: true,
            judgeSjust: true,
            judgeJust: true,
            judgeGood: true,
            judgeMiss: true,
            judgeNear: true,
            noteRateStandard: true,
            noteRateTenuto: true,
            noteRateGlissando: true,
            noteRateTrill: true,
            bestAt: true,
        },
    });
    const previousByChart = new Map(
        previousRecords.map((record) => [record.chartId, record])
    );

    const changedSnapshots: Prisma.ChartRecordSnapshotCreateManyInput[] = [];

    {
        const newPlayData: PlayDataRow[] = []; // 이번 응답의 전체 기록
        const changedPlayData: PlayDataRow[] = []; // 그중 새로 생기거나 바뀐 기록
        const score = {
            P: 0,
            F: 0,
            S: 0,
            A2: 0,
            A: 0,
            B2: 0,
            B: 0,
            C: 0,
            D: 0,
        }; // 클리어 랭크 저장 변수

        for (const data of music) {
            for (const sheet of data.sheet) {
                const chart_id =
                    chartIds.get(`${data["@index"]}:${sheet.difficulty}`) ??
                    null;
                if (!chart_id) {
                    continue;
                }
                const normalizedRank = normalizeBemaniRank(sheet.rank);
                // DB에 등록된 채보만 클리어 랭크와 개인 기록에 반영함
                if (normalizedRank in score) {
                    score[normalizedRank as keyof typeof score]++;
                }
                if (sheet.fc_type === 2) {
                    score["F"]++;
                }
                const record = {
                    userId: user_id,
                    chartId: chart_id,
                    level: sheet.level,
                    score: sheet.score,
                    rank: normalizedRank,
                    fcType: sheet.fc_type,
                    playCount: sheet.play_count,
                    clearCount: sheet.clear_count,
                    clearFlag: getBemaniClearFlag(sheet.clear_flag),
                    fullcomboCount: sheet.fullcombo_count,
                    pianisticCount: sheet.pianistic_count,
                    maxCombo: sheet.max_combo,
                    gradeBasic: sheet.grade_basic,
                    gradeRecital: sheet.grade_recital,
                    ...mapBemaniJudgeCounts(sheet.judge),
                    ...mapBemaniNoteSuccessRates(sheet.note_success_rate),
                    // 공식 문자열 시각은 timestamptz 로만 남긴다(2026-10-16 P5-1)
                    bestAt: recordBestAt(sheet.besttime),
                };
                newPlayData.push(record);

                const previous = previousByChart.get(chart_id);
                const changed =
                    !previous ||
                    previous.level !== record.level ||
                    previous.score !== record.score ||
                    previous.rank !== record.rank ||
                    previous.fcType !== record.fcType ||
                    previous.playCount !== record.playCount ||
                    previous.clearCount !== record.clearCount ||
                    previous.clearFlag !== record.clearFlag ||
                    previous.fullcomboCount !== record.fullcomboCount ||
                    previous.pianisticCount !== record.pianisticCount ||
                    previous.maxCombo !== record.maxCombo ||
                    previous.gradeBasic !== record.gradeBasic ||
                    previous.gradeRecital !== record.gradeRecital ||
                    previous.judgeSjust !== record.judgeSjust ||
                    previous.judgeJust !== record.judgeJust ||
                    previous.judgeGood !== record.judgeGood ||
                    previous.judgeMiss !== record.judgeMiss ||
                    previous.judgeNear !== record.judgeNear ||
                    previous.noteRateStandard !== record.noteRateStandard ||
                    previous.noteRateTenuto !== record.noteRateTenuto ||
                    previous.noteRateGlissando !== record.noteRateGlissando ||
                    previous.noteRateTrill !== record.noteRateTrill ||
                    (previous.bestAt?.getTime() ?? null) !==
                        (record.bestAt?.getTime() ?? null);

                if (changed) {
                    changedPlayData.push(record);
                    changedSnapshots.push({
                        level: record.level,
                        score: record.score,
                        rank: record.rank,
                        fcType: record.fcType,
                        playCount: record.playCount,
                        clearCount: record.clearCount,
                        clearFlag: record.clearFlag,
                        fullcomboCount: record.fullcomboCount,
                        pianisticCount: record.pianisticCount,
                        maxCombo: record.maxCombo,
                        gradeBasic: record.gradeBasic,
                        gradeRecital: record.gradeRecital,
                        judgeSjust: record.judgeSjust,
                        judgeJust: record.judgeJust,
                        judgeGood: record.judgeGood,
                        judgeMiss: record.judgeMiss,
                        judgeNear: record.judgeNear,
                        noteRateStandard: record.noteRateStandard,
                        noteRateTenuto: record.noteRateTenuto,
                        noteRateGlissando: record.noteRateGlissando,
                        noteRateTrill: record.noteRateTrill,
                        bestAt: record.bestAt,
                        chartId: chart_id,
                        userId: user_id,
                        syncId: sync_id,
                    });
                }
            }
        }

        await db.$transaction(
            async (tx) => {
                await tx.$queryRaw`SELECT id FROM "User" WHERE id = ${user_id} FOR UPDATE`;
                const sync = await tx.dataSync.findUniqueOrThrow({
                    where: {
                        id: sync_id,
                        userId: user_id,
                        status: "processing",
                    },
                    select: { startedAt: true },
                });
                // 이번 응답에 없는 채보의 기록만 지운다(기록은 채보에 묶여 chart_id 가 비지 않는다 — P5-1)
                await tx.playData.deleteMany({
                    where: {
                        userId: user_id,
                        chartId: {
                            notIn: newPlayData.map((record) => record.chartId),
                        },
                    },
                });
                // 잠금 순서를 고정해 같은 줄을 다른 순서로 잡지 않게 채보 순으로 넣는다
                changedPlayData.sort((a, b) => a.chartId - b.chartId);
                for (
                    let start = 0;
                    start < changedPlayData.length;
                    start += UPSERT_CHUNK
                )
                    await upsertPlayData(
                        tx,
                        changedPlayData.slice(start, start + UPSERT_CHUNK)
                    );
                if (changedSnapshots.length) {
                    await tx.chartRecordSnapshot.createMany({
                        data: changedSnapshots,
                    });
                }
                await tx.chartPlayHistory.updateMany({
                    where: { userId: user_id, recordApplied: false },
                    data: { recordApplied: true },
                });
                await writePlayerStats(tx, user_id, {
                    lastFullRecordAt: sync.startedAt,
                    scoreP: score.P,
                    scoreF: score.F,
                    scoreS: score.S,
                    scoreA2: score.A2,
                    scoreA: score.A,
                    scoreB2: score.B2,
                    scoreB: score.B,
                    scoreC: score.C,
                    scoreD: score.D,
                });
            },
            { timeout: 30000 }
        );

        const duration = Date.now() - startTime; // 종료 시간
        console.info(`===[플레이 데이터 업데이트 성공(${duration}ms)]===`);
        // 순위 · 점수 분포 캐시를 비울 채보 — 바뀐 기록과 이번 응답에서 빠져 지워진 기록
        const nextChartIds = new Set(
            newPlayData.map((record) => record.chartId)
        );
        const removedChartIds = previousRecords
            .map((record) => record.chartId)
            .filter(
                (chartId): chartId is number =>
                    chartId !== null && !nextChartIds.has(chartId)
            );
        return {
            changedRecords: changedSnapshots.filter(
                (record) => record.playCount > 0
            ).length,
            changedChartIds: [
                ...new Set([
                    ...changedSnapshots.map((record) => record.chartId),
                    ...removedChartIds,
                ]),
            ],
        };
    }
}
