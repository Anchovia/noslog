import { describe, expect, it } from "vitest";

import {
    formatMetricPercentage,
    formatNoteSuccessRate,
    getCompletionPercentage,
    getJudgementPercentage,
    getJudgementTotal,
    hasJudgementData,
} from "@/lib/music/judgementStats";

const counts = {
    judge_sjust: 500,
    judge_just: 250,
    judge_good: 150,
    judge_miss: 75,
    judge_near: 25,
};

describe("판정 상세 통계", () => {
    it("5종 판정의 합계와 비율을 계산한다", () => {
        expect(hasJudgementData(counts)).toBe(true);
        expect(getJudgementTotal(counts)).toBe(1000);
        expect(getJudgementPercentage(500, 1000)).toBe(50);
    });

    it("연동 전 nullable 판정은 데이터 없음으로 구분한다", () => {
        const emptyCounts = {
            judge_sjust: null,
            judge_just: null,
            judge_good: null,
            judge_miss: null,
            judge_near: null,
        };

        expect(hasJudgementData(emptyCounts)).toBe(false);
        expect(getJudgementTotal(emptyCounts)).toBeNull();
        expect(getJudgementPercentage(null, null)).toBeNull();
    });

    it("BEMANI 성공률을 공식 화면과 같은 퍼센트 단위로 표시한다", () => {
        expect(formatNoteSuccessRate(10000)).toBe("100%");
        expect(formatNoteSuccessRate(9876)).toBe("98.76%");
        expect(formatNoteSuccessRate(null)).toBe("-");
    });

    it("누적 달성 횟수를 플레이 횟수 대비 비율로 계산한다", () => {
        expect(getCompletionPercentage(8, 10)).toBe(80);
        expect(getCompletionPercentage(0, 0)).toBeNull();
        expect(formatMetricPercentage(100 / 3)).toBe("33.3%");
    });
});
