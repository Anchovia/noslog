import type { ExamStageItem } from "@/components/exams/dashboard/examDashboardTypes";

// 미플레이는 0점이 아니며 누적 비교에는 앞선 모든 단계의 기록이 필요함
export function getExamPractice(stages: ExamStageItem[]) {
    let availableTotal = 0;
    let missingCount = 0;
    const rows = stages.map((stage, index) => {
        if (stage.bestValue === null) missingCount += 1;
        else availableTotal += stage.bestValue;
        const cumulative = stage.requirementType === "cumulative";
        const comparison = cumulative
            ? missingCount === 0
                ? availableTotal
                : null
            : stage.bestValue;
        const previousThreshold =
            cumulative && index > 0 ? stages[index - 1].requiredValue : 0;
        const practiceTarget = Math.max(
            0,
            stage.requiredValue - previousThreshold
        );
        return {
            id: stage.id,
            best: stage.bestValue,
            comparison,
            gap:
                stage.bestValue === null
                    ? null
                    : Math.max(0, practiceTarget - stage.bestValue),
        };
    });
    return { rows, availableTotal, missingCount };
}
