import "server-only";

import { getProfileRatingStanding } from "@/features/rankings/server/global-ranking-data";
import db from "@/lib/db";

/** 개요 — 기록이 하나라도 있는지만(2026-10-15 S6: 화면이 쓰지 않던 레이팅 · 판정 합계 · 동기화 상태 계산을 뺌) */
export async function getProfileOverviewContext(userId: number) {
    const record = await db.playData.findFirst({
        where: { userId: userId, playCount: { gt: 0 } },
        select: { id: true },
    });
    return { hasRecords: record !== null };
}
export type ProfileOverviewContext = Awaited<
    ReturnType<typeof getProfileOverviewContext>
>;

/** 프로필 머리(2026-09-25 H3 · K2) — 모드별 레이팅 · 레이팅 순위(랭킹 캐시), 본인에게만 마지막 동기화 상태 */
export async function getProfileHeaderContext(
    userId: number,
    isOwner: boolean,
    country: string | null = null
) {
    // 레이팅 값은 순위 상자가 랭킹 캐시에서 함께 받는다 — 따로 계산하지 않는다(2026-10-15 S6)
    const [basicStanding, recitalStanding, sync] = await Promise.all([
        // 수치 상자 레이팅 순위(2026-09-26 T1) — 랭킹 페이지 캐시에서
        getProfileRatingStanding(userId, "basic", country),
        getProfileRatingStanding(userId, "recital", country),
        isOwner
            ? db.dataSync.findFirst({
                  where: { userId: userId },
                  orderBy: [{ startedAt: "desc" }, { id: "desc" }],
                  select: {
                      status: true,
                      startedAt: true,
                      completedAt: true,
                      errorMessage: true,
                  },
              })
            : null,
    ]);
    return {
        ratingStandings: { basic: basicStanding, recital: recitalStanding },
        sync: sync
            ? {
                  status:
                      sync.status === "completed" && sync.errorMessage
                          ? "partial"
                          : sync.status,
                  startedAt: sync.startedAt.toISOString(),
                  completedAt: sync.completedAt?.toISOString() ?? null,
              }
            : null,
    };
}
export type ProfileHeaderContext = Awaited<
    ReturnType<typeof getProfileHeaderContext>
>;
