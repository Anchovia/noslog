import "server-only";
import type { ExamDashboardItem } from "@/components/exams/dashboard/examDashboardTypes";
import { getExamEligibility } from "@/features/exams/examEligibility";
import {
    getLocalizedMusicTitle,
    getMusicTitleDisplayPreference,
} from "@/lib/i18n/musicTitle";
import { getServerI18n } from "@/lib/i18n/server";
import getSession from "@/lib/session";
import { normalizeStoredGrade } from "@/lib/utils";
import {
    getCachedPublishedExams,
    getUserExamState,
} from "@/features/exams/server/examData";

export async function getPublicExamData() {
    const { locale, t } = await getServerI18n();
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
    const showLocalizedTitle = await getMusicTitleDisplayPreference(session.id);
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
    const recordByChart = new Map<number, (typeof records)[number]>();
    for (const record of records) {
        if (!record.chart_id) continue;
        recordByChart.set(record.chart_id, record);
    }

    const items: ExamDashboardItem[] = exams.map((exam) => {
        const latestSubmission = latestSubmissionByExam.get(exam.id);
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
                label: reward.label ?? reward.music?.title ?? t("exams.reward"),
                localizedTitle:
                    reward.music &&
                    (!reward.label || reward.label === reward.music.title)
                        ? getLocalizedMusicTitle(
                              reward.music,
                              locale,
                              showLocalizedTitle
                          )
                        : null,
                musicIndex: reward.music?.index ?? null,
            })),
            isAchieved:
                achievedExamIds.has(exam.id) ||
                getExamEligibility(exam, user) === "achieved",
            hasSyncedIdentity: Boolean(user?.nostalgia_name?.trim()),
            submissionStatus: latestSubmission?.status ?? null,
            submissionReviewerNote: latestSubmission?.reviewerNote ?? null,
            playerGrade:
                exam.mode === "recital"
                    ? normalizeStoredGrade(user?.grade_recital)
                    : normalizeStoredGrade(user?.grade_basic),
            stages: exam.stages.map((stage) => {
                const bestRecord = stage.allowedCharts
                    .map((item) => recordByChart.get(item.chart.id))
                    .filter((record): record is NonNullable<typeof record> =>
                        Boolean(record && record.play_count > 0)
                    )
                    .sort((a, b) => b.score - a.score)[0];

                return {
                    id: stage.id,
                    position: stage.position,
                    label: stage.label,
                    requirementType: stage.requirementType,
                    requiredValue: stage.requiredValue,
                    bestValue:
                        exam.scoringType === "score"
                            ? (bestRecord?.score ?? null)
                            : null,
                    bestRecord: bestRecord
                        ? {
                              score: bestRecord.score,
                              rank: bestRecord.rank,
                              fcType: bestRecord.fc_type,
                              maxCombo: bestRecord.max_combo,
                              judgeSjust: bestRecord.judge_sjust,
                              judgeJust: bestRecord.judge_just,
                              judgeGood: bestRecord.judge_good,
                              judgeMiss: bestRecord.judge_miss,
                              judgeNear: bestRecord.judge_near,
                              noteRateStandard: bestRecord.note_rate_standard,
                              noteRateTenuto: bestRecord.note_rate_tenuto,
                              noteRateGlissando: bestRecord.note_rate_glissando,
                              noteRateTrill: bestRecord.note_rate_trill,
                          }
                        : null,
                    musicIndex: stage.music.index,
                    title: stage.music.title,
                    localizedTitle: getLocalizedMusicTitle(
                        stage.music,
                        locale,
                        showLocalizedTitle
                    ),
                    artist: stage.music.artist,
                    charts: stage.allowedCharts
                        .map((item) => ({
                            chartId: item.chart.id,
                            difficulty: item.chart.difficulty,
                            level: item.chart.level,
                        }))
                        .sort((a, b) => a.level - b.level),
                };
            }),
        };
    });

    return { items, isAuthenticated: Boolean(session.id) };
}
