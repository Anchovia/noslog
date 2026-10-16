import "server-only";

import type { PinnedRecordInput } from "@/features/profile/schemas/pinned-record-schema";
import { PINNED_RECORD_LIMIT } from "@/features/profile/schemas/pinned-record-schema";
import type { ProfilePlay } from "@/features/profile/schemas/public-profile-schema";
import {
    getChartRanks,
    recordPlayedAt,
} from "@/features/profile/server/profile-records-service";
import db from "@/lib/db";
import { hasFullComboLamp } from "@/lib/music/clear-mark";

// 곡 · 난이도는 채보 연결에서(2026-10-16 P5-1 — PlayData 의 곡 사본 열은 지운다)
const chartMusicSelect = {
    select: {
        musicIdx: true,
        difficulty: true,
        music: { select: { title: true, background: true } },
    },
} as const;

const playSelect = {
    id: true,
    chartId: true,
    level: true,
    score: true,
    rank: true,
    fcType: true,
    bestAt: true,
    gradeBasic: true,
    gradeRecital: true,
    chart: chartMusicSelect,
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
        where: { userId: userId },
        orderBy: { position: "asc" },
        select: { chartId: true, comment: true },
    });
    const pinnedPlays = pins.length
        ? await db.playData.findMany({
              where: {
                  userId: userId,
                  chartId: { in: pins.map((pin) => pin.chartId) },
                  score: { gt: 0 },
              },
              select: playSelect,
          })
        : [];
    const byChart = new Map(pinnedPlays.map((play) => [play.chartId, play]));
    const chosen = pins.flatMap((pin) => {
        const play = byChart.get(pin.chartId);
        return play ? [{ play, comment: pin.comment }] : [];
    });
    const auto = !chosen.length;
    const rows = auto
        ? (
              await db.playData.findMany({
                  where: { userId: userId, gradeBasic: { gt: 0 } },
                  orderBy: [
                      { gradeBasic: "desc" },
                      { score: "desc" },
                      { chartId: "asc" },
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
            musicIndex: play.chart.musicIdx,
            title: play.chart.music.title,
            background: play.chart.music.background,
            difficulty: play.chart.difficulty,
            level: play.level,
            score: play.score,
            rank: play.rank,
            fullCombo: hasFullComboLamp(play.fcType),
            contribution: null,
            playedAt: recordPlayedAt(play.bestAt),
            chartRank: ranks.get(play.id) ?? null,
            position: null,
            newBest: false,
            comment,
            grades: {
                basic: play.gradeBasic > 0 ? play.gradeBasic / 100 : null,
                recital:
                    (play.gradeRecital ?? 0) > 0
                        ? play.gradeRecital! / 100
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
            where: { userId: userId, score: { gt: 0 } },
            orderBy: [{ chart: { music: { title: "asc" } } }, { level: "asc" }],
            select: {
                chartId: true,
                level: true,
                score: true,
                chart: chartMusicSelect,
            },
        }),
        db.userPinnedRecord.findMany({
            where: { userId: userId },
            orderBy: { position: "asc" },
            select: { chartId: true, comment: true },
        }),
    ]);
    return {
        records: plays.map((play) => ({
            chartId: play.chartId,
            musicIndex: play.chart.musicIdx,
            title: play.chart.music.title,
            background: play.chart.music.background,
            difficulty: play.chart.difficulty,
            level: play.level,
            score: play.score,
        })),
        pins: pins.map((pin) => ({
            chartId: pin.chartId,
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
                userId: userId,
                chartId: { in: items.map((item) => item.chartId) },
                score: { gt: 0 },
            },
        });
        if (played !== items.length) return { status: "not-played" };
    }
    await db.$transaction([
        db.userPinnedRecord.deleteMany({ where: { userId: userId } }),
        db.userPinnedRecord.createMany({
            data: items.map((item, index) => ({
                userId: userId,
                chartId: item.chartId,
                position: index + 1,
                comment: item.comment,
            })),
        }),
    ]);
    return { status: "ok" };
}
