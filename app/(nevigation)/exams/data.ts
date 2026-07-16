import { CACHE_TAGS } from "@/lib/cacheTags";
import db from "@/lib/db";
import { unstable_cache } from "next/cache";

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
                        music: { select: { index: true, title: true } },
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
                            select: { index: true, title: true, artist: true },
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
    ["published-exams"],
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
    const [user, records, achievements, submissions] = await Promise.all([
        db.user.findUnique({
            where: { id: userId },
            select: {
                grade_basic: true,
                grade_recital: true,
                exam_basic: true,
                exam_recital: true,
            },
        }),
        chartIds.length > 0
            ? db.playData.findMany({
                  where: { user_id: userId, chart_id: { in: chartIds } },
                  select: { chart_id: true, score: true },
              })
            : Promise.resolve([]),
        examIds.length > 0
            ? db.examAchievement.findMany({
                  where: { userId, examId: { in: examIds } },
                  select: { examId: true },
              })
            : Promise.resolve([]),
        examIds.length > 0
            ? db.examSubmission.findMany({
                  where: { userId, examId: { in: examIds } },
                  select: { examId: true, status: true },
                  orderBy: { submittedAt: "desc" },
              })
            : Promise.resolve([]),
    ]);

    return { user, records, achievements, submissions };
}
