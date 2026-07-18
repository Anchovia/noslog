import { describe, expect, it } from "vitest";

import {
    getRankingTopPercent,
    getVisibleRankingPages,
} from "@/components/music/ranking/musicRankingUtils";

describe("악곡 랭킹 표시 계산", () => {
    it("현재 페이지 주변의 페이지 번호를 최대 세 개 표시한다", () => {
        expect(getVisibleRankingPages(1, 10)).toEqual([1, 2, 3]);
        expect(getVisibleRankingPages(5, 10)).toEqual([4, 5, 6]);
        expect(getVisibleRankingPages(10, 10)).toEqual([8, 9, 10]);
    });

    it("전체 페이지가 세 개보다 적으면 존재하는 페이지만 표시한다", () => {
        expect(getVisibleRankingPages(1, 1)).toEqual([1]);
        expect(getVisibleRankingPages(2, 2)).toEqual([1, 2]);
    });

    it("현재 유저의 상위 비율을 정수 퍼센트로 계산한다", () => {
        expect(getRankingTopPercent(1, 100)).toBe(1);
        expect(getRankingTopPercent(11, 100)).toBe(11);
        expect(getRankingTopPercent(1, 0)).toBe(0);
    });
});
