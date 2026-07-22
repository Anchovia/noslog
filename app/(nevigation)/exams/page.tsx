import ExamDashboard, {
    type ExamDashboardItem,
} from "@/components/exams/examDashboard";
import { createPageMetadata } from "@/lib/metadata/site";
import getSession from "@/lib/session";
import { normalizeStoredGrade } from "@/lib/utils";
import { getCachedPublishedExams, getUserExamState } from "./data";

export const metadata = createPageMetadata({
    title: "검정",
    description:
        "노스텔지어 Basic·Recital·Event 검정의 과제곡, 응시 조건, 합격 기준과 보상을 확인합니다.",
    path: "/exams",
});

export default async function ExamsPage() {
    const [session, exams] = await Promise.all([
        getSession(),
        getCachedPublishedExams(),
    ]);
    const chartIds = [
        ...new Set(
            exams.flatMap((exam) =>
                exam.stages.flatMap((stage) =>
                    stage.allowedCharts.map((item) => item.chart.id)
                )
            )
        ),
    ];
    const userState = session.id
        ? await getUserExamState(
              session.id,
              exams.map((exam) => exam.id),
              chartIds
          )
        : null;
    const user = userState?.user ?? null;
    const records = userState?.records ?? [];
    const achievedExamIds = new Set(
        userState?.achievements.map((item) => item.examId) ?? []
    );
    const latestSubmissionByExam = new Map<
        number,
        { status: string; reviewerNote: string | null }
    >();
    for (const submission of userState?.submissions ?? []) {
        if (!latestSubmissionByExam.has(submission.examId)) {
            latestSubmissionByExam.set(submission.examId, {
                status: submission.status,
                reviewerNote: submission.reviewerNote,
            });
        }
    }
    const bestScoreByChart = new Map<number, number>();
    for (const record of records) {
        if (!record.chart_id) continue;
        bestScoreByChart.set(
            record.chart_id,
            Math.max(bestScoreByChart.get(record.chart_id) ?? 0, record.score)
        );
    }

    const items: ExamDashboardItem[] = exams.map((exam) => {
        const latestSubmission = latestSubmissionByExam.get(exam.id);
        const legacyGrade =
            exam.mode === "basic"
                ? user?.exam_basic
                : exam.mode === "recital"
                  ? user?.exam_recital
                  : null;
        const isLegacyAchievement =
            exam.grade !== null &&
            legacyGrade !== null &&
            legacyGrade !== undefined &&
            exam.grade >= legacyGrade;

        return {
            id: exam.id,
            slug: exam.slug,
            mode: exam.mode,
            scoringType: exam.scoringType,
            grade: exam.grade,
            shortLabel: exam.shortLabel,
            title: exam.title,
            description: exam.description,
            feeNos: exam.feeNos,
            requiredGrade: exam.requiredGrade,
            rewards: exam.rewards.map((reward) => ({
                id: reward.id,
                type: reward.type,
                label: reward.label ?? reward.music?.title ?? "보상",
                musicIndex: reward.music?.index ?? null,
            })),
            isAchieved: achievedExamIds.has(exam.id) || isLegacyAchievement,
            submissionStatus: latestSubmission?.status ?? null,
            submissionReviewerNote: latestSubmission?.reviewerNote ?? null,
            playerGrade:
                exam.mode === "recital"
                    ? normalizeStoredGrade(user?.grade_recital)
                    : normalizeStoredGrade(user?.grade_basic),
            stages: exam.stages.map((stage) => ({
                id: stage.id,
                position: stage.position,
                label: stage.label,
                requirementType: stage.requirementType,
                requiredValue: stage.requiredValue,
                bestValue:
                    exam.scoringType === "score"
                        ? Math.max(
                              0,
                              ...stage.allowedCharts.map(
                                  (item) =>
                                      bestScoreByChart.get(item.chart.id) ?? 0
                              )
                          )
                        : null,
                musicIndex: stage.music.index,
                title: stage.music.title,
                artist: stage.music.artist,
                charts: stage.allowedCharts
                    .map((item) => ({
                        chartId: item.chart.id,
                        difficulty: item.chart.difficulty,
                        level: item.chart.level,
                    }))
                    .sort((a, b) => a.level - b.level),
            })),
        };
    });

    return (
        <div className="flex flex-col gap-3 px-4 py-3">
            <h1 className="text-title">검정</h1>
            <ExamDashboard
                exams={items}
                isAuthenticated={Boolean(session.id)}
            />
        </div>
    );
}
