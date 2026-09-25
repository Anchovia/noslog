import "server-only";

import db from "@/lib/db";
import {
    getChartRanks,
    recordPlayedAt,
} from "@/features/profile/server/profileRecordsService";
import { getModePianistRatingBasis } from "@/features/tiers/server/tierBrowserData";
import {
    BASIC_RATING_ACTIVE_CURVE,
    BASIC_RATING_MAX,
    BASIC_RATING_SCORE_FLOOR,
    calculateBasicRating,
} from "@/lib/tiers/basicRating";
import {
    PROFILE_BATCH_SIZE,
    profileListPayloadSchema,
} from "@/features/profile/schemas/publicProfileSchema";
import type {
    ProfileListQuery,
    ProfileMode,
} from "@/features/profile/schemas/publicProfileSchema";

const musicFields = { title: true, background: true } as const;
const playFields = {
    id: true,
    chart_id: true,
    music_idx: true,
    difficulty: true,
    level: true,
    score: true,
    rank: true,
    fc_type: true,
    grade_basic: true,
    grade_recital: true,
    besttime: true,
    music: { select: musicFields },
} as const;

export async function getProfileRating(userId: number, mode: ProfileMode) {
    if (mode === "recital") {
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { grade_recital: true },
        });
        if (user?.grade_recital == null) return null;
    }
    const basis = await getModePianistRatingBasis(mode);
    if (
        !basis.theoreticalMax ||
        basis.entries.some(
            (entry) =>
                !Number.isFinite(entry.value) ||
                entry.value < 1 ||
                entry.value > 14.5
        ) ||
        new Set(basis.entries.map((entry) => entry.chartId)).size !==
            basis.entries.length
    )
        return null;
    const constants = new Map(
        basis.entries.map((entry) => [entry.chartId, entry.value])
    );
    const plays = await db.playData.findMany({
        where: {
            user_id: userId,
            chart_id: { in: [...constants.keys()] },
            score: { gte: BASIC_RATING_SCORE_FLOOR },
            ...(mode === "recital" ? { grade_recital: { gt: 0 } } : {}),
        },
        select: { chart_id: true, score: true },
    });
    return calculateBasicRating(
        plays.flatMap((play) =>
            play.chart_id === null
                ? []
                : [
                      {
                          chartId: play.chart_id,
                          score: play.score,
                          tierConstant: constants.get(play.chart_id)!,
                      },
                  ]
        ),
        basis.theoreticalMax,
        BASIC_RATING_ACTIVE_CURVE
    );
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
                source_play_time: true,
                score: true,
                best_score: true,
                rank: true,
                max_combo: true,
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
            orderBy: [{ source_play_time: "desc" }, { id: "desc" }],
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
                fullCombo:
                    play.rank === "P" ||
                    (play.chart.note_count !== null &&
                        play.chart.note_count > 0 &&
                        play.max_combo >= play.chart.note_count),
                contribution: null,
                playedAt: play.source_play_time,
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
                musicIndex: play.music_idx,
                title: play.music.title,
                background: play.music.background,
                difficulty: play.difficulty,
                level: play.level,
                score: play.score,
                rank: play.rank,
                fullCombo: play.fc_type >= 2,
                contribution: (play[field] ?? 0) / 100,
                playedAt: recordPlayedAt(play.besttime),
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
                          musicIndex: play.music_idx,
                          title: play.music.title,
                          background: play.music.background,
                          difficulty: play.difficulty,
                          level: play.level,
                          score: play.score,
                          rank: play.rank,
                          fullCombo: play.fc_type >= 2,
                          contribution:
                              (item.points / rating.theoreticalMax) *
                              BASIC_RATING_MAX,
                          playedAt: recordPlayedAt(play.besttime),
                          chartRank: ranks.get(play.id) ?? null,
                      },
                  ]
                : [];
        }),
    });
}
