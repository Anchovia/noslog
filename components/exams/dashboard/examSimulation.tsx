import { formatNoteSuccessRate } from "@/lib/music/judgementStats";
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

// 현재 기록을 기준으로 검정 합격 진행도를 표시함
export default function ExamSimulation({
    exam,
    simulation,
}: ExamSimulationProps) {
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
                  label: "분석 준비 중",
                  className: "bg-surface-muted text-text-secondary",
              }
            : exam.isAchieved
              ? {
                    label: "합격 완료",
                    className: "bg-success/10 text-success",
                }
              : !canEnter
                ? {
                      label: "응시 조건 부족",
                      className: "bg-danger/10 text-danger",
                  }
                : isReady
                  ? {
                        label: "합격 가능",
                        className: "bg-success/10 text-success",
                    }
                  : {
                        label: "연습 필요",
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
                            ? "현재 베스트 기록을 기준으로 계산합니다."
                            : "공식 합격 조건을 기준으로 표시합니다."}
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
                            <p className="text-caption">최종 누적 점수</p>
                            <strong className="text-section mt-0.5 block tabular-nums">
                                {formatExamValue(totalValue, exam.scoringType)}
                            </strong>
                        </div>
                        <p className="text-caption text-right tabular-nums">
                            목표{" "}
                            {formatExamValue(targetValue, exam.scoringType)}
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
                            <p className="text-label">합격한 검정입니다.</p>
                        ) : !canEnter ? (
                            <>
                                <p className="text-label">
                                    요구 Grd.까지{" "}
                                    {formatToComma(
                                        Math.max(
                                            exam.requiredGrade -
                                                (exam.playerGrade ?? 0),
                                            0
                                        )
                                    )}{" "}
                                    필요
                                </p>
                                <p className="text-micro mt-1 opacity-80">
                                    현재 {formatToComma(exam.playerGrade ?? 0)}{" "}
                                    / 요구 {formatToComma(exam.requiredGrade)}
                                </p>
                            </>
                        ) : isReady ? (
                            <p className="text-label">
                                현재 베스트 기준으로 모든 점수 조건을
                                충족합니다.
                            </p>
                        ) : priorityStage ? (
                            <>
                                <p className="text-label">
                                    먼저 연습할 곡 ·{" "}
                                    {getStageLabel(
                                        priorityStage,
                                        stages.indexOf(priorityStage),
                                        stages.length
                                    )}
                                </p>
                                <p className="text-body mt-1 font-semibold">
                                    {priorityStage.title}
                                </p>
                                <p className="text-micro mt-1 opacity-80">
                                    연습 기준까지{" "}
                                    {formatToComma(
                                        priorityStage.individualGapValue
                                    )}
                                    점
                                    {priorityStage.weakestNote &&
                                    priorityStage.weakestNote.rate < 9000
                                        ? ` · 약한 음표 ${priorityStage.weakestNote.label} ${formatNoteSuccessRate(priorityStage.weakestNote.rate)}`
                                        : ""}
                                </p>
                            </>
                        ) : firstFailedStage ? (
                            <p className="text-label">
                                {getStageLabel(
                                    firstFailedStage,
                                    stages.indexOf(firstFailedStage),
                                    stages.length
                                )}{" "}
                                조건을 확인해주세요.
                            </p>
                        ) : (
                            <p className="text-label">
                                점수 조건을 확인해주세요.
                            </p>
                        )}
                    </div>
                </>
            ) : (
                <p className="text-body-muted mt-3">
                    Recital의 4개 평가 분야와 공식 합격 계산식은 추가 확인 후
                    제공할 예정입니다.
                </p>
            )}
        </section>
    );
}
