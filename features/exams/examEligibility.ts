import {
    getBestExamGrade,
    type ExamAchievementGrade,
} from "@/features/exams/examGrades";
import { normalizeStoredGrade } from "@/lib/utils";

interface ExamEligibilityInput {
    mode: string;
    grade: number | null;
    requiredGrade: number;
}

interface ExamPlayerInput {
    nostalgia_name: string | null;
    grade_basic: number | null;
    grade_recital: number | null;
    examAchievements: ExamAchievementGrade[];
}

export function getExamEligibility(
    exam: ExamEligibilityInput,
    player: ExamPlayerInput | null
) {
    if (exam.mode !== "basic" && exam.mode !== "recital") return "reference";
    if (!player) return "signed-out";

    // 같은 모드에서 이 급수 이상(숫자가 같거나 작음)에 합격했으면 이미 달성
    const bestGrade = getBestExamGrade(player.examAchievements, exam.mode);
    if (exam.grade !== null && bestGrade !== null && bestGrade <= exam.grade)
        return "achieved";

    const grade = normalizeStoredGrade(
        exam.mode === "basic" ? player.grade_basic : player.grade_recital
    );
    if (!player.nostalgia_name?.trim() || grade === null)
        return "sync-required";
    return grade >= exam.requiredGrade ? "eligible" : "insufficient";
}
