import ExamDashboard, {
    type ExamDashboardItem,
} from "@/components/exams/examDashboard";
import db from "@/lib/db";
import getSession from "@/lib/session";

export default async function ExamsPage() {
    const session = await getSession();
    const exams = await db.exam.findMany({
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
            achievements: {
                where: { userId: session.id ?? -1 },
                select: { id: true },
                take: 1,
            },
            submissions: {
                where: { userId: session.id ?? -1 },
                select: { status: true },
                orderBy: { submittedAt: "desc" },
                take: 1,
            },
        },
        orderBy: [{ mode: "asc" }, { grade: "desc" }, { id: "asc" }],
    });

    const user = session.id
        ? await db.user.findUnique({
              where: { id: session.id },
              select: {
                  grade_basic: true,
                  grade_recital: true,
                  exam_basic: true,
                  exam_recital: true,
              },
          })
        : null;
    const chartIds = [
        ...new Set(
            exams.flatMap((exam) =>
                exam.stages.flatMap((stage) =>
                    stage.allowedCharts.map((item) => item.chart.id)
                )
            )
        ),
    ];
    const records =
        session.id && chartIds.length > 0
            ? await db.playData.findMany({
                  where: { user_id: session.id, chart_id: { in: chartIds } },
                  select: { chart_id: true, score: true },
              })
            : [];
    const bestScoreByChart = new Map<number, number>();
    for (const record of records) {
        if (!record.chart_id) continue;
        bestScoreByChart.set(
            record.chart_id,
            Math.max(bestScoreByChart.get(record.chart_id) ?? 0, record.score)
        );
    }

    const items: ExamDashboardItem[] = exams.map((exam) => {
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
            isAchieved: exam.achievements.length > 0 || isLegacyAchievement,
            submissionStatus: exam.submissions[0]?.status ?? null,
            playerGrade:
                exam.mode === "recital"
                    ? (user?.grade_recital ?? null)
                    : (user?.grade_basic ?? null),
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
        <ExamDashboard exams={items} isAuthenticated={Boolean(session.id)} />
    );
}
