import "server-only";

import { unstable_cache } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-tags";
import db from "@/lib/db";
import { STATS_GRADE_SELECT, withStatsGrades } from "@/lib/player-stats";

// 검정 정의, 과제곡과 보상은 모든 사용자에게 동일하므로 캐시함
export const getCachedPublishedExams = unstable_cache(
    async () =>
        db.exam.findMany({
            where: { status: "published" },
            select: {
                id: true,
                slug: true,
                mode: true,
                scoringType: true,
                grade: true,
                shortLabel: true,
                title: true,
                description: true,
                feeNos: true,
                requiredGrade: true,
                rewards: {
                    select: {
                        id: true,
                        type: true,
                        label: true,
                        music: {
                            select: {
                                index: true,
                                title: true,
                                titleKana: true,
                                translations: {
                                    where: {
                                        status: "approved",
                                        locale: { in: ["ko", "en"] },
                                    },
                                    select: {
                                        locale: true,
                                        title: true,
                                        status: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: { position: "asc" },
                },
                stages: {
                    select: {
                        id: true,
                        position: true,
                        label: true,
                        requirementType: true,
                        requiredValue: true,
                        music: {
                            select: {
                                index: true,
                                title: true,
                                titleKana: true,
                                artist: true,
                                translations: {
                                    where: {
                                        status: "approved",
                                        locale: { in: ["ko", "en"] },
                                    },
                                    select: {
                                        locale: true,
                                        title: true,
                                        status: true,
                                    },
                                },
                            },
                        },
                        allowedCharts: {
                            select: {
                                chart: {
                                    select: {
                                        id: true,
                                        difficulty: true,
                                        level: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: { position: "asc" },
                },
            },
            orderBy: [{ mode: "asc" }, { grade: "desc" }, { id: "asc" }],
        }),
    ["published-exams", "i18n-v1"],
    {
        revalidate: 3600,
        tags: [CACHE_TAGS.exams],
    }
);

// 합격, 심사, 플레이 기록은 로그인 사용자마다 달라 공유 캐시하지 않음
export async function getUserExamState(
    userId: number,
    examIds: number[],
    chartIds: number[]
) {
    const [userRow, records, submissions] = await Promise.all([
        db.user.findUnique({
            where: { id: userId },
            select: {
                // 지금 Grd 는 player_stats 에서(2026-10-16 DB 재설계 P4)
                stats: { select: STATS_GRADE_SELECT },
                nostalgiaName: true,
                // 합격 기록은 여기서 한 번만 읽는다 — 이 검정들의 합격 여부도 이 목록에서(2026-10-15 S6)
                examAchievements: {
                    select: {
                        examId: true,
                        exam: { select: { mode: true, grade: true } },
                    },
                },
            },
        }),
        chartIds.length > 0
            ? db.playData.findMany({
                  where: { userId: userId, chartId: { in: chartIds } },
                  select: {
                      chartId: true,
                      score: true,
                      rank: true,
                      fcType: true,
                      playCount: true,
                      maxCombo: true,
                      judgeSjust: true,
                      judgeJust: true,
                      judgeGood: true,
                      judgeMiss: true,
                      judgeNear: true,
                      noteRateStandard: true,
                      noteRateTenuto: true,
                      noteRateGlissando: true,
                      noteRateTrill: true,
                  },
              })
            : Promise.resolve([]),
        examIds.length > 0
            ? db.examSubmission.findMany({
                  where: { userId, examId: { in: examIds } },
                  select: {
                      examId: true,
                      status: true,
                      reviewNote: true,
                  },
                  orderBy: { submittedAt: "desc" },
              })
            : Promise.resolve([]),
    ]);
    const user = userRow && withStatsGrades(userRow);

    const wanted = new Set(examIds);
    const achievements =
        user?.examAchievements.filter((item) => wanted.has(item.examId)) ?? [];
    return { user, records, achievements, submissions };
}
