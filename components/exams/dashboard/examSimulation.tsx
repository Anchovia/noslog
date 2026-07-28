import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import { formatNoteSuccessRate } from "@/lib/music/judgementStats";
import type { MessageKey } from "@/lib/i18n/messages";
import { cn, formatToComma } from "@/lib/utils";

import type {
    ExamDashboardItem,
    ExamSimulationResult,
} from "./examDashboardTypes";
import {
    canEnterExam,
    formatExamValue,
    getModeBadge,
    getStageLabel,
} from "./examDashboardUtils";

interface ExamSimulationProps {
    exam: ExamDashboardItem;
    simulation: ExamSimulationResult;
}

function getNoteLabelKey(label: string): MessageKey {
    if (label === "테누토") return "music.filter.tenuto";
    if (label === "글리산도") return "music.filter.glissando";
    if (label === "트릴") return "music.filter.trill";
    return "music.filter.standard";
}

// 현재 기록을 기준으로 검정 합격 진행도를 표시함
export default function ExamSimulation({
    exam,
    simulation,
}: ExamSimulationProps) {
    const locale = useLocale();
    const t = useTranslations();
    const {
        stages,
        totalValue,
        targetValue,
        progress,
        firstFailedStage,
        priorityStage,
    } = simulation;
    const canEnter = canEnterExam(exam);
    const isReady =
        stages.length > 0 &&
        stages.every((stage) => stage.isPassed === true) &&
        canEnter;
    const status =
        exam.scoringType !== "score"
            ? {
                  label: t("exams.simulation.preparing"),
                  className: "bg-surface-muted text-text-secondary",
              }
            : exam.isAchieved
              ? {
                    label: t("exams.simulation.passed"),
                    className: "bg-success/10 text-success",
                }
              : !canEnter
                ? {
                      label: t("exams.simulation.notEligible"),
                      className: "bg-danger/10 text-danger",
                  }
                : isReady
                  ? {
                        label: t("exams.simulation.ready"),
                        className: "bg-success/10 text-success",
                    }
                  : {
                        label: t("exams.simulation.practice"),
                        className: "bg-score/10 text-score",
                    };

    return (
        <section className="bg-surface rounded-card p-4">
            <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <span
                        className={cn(
                            "mb-1 inline-flex rounded border px-1.5 py-0.5 text-[10px] font-bold",
                            getModeBadge(exam.mode)
                        )}
                    >
                        {exam.shortLabel}
                    </span>
                    <h2 className="text-section truncate">{exam.title}</h2>
                    <p className="text-caption mt-1">
                        {exam.scoringType === "score"
                            ? t("exams.simulation.bestBasis")
                            : t("exams.simulation.officialBasis")}
                    </p>
                </div>
                <span
                    className={`${status.className} shrink-0 rounded-full px-2 py-1 text-xs font-semibold`}
                >
                    {status.label}
                </span>
            </header>

            {exam.scoringType === "score" ? (
                <>
                    <div className="mt-4 flex items-end justify-between gap-3">
                        <div>
                            <p className="text-caption">
                                {t("exams.simulation.total")}
                            </p>
                            <strong className="text-section mt-0.5 block tabular-nums">
                                {formatExamValue(
                                    totalValue,
                                    exam.scoringType,
                                    locale
                                )}
                            </strong>
                        </div>
                        <p className="text-caption text-right tabular-nums">
                            {t("exams.simulation.target", {
                                value: formatExamValue(
                                    targetValue,
                                    exam.scoringType,
                                    locale
                                ),
                            })}
                        </p>
                    </div>
                    <div className="bg-surface-muted mt-2 h-2 overflow-hidden rounded-full">
                        <div
                            className={cn(
                                "h-full rounded-full",
                                isReady ? "bg-success" : "bg-basic"
                            )}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div
                        className={cn(
                            "mt-3 rounded-md px-3 py-2.5",
                            exam.isAchieved || isReady
                                ? "bg-success/5 text-success"
                                : !canEnter
                                  ? "bg-danger/5 text-danger"
                                  : "bg-score/5 text-score"
                        )}
                    >
                        {exam.isAchieved ? (
                            <p className="text-label">
                                {t("exams.simulation.alreadyPassed")}
                            </p>
                        ) : !canEnter ? (
                            <>
                                <p className="text-label">
                                    {t("exams.simulation.gradeNeeded", {
                                        value: formatToComma(
                                            Math.max(
                                                exam.requiredGrade -
                                                    (exam.playerGrade ?? 0),
                                                0
                                            )
                                        ),
                                    })}
                                </p>
                                <p className="text-micro mt-1 opacity-80">
                                    {t("exams.simulation.gradeProgress", {
                                        current: formatToComma(
                                            exam.playerGrade ?? 0
                                        ),
                                        required: formatToComma(
                                            exam.requiredGrade
                                        ),
                                    })}
                                </p>
                            </>
                        ) : isReady ? (
                            <p className="text-label">
                                {t("exams.simulation.allMet")}
                            </p>
                        ) : priorityStage ? (
                            <>
                                <p className="text-label">
                                    {t("exams.simulation.practiceFirst", {
                                        stage: getStageLabel(
                                            priorityStage,
                                            stages.indexOf(priorityStage),
                                            stages.length
                                        ),
                                    })}
                                </p>
                                {priorityStage.localizedTitle ? (
                                    <p className="text-micro mt-1 truncate">
                                        {priorityStage.localizedTitle}
                                    </p>
                                ) : null}
                                <p className="text-body mt-1 font-semibold">
                                    {priorityStage.title}
                                </p>
                                <p className="text-micro mt-1 opacity-80">
                                    {t("exams.simulation.practiceGap", {
                                        value: formatToComma(
                                            priorityStage.individualGapValue
                                        ),
                                    })}
                                    {priorityStage.weakestNote &&
                                    priorityStage.weakestNote.rate < 9000
                                        ? ` · ${t("exams.simulation.weakNote", {
                                              note: t(
                                                  getNoteLabelKey(
                                                      priorityStage.weakestNote
                                                          .label
                                                  )
                                              ),
                                              rate: formatNoteSuccessRate(
                                                  priorityStage.weakestNote.rate
                                              ),
                                          })}`
                                        : ""}
                                </p>
                            </>
                        ) : firstFailedStage ? (
                            <p className="text-label">
                                {t("exams.simulation.checkStage", {
                                    stage: getStageLabel(
                                        firstFailedStage,
                                        stages.indexOf(firstFailedStage),
                                        stages.length
                                    ),
                                })}
                            </p>
                        ) : (
                            <p className="text-label">
                                {t("exams.simulation.checkScore")}
                            </p>
                        )}
                    </div>
                </>
            ) : (
                <p className="text-body-muted mt-3">
                    {t("exams.simulation.recitalPending")}
                </p>
            )}
        </section>
    );
}
