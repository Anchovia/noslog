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

type PlayDataRow = Prisma.PlayDataCreateManyInput & { chart_id: number };

/**
 * 바뀐 기록만 (user_id, chart_id) 기준으로 넣거나 고친다 — id · created_at 은 그대로 남는다(2026-10-15 D6).
 * 예전에는 동기화마다 그 사람의 기록을 모두 지우고 다시 썼다
 */
function upsertPlayData(tx: Prisma.TransactionClient, rows: PlayDataRow[]) {
    const values = rows.map(
        (row) => Prisma.sql`(
            ${row.user_id}::int, ${row.chart_id}::int,
            ${row.level}::int, ${row.score}::int, ${row.rank}::text, ${row.fc_type}::int,
            ${row.play_count}::int, ${row.clear_count ?? null}::int, ${row.clear_flag ?? null}::int,
            ${row.fullcombo_count}::int, ${row.pianistic_count}::int, ${row.max_combo}::int,
            ${row.grade_basic}::int, ${row.grade_recital ?? null}::int,
            ${row.judge_sjust ?? null}::int, ${row.judge_just ?? null}::int, ${row.judge_good ?? null}::int,
            ${row.judge_miss ?? null}::int, ${row.judge_near ?? null}::int,
            ${row.note_rate_standard ?? null}::int, ${row.note_rate_tenuto ?? null}::int,
            ${row.note_rate_glissando ?? null}::int, ${row.note_rate_trill ?? null}::int,
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
        where: { user_id },
        select: {
            chart_id: true,
            level: true,
            score: true,
            rank: true,
            fc_type: true,
            play_count: true,
            clear_count: true,
            clear_flag: true,
            fullcombo_count: true,
            pianistic_count: true,
            max_combo: true,
            grade_basic: true,
            grade_recital: true,
            judge_sjust: true,
            judge_just: true,
            judge_good: true,
            judge_miss: true,
            judge_near: true,
            note_rate_standard: true,
            note_rate_tenuto: true,
            note_rate_glissando: true,
            note_rate_trill: true,
            bestAt: true,
        },
    });
    const previousByChart = new Map(
        previousRecords.map((record) => [record.chart_id, record])
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
                    user_id,
                    chart_id,
                    level: sheet.level,
                    score: sheet.score,
                    rank: normalizedRank,
                    fc_type: sheet.fc_type,
                    play_count: sheet.play_count,
                    clear_count: sheet.clear_count,
                    clear_flag: getBemaniClearFlag(sheet.clear_flag),
                    fullcombo_count: sheet.fullcombo_count,
                    pianistic_count: sheet.pianistic_count,
                    max_combo: sheet.max_combo,
                    grade_basic: sheet.grade_basic,
                    grade_recital: sheet.grade_recital,
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
                    previous.fc_type !== record.fc_type ||
                    previous.play_count !== record.play_count ||
                    previous.clear_count !== record.clear_count ||
                    previous.clear_flag !== record.clear_flag ||
                    previous.fullcombo_count !== record.fullcombo_count ||
                    previous.pianistic_count !== record.pianistic_count ||
                    previous.max_combo !== record.max_combo ||
                    previous.grade_basic !== record.grade_basic ||
                    previous.grade_recital !== record.grade_recital ||
                    previous.judge_sjust !== record.judge_sjust ||
                    previous.judge_just !== record.judge_just ||
                    previous.judge_good !== record.judge_good ||
                    previous.judge_miss !== record.judge_miss ||
                    previous.judge_near !== record.judge_near ||
                    previous.note_rate_standard !== record.note_rate_standard ||
                    previous.note_rate_tenuto !== record.note_rate_tenuto ||
                    previous.note_rate_glissando !==
                        record.note_rate_glissando ||
                    previous.note_rate_trill !== record.note_rate_trill ||
                    (previous.bestAt?.getTime() ?? null) !==
                        (record.bestAt?.getTime() ?? null);

                if (changed) {
                    changedPlayData.push(record);
                    changedSnapshots.push({
                        level: record.level,
                        score: record.score,
                        rank: record.rank,
                        fc_type: record.fc_type,
                        play_count: record.play_count,
                        clear_count: record.clear_count,
                        clear_flag: record.clear_flag,
                        fullcombo_count: record.fullcombo_count,
                        pianistic_count: record.pianistic_count,
                        max_combo: record.max_combo,
                        grade_basic: record.grade_basic,
                        grade_recital: record.grade_recital,
                        judge_sjust: record.judge_sjust,
                        judge_just: record.judge_just,
                        judge_good: record.judge_good,
                        judge_miss: record.judge_miss,
                        judge_near: record.judge_near,
                        note_rate_standard: record.note_rate_standard,
                        note_rate_tenuto: record.note_rate_tenuto,
                        note_rate_glissando: record.note_rate_glissando,
                        note_rate_trill: record.note_rate_trill,
                        bestAt: record.bestAt,
                        chart_id,
                        user_id,
                        sync_id,
                    });
                }
            }
        }

        await db.$transaction(
            async (tx) => {
                await tx.$queryRaw`SELECT id FROM "User" WHERE id = ${user_id} FOR UPDATE`;
                const sync = await tx.dataSync.findUniqueOrThrow({
                    where: { id: sync_id, user_id, status: "processing" },
                    select: { started_at: true },
                });
                // 이번 응답에 없는 채보의 기록만 지운다(기록은 채보에 묶여 chart_id 가 비지 않는다 — P5-1)
                await tx.playData.deleteMany({
                    where: {
                        user_id,
                        chart_id: {
                            notIn: newPlayData.map((record) => record.chart_id),
                        },
                    },
                });
                // 잠금 순서를 고정해 같은 줄을 다른 순서로 잡지 않게 채보 순으로 넣는다
                changedPlayData.sort((a, b) => a.chart_id - b.chart_id);
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
                    where: { user_id, record_applied: false },
                    data: { record_applied: true },
                });
                await writePlayerStats(tx, user_id, {
                    lastFullRecordAt: sync.started_at,
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
            newPlayData.map((record) => record.chart_id)
        );
        const removedChartIds = previousRecords
            .map((record) => record.chart_id)
            .filter(
                (chartId): chartId is number =>
                    chartId !== null && !nextChartIds.has(chartId)
            );
        return {
            changedRecords: changedSnapshots.filter(
                (record) => record.play_count > 0
            ).length,
            changedChartIds: [
                ...new Set([
                    ...changedSnapshots.map((record) => record.chart_id),
                    ...removedChartIds,
                ]),
            ],
        };
    }
}
