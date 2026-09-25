import "server-only";

import db from "@/lib/db";
import type { PinnedRecordInput } from "@/features/profile/schemas/pinnedRecordSchema";
import { PINNED_RECORD_LIMIT } from "@/features/profile/schemas/pinnedRecordSchema";
import type { ProfilePlay } from "@/features/profile/schemas/publicProfileSchema";
import {
    getChartRanks,
    recordPlayedAt,
} from "@/features/profile/server/profileRecordsService";

const playSelect = {
    id: true,
    chart_id: true,
    music_idx: true,
    difficulty: true,
    level: true,
    score: true,
    rank: true,
    fc_type: true,
    besttime: true,
    grade_basic: true,
    grade_recital: true,
    music: { select: { title: true, background: true } },
} as const;

export type ProfilePinnedRecord = ProfilePlay & {
    comment: string | null;
    /** 모드별 Grd 기여(베스트 성과 줄과 같은 값) — 0 이면 null */
    grades: { basic: number | null; recital: number | null };
};

/**
 * 프로필 개요 「고정 기록」(2026-09-26 S2) — 고른 채보의 지금 기록(고른 순서) · 한 줄 소감.
 * 고른 것이 없거나 고른 채보의 기록이 모두 사라졌으면 Basic 베스트 상위 3곡(auto)
 */
export async function getProfilePinnedRecords(userId: number) {
    const pins = await db.userPinnedRecord.findMany({
        where: { user_id: userId },
        orderBy: { position: "asc" },
        select: { chart_id: true, comment: true },
    });
    const pinnedPlays = pins.length
        ? await db.playData.findMany({
              where: {
                  user_id: userId,
                  chart_id: { in: pins.map((pin) => pin.chart_id) },
                  score: { gt: 0 },
              },
              select: playSelect,
          })
        : [];
    const byChart = new Map(pinnedPlays.map((play) => [play.chart_id, play]));
    const chosen = pins.flatMap((pin) => {
        const play = byChart.get(pin.chart_id);
        return play ? [{ play, comment: pin.comment }] : [];
    });
    const auto = !chosen.length;
    const rows = auto
        ? (
              await db.playData.findMany({
                  where: { user_id: userId, grade_basic: { gt: 0 } },
                  orderBy: [
                      { grade_basic: "desc" },
                      { score: "desc" },
                      { chart_id: "asc" },
                      { id: "asc" },
                  ],
                  take: PINNED_RECORD_LIMIT,
                  select: playSelect,
              })
          ).map((play) => ({ play, comment: null }))
        : chosen;
    const ranks = await getChartRanks(rows.map((row) => row.play.id));
    return {
        auto,
        items: rows.map(({ play, comment }): ProfilePinnedRecord => ({
            id: play.id,
            musicIndex: play.music_idx,
            title: play.music.title,
            background: play.music.background,
            difficulty: play.difficulty,
            level: play.level,
            score: play.score,
            rank: play.rank,
            fullCombo: play.fc_type >= 2,
            contribution: null,
            playedAt: recordPlayedAt(play.besttime),
            chartRank: ranks.get(play.id) ?? null,
            position: null,
            newBest: false,
            comment,
            grades: {
                basic: play.grade_basic > 0 ? play.grade_basic / 100 : null,
                recital:
                    (play.grade_recital ?? 0) > 0
                        ? play.grade_recital! / 100
                        : null,
            },
        })),
    };
}
export type ProfilePinnedRecords = Awaited<
    ReturnType<typeof getProfilePinnedRecords>
>;

/** 설정 창의 고를 수 있는 기록(점수가 있는 채보 전부) · 지금 고른 값 */
export async function getPinnableRecords(userId: number) {
    const [plays, pins] = await Promise.all([
        db.playData.findMany({
            where: {
                user_id: userId,
                score: { gt: 0 },
                chart_id: { not: null },
            },
            orderBy: [{ music: { title: "asc" } }, { level: "asc" }],
            select: {
                chart_id: true,
                music_idx: true,
                difficulty: true,
                level: true,
                score: true,
                music: { select: { title: true, background: true } },
            },
        }),
        db.userPinnedRecord.findMany({
            where: { user_id: userId },
            orderBy: { position: "asc" },
            select: { chart_id: true, comment: true },
        }),
    ]);
    return {
        records: plays.map((play) => ({
            chartId: play.chart_id!,
            musicIndex: play.music_idx,
            title: play.music.title,
            background: play.music.background,
            difficulty: play.difficulty,
            level: play.level,
            score: play.score,
        })),
        pins: pins.map((pin) => ({
            chartId: pin.chart_id,
            comment: pin.comment,
        })),
    };
}

/** 고정 기록 저장 — 점수가 있는 채보만, 고른 순서가 칸 순서. 통째로 바꾼다(빈 배열 = 자동) */
export async function setPinnedRecords(
    userId: number,
    items: readonly PinnedRecordInput[]
): Promise<{ status: "ok" } | { status: "not-played" }> {
    if (items.length) {
        const played = await db.playData.count({
            where: {
                user_id: userId,
                chart_id: { in: items.map((item) => item.chartId) },
                score: { gt: 0 },
            },
        });
        if (played !== items.length) return { status: "not-played" };
    }
    await db.$transaction([
        db.userPinnedRecord.deleteMany({ where: { user_id: userId } }),
        db.userPinnedRecord.createMany({
            data: items.map((item, index) => ({
                user_id: userId,
                chart_id: item.chartId,
                position: index + 1,
                comment: item.comment,
            })),
        }),
    ]);
    return { status: "ok" };
}
