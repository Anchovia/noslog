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
    exam_basic: number | null;
    exam_recital: number | null;
    examAchievements: { exam: { mode: string; grade: number | null } }[];
}

export function getExamEligibility(
    exam: ExamEligibilityInput,
    player: ExamPlayerInput | null
) {
    if (exam.mode !== "basic" && exam.mode !== "recital") return "reference";
    if (!player) return "signed-out";

    const legacyGrade =
        exam.mode === "basic" ? player.exam_basic : player.exam_recital;
    const achievedGrades = player.examAchievements
        .filter(({ exam: achieved }) => achieved.mode === exam.mode)
        .map(({ exam: achieved }) => achieved.grade);
    const targetGrade = exam.grade;
    if (
        targetGrade !== null &&
        [legacyGrade, ...achievedGrades].some(
            (grade) => grade !== null && grade >= 1 && grade <= targetGrade
        )
    )
        return "achieved";

    const grade = normalizeStoredGrade(
        exam.mode === "basic" ? player.grade_basic : player.grade_recital
    );
    if (!player.nostalgia_name?.trim() || grade === null)
        return "sync-required";
    return grade >= exam.requiredGrade ? "eligible" : "insufficient";
}
