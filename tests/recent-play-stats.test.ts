import { describe, expect, it } from "vitest";

import {
    getBestScoreDifference,
    getTimingBias,
} from "@/lib/music/recentPlayStats";

describe("최근 플레이 통계", () => {
    it("현재 베스트 점수 대비 차이를 계산한다", () => {
        expect(getBestScoreDifference(973886, 976654)).toBe(-2768);
        expect(getBestScoreDifference(976654, 976654)).toBe(0);
        expect(getBestScoreDifference(950000, null)).toBeNull();
    });

    it("FAST와 SLOW 편향을 표시한다", () => {
        expect(getTimingBias(89, 15)).toBe("FAST +74");
        expect(getTimingBias(15, 89)).toBe("SLOW +74");
        expect(getTimingBias(30, 30)).toBe("균형");
        expect(getTimingBias(null, 30)).toBeNull();
    });
});
