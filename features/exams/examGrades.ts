export type ExamGradeMode = "basic" | "recital";

export interface ExamAchievementGrade {
    exam: { mode: string; grade: number | null };
}

// 합격 기록에서 급수를 읽을 때 쓰는 select — 프로필·랭킹·검정 자격 판정이 같은 모양을 받는다
export const examAchievementGradeSelect = {
    select: { exam: { select: { mode: true, grade: true } } },
} as const;

/**
 * 모드별 가장 좋은 합격 급수. 급수는 10 → 1 로 올라가므로 숫자가 가장 작은 값이다.
 * 합격 기록(관리자가 승인한 검정 인증)이 유일한 출처이며, 없으면 null.
 */
export function getBestExamGrade(
    achievements: readonly ExamAchievementGrade[],
    mode: ExamGradeMode
): number | null {
    let best: number | null = null;
    for (const { exam } of achievements) {
        if (exam.mode !== mode || exam.grade === null) continue;
        if (!Number.isInteger(exam.grade) || exam.grade < 1 || exam.grade > 10)
            continue;
        if (best === null || exam.grade < best) best = exam.grade;
    }
    return best;
}

export function getBestExamGrades(
    achievements: readonly ExamAchievementGrade[]
) {
    return {
        exam_basic: getBestExamGrade(achievements, "basic"),
        exam_recital: getBestExamGrade(achievements, "recital"),
    };
}
