import { describe, expect, it } from "vitest";

import {
    formatScoreRecordDate,
    formatTrendTooltipDate,
    getMissNearCount,
    getSJustRate,
    selectScoreImprovements,
} from "@/lib/music/scoreTrend";

describe("베스트 스코어 추이", () => {
    it("시간순 기록에서 최고점이 상승한 기록을 모두 남긴다", () => {
        const records = [
            { id: 1, score: 900000 },
            { id: 2, score: 920000 },
            { id: 3, score: 910000 },
            { id: 4, score: 920000 },
            { id: 5, score: 950000 },
        ];

        expect(selectScoreImprovements(records)).toEqual([
            { id: 1, score: 900000 },
            { id: 2, score: 920000 },
            { id: 5, score: 950000 },
        ]);
    });

    it("점수가 없는 기록은 추이에 포함하지 않는다", () => {
        expect(
            selectScoreImprovements([
                { id: 1, score: 0 },
                { id: 2, score: 0 },
            ])
        ).toEqual([]);
    });

    it("ISO와 기존 플레이 날짜를 동일한 형식으로 표시한다", () => {
        expect(formatScoreRecordDate("2025-10-01T17:58:33.236Z")).toBe(
            "2025.10.01"
        );
        expect(formatScoreRecordDate("2025/05/29 12:30:00")).toBe("2025.05.29");
    });

    it("툴팁 날짜에는 플레이 시각을 분 단위까지 표시한다", () => {
        expect(formatTrendTooltipDate("2026/07/14 14:19:30")).toBe(
            "2026.07.14 14:19"
        );
        expect(formatTrendTooltipDate("2025-10-01T17:58:33.236Z")).toBe(
            "2025.10.01 17:58"
        );
    });

    it("Miss와 Near 합계를 계산한다", () => {
        expect(getMissNearCount({ judge_miss: 15, judge_near: 2 })).toBe(17);
        expect(
            getMissNearCount({ judge_miss: null, judge_near: 2 })
        ).toBeNull();
    });

    it("전체 판정 중 S-Just 비율을 소수점 한 자리로 계산한다", () => {
        expect(
            getSJustRate({
                judge_sjust: 1485,
                judge_just: 77,
                judge_good: 27,
                judge_miss: 15,
                judge_near: 0,
            })
        ).toBe(92.6);
        expect(
            getSJustRate({
                judge_sjust: null,
                judge_just: 0,
                judge_good: 0,
                judge_miss: 0,
                judge_near: 0,
            })
        ).toBeNull();
    });
});
