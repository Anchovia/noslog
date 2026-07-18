import { formatToComma } from "@/lib/utils";

import type {
    ExamDashboardItem,
    ExamSimulationResult,
} from "./examDashboardTypes";
import { formatExamValue, getStageLabel } from "./examDashboardUtils";

interface ExamSimulationProps {
    exam: ExamDashboardItem;
    simulation: ExamSimulationResult;
}

// 현재 기록을 기준으로 검정 합격 진행도를 표시함
export default function ExamSimulation({
    exam,
    simulation,
}: ExamSimulationProps) {
    const { stages, totalValue, targetValue, progress, firstFailedStage } =
        simulation;

    return (
        <section className="bg-surface rounded-card px-3 py-2.5">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">합격 시뮬레이션</h2>
                {exam.scoringType === "score" ? (
                    <p className="text-text-secondary text-right text-xs tabular-nums">
                        누적 {formatExamValue(totalValue, exam.scoringType)} /{" "}
                        {formatExamValue(targetValue, exam.scoringType)}
                    </p>
                ) : null}
            </div>

            {exam.scoringType === "score" ? (
                <>
                    <div className="bg-surface-muted relative mt-2 h-2 rounded-full">
                        <div
                            className="bg-chart h-full rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                        {stages.map((stage, index) => (
                            <span
                                key={stage.id}
                                className="bg-text-primary absolute top-1/2 h-3 w-0.5 -translate-y-1/2"
                                style={{
                                    left: `${((index + 1) / stages.length) * 100}%`,
                                }}
                            />
                        ))}
                    </div>
                    <p className="text-text-secondary mt-1.5 text-xs">
                        {firstFailedStage ? (
                            <>
                                {getStageLabel(
                                    firstFailedStage,
                                    stages.indexOf(firstFailedStage),
                                    stages.length
                                )}{" "}
                                조건까지{" "}
                                <span className="text-danger">
                                    {formatToComma(
                                        Math.max(
                                            firstFailedStage.requiredValue -
                                                firstFailedStage.comparisonValue,
                                            0
                                        )
                                    )}
                                    점
                                </span>{" "}
                                더 필요
                            </>
                        ) : (
                            <span className="text-success">
                                현재 기록 기준 합격 조건을 충족합니다.
                            </span>
                        )}
                    </p>
                </>
            ) : (
                <p className="text-body-muted mt-3">
                    리사이틀 판정 포인트는 현재 동기화 데이터에서 제공되지 않아
                    자동 계산할 수 없습니다.
                </p>
            )}
        </section>
    );
}
