import { describe, expect, it } from "vitest";

import type { ExamDashboardItem } from "@/features/exams/types/exam-dashboard";
import {
    canEnterExam,
    getDefaultExam,
} from "@/features/exams/exam-dashboard-utils";

function exam(changes: Partial<ExamDashboardItem> = {}): ExamDashboardItem {
    return {
        id: 1,
        slug: "basic-10",
        mode: "basic",
        scoringType: "score",
        grade: 10,
        shortLabel: "10급",
        title: "Basic 10급",
        description: null,
        feeNos: 1000,
        requiredGrade: 3000,
        rewards: [],
        isAchieved: false,
        submissionStatus: null,
        submissionReviewerNote: null,
        playerGrade: 3500,
        stages: [],
        ...changes,
    };
}

describe("검정 선택과 합격 시뮬레이션", () => {
    it("요구 Grd.를 충족하거나 요구치가 없으면 응시할 수 있다", () => {
        expect(canEnterExam(exam())).toBe(true);
        expect(
            canEnterExam(exam({ requiredGrade: 0, playerGrade: null }))
        ).toBe(true);
        expect(canEnterExam(exam({ playerGrade: 2999 }))).toBe(false);
    });

    it("미달성 응시 가능 검정을 기본 선택한다", () => {
        const selected = getDefaultExam([
            exam({ id: 1, isAchieved: true }),
            exam({ id: 2, playerGrade: 1000 }),
            exam({ id: 3, playerGrade: 4000 }),
        ]);

        expect(selected?.id).toBe(3);
    });
});
