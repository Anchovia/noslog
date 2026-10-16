import "server-only";

import type {
    ProfileListQuery,
    ProfileMode,
} from "@/features/profile/schemas/public-profile-schema";
import {
    PROFILE_BATCH_SIZE,
    profileListPayloadSchema,
} from "@/features/profile/schemas/public-profile-schema";
import {
    getChartRanks,
    recordPlayedAt,
} from "@/features/profile/server/profile-records-service";
import { calculateUserRating } from "@/features/rankings/server/player-rating-service";
import db from "@/lib/db";
import { formatKstPlayTime } from "@/lib/player-stats";
import { BASIC_RATING_MAX } from "@/lib/tiers/basic-rating";

const musicFields = { title: true, background: true } as const;
const playFields = {
    id: true,
    chart_id: true,
    level: true,
    score: true,
    rank: true,
    fc_type: true,
    grade_basic: true,
    grade_recital: true,
    bestAt: true,
    // 곡 · 난이도는 채보 연결에서(2026-10-16 P5-1)
    chart: {
        select: {
            music_idx: true,
            difficulty: true,
            music: { select: musicFields },
        },
    },
} as const;

/** 프로필 레이팅(기여 목록 · 이력) — 랭킹과 같은 계산 한 벌, 0 이면 「레이팅 없음」(2026-10-16 K3) */
export function getProfileRating(userId: number, mode: ProfileMode) {
    return calculateUserRating(userId, mode);
}

export async function getPublicProfilePlays(
    userId: number,
    query: ProfileListQuery,
    /** 본인이 자기 프로필을 볼 때 — 숨긴 플레이 활동도 본인에게는 보인다(2026-09-26 P1) */
    { owner = false }: { owner?: boolean } = {}
) {
    // Recheck visibility for every incremental request, including a previously
    // opened tab. Hidden history is never fetched or returned to other viewers.
    const user = await db.user.findUnique({
        where: { id: userId },
        select: { hide_play_activity: true },
    });
    if (!user) return null;
    if (query.kind === "recent") {
        if (user.hide_play_activity && !owner)
            return profileListPayloadSchema.parse({
                query,
                status: "hidden",
                items: [],
                hasMore: false,
            });
        const plays = await db.chartPlayHistory.findMany({
            where: { user_id: userId },
            select: {
                id: true,
                playedAt: true,
                score: true,
                best_score: true,
                rank: true,
                max_combo: true,
                judge_near: true,
                chart: {
                    select: {
                        difficulty: true,
                        level: true,
                        music_idx: true,
                        note_count: true,
                        music: { select: musicFields },
                    },
                },
            },
            orderBy: [{ playedAt: "desc" }, { id: "desc" }],
            skip: query.offset,
            take: query.limit + 1,
        });
        return profileListPayloadSchema.parse({
            query,
            status: "available",
            hasMore: plays.length > query.limit,
            items: plays.slice(0, query.limit).map((play) => ({
                id: play.id,
                musicIndex: play.chart.music_idx,
                title: play.chart.music.title,
                background: play.chart.music.background,
                difficulty: play.chart.difficulty,
                level: play.chart.level,
                score: play.score,
                rank: play.rank,
                // FC = NEAR 없는 풀콤보(무지개 F) — NEAR 섞인 풀콤보는 세지 않는다(2026-10-16 K1)
                fullCombo:
                    play.rank === "P" ||
                    (play.chart.note_count !== null &&
                        play.chart.note_count > 0 &&
                        play.max_combo >= play.chart.note_count &&
                        (play.judge_near ?? 0) === 0),
                contribution: null,
                playedAt: formatKstPlayTime(play.playedAt),
                // best_score = 그 판 직전까지의 최고 점수(첫 플레이는 0). 모르면 표시하지 않는다
                newBest:
                    play.best_score !== null && play.score > play.best_score,
            })),
        });
    }
    const field = query.mode === "basic" ? "grade_basic" : "grade_recital";
    if (query.metric === "grade") {
        const limit = 50;
        const plays =
            query.offset >= limit
                ? []
                : await db.playData.findMany({
                      where: { user_id: userId, [field]: { gt: 0 } },
                      select: playFields,
                      orderBy: [
                          { [field]: "desc" },
                          { score: "desc" },
                          { chart_id: "asc" },
                          { id: "asc" },
                      ],
                      skip: query.offset,
                      take: Math.min(
                          PROFILE_BATCH_SIZE + 1,
                          limit - query.offset
                      ),
                  });
        const shown = plays.slice(0, PROFILE_BATCH_SIZE);
        const ranks = await getChartRanks(shown.map((play) => play.id));
        return profileListPayloadSchema.parse({
            query,
            status: "available",
            hasMore: plays.length > PROFILE_BATCH_SIZE,
            items: shown.map((play, index) => ({
                id: play.id,
                musicIndex: play.chart.music_idx,
                title: play.chart.music.title,
                background: play.chart.music.background,
                difficulty: play.chart.difficulty,
                level: play.level,
                score: play.score,
                rank: play.rank,
                fullCombo: play.fc_type >= 2,
                contribution: (play[field] ?? 0) / 100,
                playedAt: recordPlayedAt(play.bestAt),
                chartRank: ranks.get(play.id) ?? null,
                position: query.offset + index + 1,
            })),
        });
    }
    const rating = await getProfileRating(userId, query.mode);
    if (!rating)
        return profileListPayloadSchema.parse({
            query,
            status: "unavailable",
            items: [],
            hasMore: false,
        });
    const selected = rating.contributions.slice(
        query.offset,
        query.offset + PROFILE_BATCH_SIZE
    );
    const plays = selected.length
        ? await db.playData.findMany({
              where: {
                  user_id: userId,
                  chart_id: { in: selected.map((item) => item.chartId) },
              },
              select: playFields,
          })
        : [];
    const byChart = new Map(plays.map((play) => [play.chart_id, play]));
    const ranks = await getChartRanks(plays.map((play) => play.id));
    return profileListPayloadSchema.parse({
        query,
        status: "available",
        hasMore:
            query.offset + PROFILE_BATCH_SIZE < rating.contributions.length,
        items: selected.flatMap((item) => {
            const play = byChart.get(item.chartId);
            return play
                ? [
                      {
                          id: play.id,
                          musicIndex: play.chart.music_idx,
                          title: play.chart.music.title,
                          background: play.chart.music.background,
                          difficulty: play.chart.difficulty,
                          level: play.level,
                          score: play.score,
                          rank: play.rank,
                          fullCombo: play.fc_type >= 2,
                          contribution:
                              (item.points / rating.theoreticalMax) *
                              BASIC_RATING_MAX,
                          playedAt: recordPlayedAt(play.bestAt),
                          chartRank: ranks.get(play.id) ?? null,
                      },
                  ]
                : [];
        }),
    });
}
