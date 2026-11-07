import "server-only";

import {
    buildNostalgiaRecords,
    type NostalgiaRecordsInput,
} from "@/features/partner/server/nostalgia-records";
import type { PartnerShareItemName } from "@/features/partner/server/partner-outbox";
import { getCachedProfileData } from "@/features/profile/server/public-profile-data";
import db from "@/lib/db";

const RECENT_PLAY_LIMIT = 50;

/** 저장값(×100 정수) → 소수. 밖으로는 ×100 을 내보내지 않는다 */
function fromStoredGrade(value: number | null | undefined) {
    return typeof value === "number" && value > 0 ? value / 100 : null;
}

/**
 * GET /api/partner/v1/records/nostalgia 의 데이터. 공개 프로필과 같은 출처(공개 프로필 데이터 · 레이팅 표 · 플레이 이력)를 읽고,
 * 공개 설정과 사용자가 고른 항목은 봉투를 만들 때 적용한다.
 */
export async function loadNostalgiaRecords(input: {
    userId: number;
    subject: string;
    sharedItems: readonly PartnerShareItemName[];
    origin: string;
}) {
    const profile = await getCachedProfileData(input.userId);
    if (!profile) return null;
    const { user } = profile;
    const shareRecentPlays = input.sharedItems.includes("recent_plays");
    const [ratings, lastSync, plays, playTotal] = await Promise.all([
        db.playerRating.findMany({
            where: { userId: input.userId },
            select: { mode: true, rating: true },
        }),
        db.dataSync.findFirst({
            where: { userId: input.userId, status: "completed" },
            select: { completedAt: true },
            orderBy: { completedAt: "desc" },
        }),
        shareRecentPlays
            ? db.chartPlayHistory.findMany({
                  where: { userId: input.userId },
                  select: {
                      score: true,
                      gradeBasic: true,
                      playedAt: true,
                      level: true,
                      chart: {
                          select: {
                              difficulty: true,
                              level: true,
                              music: {
                                  select: {
                                      index: true,
                                      title: true,
                                      artist: true,
                                  },
                              },
                          },
                      },
                  },
                  orderBy: [{ playedAt: "desc" }, { id: "desc" }],
                  take: RECENT_PLAY_LIMIT,
              })
            : Promise.resolve([]),
        shareRecentPlays
            ? db.chartPlayHistory.count({ where: { userId: input.userId } })
            : Promise.resolve(0),
    ]);
    const rating = (mode: "basic" | "recital") => {
        const value = ratings.find((row) => row.mode === mode)?.rating;
        return typeof value === "number" && value > 0 ? value : null;
    };
    const ranks: NostalgiaRecordsInput["ranks"] = [];
    const pushRank = (
        mode: "basic" | "recital",
        scope: "domestic" | "global",
        rank: number | null
    ) => {
        if (rank) ranks.push({ mode, scope, rank });
    };
    pushRank("basic", "domestic", user.rank_basic_country);
    pushRank("basic", "global", user.rank_basic);
    pushRank("recital", "domestic", user.rank_recital_country);
    pushRank("recital", "global", user.rank_recital);

    return buildNostalgiaRecords({
        subject: input.subject,
        playerName: user.username ?? "NosLog player",
        // 고른 항목이 없거나 점수가 비공개면 사용자 번호가 든 주소를 넘기지 않는다 — 파트너가 sub 를 NosLog 계정과 잇지 못하게
        profileUrl:
            input.sharedItems.length > 0 && !user.hide_play_scores
                ? `${input.origin}/profile/${input.userId}`
                : input.origin,
        // 활동 비공개면 마지막 동기화 시각을 넘기지 않는다
        updatedAt:
            (!user.hide_play_activity && lastSync?.completedAt) ||
            new Date(user.created_at),
        scoresPublic: !user.hide_play_scores,
        activityPublic: !user.hide_play_activity,
        share: {
            summary: input.sharedItems.includes("summary"),
            ranks: input.sharedItems.includes("ranks"),
            songRecords: input.sharedItems.includes("song_records"),
            recentPlays: shareRecentPlays,
        },
        summary: {
            basic: {
                grade: fromStoredGrade(user.grade_basic),
                rating: rating("basic"),
            },
            recital: {
                grade: fromStoredGrade(user.grade_recital),
                rating: rating("recital"),
            },
        },
        ranks,
        recentPlays: {
            total: playTotal,
            items: plays.map((play) => ({
                musicIndex: play.chart.music.index,
                title: play.chart.music.title,
                artist: play.chart.music.artist,
                difficulty: play.chart.difficulty,
                level: play.level ?? play.chart.level,
                playedAt: play.playedAt,
                score: play.score,
                grdBasic: fromStoredGrade(play.gradeBasic),
                grdRecital: null,
            })),
        },
    });
}
