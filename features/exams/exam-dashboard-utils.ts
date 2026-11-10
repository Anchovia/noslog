import type {
    ExamDashboardItem,
    ExamStageItem,
} from "@/features/exams/types/exam-dashboard";

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
