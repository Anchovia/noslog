import { describe, expect, it } from "vitest";

import {
    getBemaniClearFlag,
    mapBemaniJudgeCounts,
    mapBemaniNoteSuccessRates,
    normalizeBemaniRank,
} from "@/lib/services/user/bemani-record-mapping";

describe("BEMANI 기록 필드 매핑", () => {
    it("최근 기록의 소문자 랭크를 전체 기록 형식으로 정규화한다", () => {
        expect(normalizeBemaniRank("a2")).toBe("A2");
        expect(normalizeBemaniRank("s")).toBe("S");
    });

    it("판정 배열을 S-Just, Just, Good, Miss, Near 순서로 보존한다", () => {
        expect(mapBemaniJudgeCounts([500, 40, 30, 20, 10])).toEqual({
            judgeSjust: 500,
            judgeJust: 40,
            judgeGood: 30,
            judgeMiss: 20,
            judgeNear: 10,
        });
    });

    it("노트 성공률을 일반, 테누토, 글리산도, 트릴 순서로 보존한다", () => {
        expect(mapBemaniNoteSuccessRates([9900, 9800, -1, 9700])).toEqual({
            noteRateStandard: 9900,
            noteRateTenuto: 9800,
            noteRateGlissando: null,
            noteRateTrill: 9700,
        });
    });

    it("한 칸 배열로 제공되는 클리어 플래그를 숫자로 정규화한다", () => {
        expect(getBemaniClearFlag([17])).toBe(17);
    });
});
