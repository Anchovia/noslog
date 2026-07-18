import { describe, expect, it } from "vitest";

import {
    formatScoreRecordDate,
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
});
