import "server-only";

import { Prisma } from "@prisma/client";

import {
    PROFILE_RECORDS_PAGE_SIZE,
    profileRecordsPayloadSchema,
    type ProfileRecordsQuery,
} from "@/features/profile/schemas/public-profile-schema";
import db from "@/lib/db";
import { formatKstMinute } from "@/lib/player-stats";

const BEST_LIMIT = 50;
/** 가져온 기록의 「달성 시각」 — 한 번도 안 한 채보의 자리 값(1970 년)은 날짜가 없는 것으로 */
// 기록 시각 글자 — 모르면 null(옛 「1970-01-01 09:00」 자리표시는 bestAt 이 NULL, 2026-10-16 P5-1)
export function recordPlayedAt(bestAt: Date | null | undefined) {
    return formatKstMinute(bestAt);
}

/**
 * 기록마다 그 채보에서의 순위(2026-09-25) — 곡 상세 순위표와 같은 RANK: 점수를 공개한 플레이어 중 나보다 높은 점수 수 + 1.
 * 비공개 플레이어 본인의 기록도 「공개된 사람들 사이 내 자리」 로 센다
 */
export async function getChartRanks(playIds: readonly number[]) {
    if (!playIds.length) return new Map<number, number>();
    const rows = await db.$queryRaw<{ id: number; position: number }[]>`
        SELECT p.id, (1 + (
            SELECT COUNT(*) FROM "PlayData" q JOIN "User" u ON u.id = q.user_id
            WHERE q.chart_id = p.chart_id AND q.score > p.score
                AND q.user_id <> p.user_id AND u.hide_play_scores = false
        ))::integer AS position
        FROM "PlayData" p
        WHERE p.id IN (${Prisma.join(playIds)}) AND p.chart_id IS NOT NULL AND p.score > 0
    `;
    return new Map(rows.map((row) => [row.id, row.position]));
}

/** 「기록」 탭 목록 — 베스트 50(공식 Grd 기여 상위) 또는 모든 기록을 고른 순으로 */
export async function getPublicProfileRecords(
    userId: number,
    query: ProfileRecordsQuery
) {
    const user = await db.user.findUnique({
        where: { id: userId },
        select: { id: true },
    });
    if (!user) return null;
    const field = query.mode === "basic" ? "grade_basic" : "grade_recital";
    const best =
        query.view === "best"
            ? await db.playData.findMany({
                  where: { user_id: userId, [field]: { gt: 0 } },
                  select: { id: true },
                  orderBy: [
                      { [field]: "desc" },
                      { score: "desc" },
                      { chart_id: "asc" },
                      { id: "asc" },
                  ],
                  take: BEST_LIMIT,
              })
            : null;
    const positions = new Map(
        (best ?? []).map((play, index) => [play.id, index + 1])
    );
    const where: Prisma.PlayDataWhereInput = {
        user_id: userId,
        score: { gt: 0 },
        ...(best ? { id: { in: best.map((play) => play.id) } } : {}),
    };
    const orderBy: Prisma.PlayDataOrderByWithRelationInput[] =
        query.sort === "score"
            ? [{ score: "desc" }, { [field]: "desc" }, { id: "asc" }]
            : query.sort === "recent"
              ? // 기록 시각(best_at, 2026-10-16 P4) — 시각 모름은 예전 「1970」 처럼 맨 뒤
                [{ bestAt: { sort: "desc", nulls: "last" } }, { id: "asc" }]
              : query.sort === "title"
                ? [{ chart: { music: { title: "asc" } } }, { id: "asc" }]
                : [
                      { [field]: "desc" },
                      { score: "desc" },
                      { chart_id: "asc" },
                      { id: "asc" },
                  ];
    const [total, plays] = await Promise.all([
        db.playData.count({ where }),
        db.playData.findMany({
            where,
            orderBy,
            skip: query.offset,
            take: PROFILE_RECORDS_PAGE_SIZE,
            select: {
                id: true,
                level: true,
                score: true,
                rank: true,
                fc_type: true,
                bestAt: true,
                grade_basic: true,
                grade_recital: true,
                // 곡 · 난이도는 채보 연결에서(2026-10-16 P5-1)
                chart: {
                    select: {
                        music_idx: true,
                        difficulty: true,
                        music: { select: { title: true, background: true } },
                    },
                },
            },
        }),
    ]);
    const ranks = await getChartRanks(plays.map((play) => play.id));
    return profileRecordsPayloadSchema.parse({
        query,
        total,
        hasMore: query.offset + plays.length < total,
        items: plays.map((play) => ({
            id: play.id,
            musicIndex: play.chart.music_idx,
            title: play.chart.music.title,
            background: play.chart.music.background,
            difficulty: play.chart.difficulty,
            level: play.level,
            score: play.score,
            rank: play.rank,
            fullCombo: play.fc_type >= 2,
            contribution: (play[field] ?? 0) > 0 ? play[field]! / 100 : null,
            playedAt: recordPlayedAt(play.bestAt),
            chartRank: ranks.get(play.id) ?? null,
            position: positions.get(play.id) ?? null,
        })),
    });
}
