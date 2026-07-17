import { describe, expect, it } from "vitest";

import type { ExamDashboardItem } from "@/components/exams/dashboard/examDashboardTypes";
import {
    calculateExamSimulation,
    canEnterExam,
    getDefaultExam,
} from "@/components/exams/dashboard/examDashboardUtils";

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

    it("곡별 조건과 누적 조건을 구분해 합격 여부를 계산한다", () => {
        const result = calculateExamSimulation(
            exam({
                stages: [
                    {
                        id: 1,
                        position: 1,
                        label: null,
                        requirementType: "single",
                        requiredValue: 900000,
                        bestValue: 920000,
                        musicIndex: "music-1",
                        title: "첫 곡",
                        artist: null,
                        charts: [],
                    },
                    {
                        id: 2,
                        position: 2,
                        label: null,
                        requirementType: "cumulative",
                        requiredValue: 1850000,
                        bestValue: 910000,
                        musicIndex: "music-2",
                        title: "두 번째 곡",
                        artist: null,
                        charts: [],
                    },
                ],
            })
        );

        expect(result.stages[0].isPassed).toBe(true);
        expect(result.stages[1].comparisonValue).toBe(1830000);
        expect(result.stages[1].isPassed).toBe(false);
        expect(result.totalValue).toBe(1830000);
        expect(result.targetValue).toBe(1850000);
        expect(result.firstFailedStage?.id).toBe(2);
    });

    it("기록을 계산할 수 없는 단계는 합격 여부를 비워둔다", () => {
        const result = calculateExamSimulation(
            exam({
                scoringType: "recital_point",
                stages: [
                    {
                        id: 1,
                        position: 1,
                        label: null,
                        requirementType: "single",
                        requiredValue: 24,
                        bestValue: null,
                        musicIndex: "music-1",
                        title: "첫 곡",
                        artist: null,
                        charts: [],
                    },
                ],
            })
        );

        expect(result.stages[0].isPassed).toBeNull();
        expect(result.firstFailedStage).toBeUndefined();
    });
});
