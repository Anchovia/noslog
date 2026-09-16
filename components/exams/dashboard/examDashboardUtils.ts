import type {
    ExamDashboardItem,
    ExamSimulationResult,
    ExamStageItem,
} from "./examDashboardTypes";

export function canEnterExam(exam: ExamDashboardItem) {
    return (
        exam.requiredGrade === 0 ||
        (exam.playerGrade !== null && exam.playerGrade >= exam.requiredGrade)
    );
}

export function getDefaultExam(exams: ExamDashboardItem[]) {
    return (
        exams.find((exam) => !exam.isAchieved && canEnterExam(exam)) ??
        exams.find((exam) => !exam.isAchieved) ??
        exams.at(-1) ??
        null
    );
}

export function getStageLabel(
    stage: ExamStageItem,
    index: number,
    length: number
) {
    if (stage.label) return stage.label;
    if (index === length - 1) return "Fin";
    return index === 0 ? "1st" : index === 1 ? "2nd" : "3rd";
}

export function calculateExamSimulation(
    exam: ExamDashboardItem
): ExamSimulationResult {
    const stages = exam.stages.map((stage, index) => {
        const accumulatedValue = exam.stages
            .slice(0, index + 1)
            .reduce((total, item) => total + (item.bestValue ?? 0), 0);
        const comparisonValue =
            stage.requirementType === "cumulative"
                ? accumulatedValue
                : (stage.bestValue ?? 0);
        const previousRequiredValue =
            index > 0 &&
            stage.requirementType === "cumulative" &&
            exam.stages[index - 1]?.requirementType === "cumulative"
                ? exam.stages[index - 1].requiredValue
                : index > 0 && stage.requirementType === "cumulative"
                  ? (exam.stages[index - 1]?.requiredValue ?? 0)
                  : 0;
        const individualTargetValue = Math.max(
            stage.requiredValue - previousRequiredValue,
            0
        );
        const individualGapValue = Math.max(
            individualTargetValue - (stage.bestValue ?? 0),
            0
        );
        const noteRates = [
            {
                label: "일반",
                rate: stage.bestRecord?.noteRateStandard ?? null,
            },
            {
                label: "테누토",
                rate: stage.bestRecord?.noteRateTenuto ?? null,
            },
            {
                label: "글리산도",
                rate: stage.bestRecord?.noteRateGlissando ?? null,
            },
            {
                label: "트릴",
                rate: stage.bestRecord?.noteRateTrill ?? null,
            },
        ]
            .filter(
                (item): item is { label: string; rate: number } =>
                    item.rate !== null && item.rate >= 0
            )
            .sort((a, b) => a.rate - b.rate);

        return {
            ...stage,
            comparisonValue,
            isPassed:
                stage.bestValue === null
                    ? null
                    : comparisonValue >= stage.requiredValue,
            individualTargetValue,
            individualGapValue,
            weakestNote: noteRates[0] ?? null,
        };
    });
    const finalStage = stages.at(-1);
    const totalValue = stages.reduce(
        (total, stage) => total + (stage.bestValue ?? 0),
        0
    );
    const targetValue = finalStage
        ? finalStage.requirementType === "cumulative"
            ? finalStage.requiredValue
            : stages.reduce((total, stage) => total + stage.requiredValue, 0)
        : 0;
    const hasAnyPlayedStage = stages.some(
        (stage) => stage.bestValue !== null && stage.bestValue > 0
    );
    const priorityStage = hasAnyPlayedStage
        ? [...stages]
              .filter(
                  (stage) =>
                      stage.bestValue !== null && stage.individualGapValue > 0
              )
              .sort(
                  (a, b) =>
                      b.individualGapValue - a.individualGapValue ||
                      a.position - b.position
              )[0]
        : stages.find(
              (stage) =>
                  stage.bestValue !== null && stage.individualGapValue > 0
          );

    return {
        stages,
        totalValue,
        targetValue,
        progress:
            targetValue > 0
                ? Math.min((totalValue / targetValue) * 100, 100)
                : 0,
        firstFailedStage: stages.find((stage) => stage.isPassed === false),
        priorityStage,
    };
}
