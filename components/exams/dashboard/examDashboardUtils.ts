import { formatToComma } from "@/lib/utils";

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

export function getModeText(mode: string) {
    if (mode === "recital") return "text-recital";
    if (mode === "basic") return "text-basic";
    return "text-text-primary";
}

export function getModeBadge(mode: string) {
    if (mode === "recital")
        return "border-recital/35 bg-recital/10 text-recital";
    if (mode === "basic") return "border-basic/35 bg-basic/10 text-basic";
    return "border-text-secondary/40 bg-surface text-text-primary";
}

export function getDifficultyBadge(difficulty: string) {
    const normalizedDifficulty = difficulty.toLowerCase();

    if (normalizedDifficulty === "normal") return "bg-normal/15 text-normal";
    if (normalizedDifficulty === "hard") return "bg-hard/15 text-hard";
    if (normalizedDifficulty === "expert") return "bg-expert/15 text-expert";
    return "bg-real/15 text-real";
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

export function formatExamValue(value: number, scoringType: string) {
    return scoringType === "recital_point"
        ? `${Number.isInteger(value) ? value : value.toFixed(1)}점`
        : formatToComma(value);
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

        return {
            ...stage,
            comparisonValue,
            isPassed:
                stage.bestValue === null
                    ? null
                    : comparisonValue >= stage.requiredValue,
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

    return {
        stages,
        totalValue,
        targetValue,
        progress:
            targetValue > 0
                ? Math.min((totalValue / targetValue) * 100, 100)
                : 0,
        firstFailedStage: stages.find((stage) => stage.isPassed === false),
    };
}
