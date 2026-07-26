import {
    buildPeerScoreComparison,
    MIN_PEER_SCORE_SAMPLE,
    PEER_GRADE_RANGE,
    PEER_STORED_GRADE_RANGE,
} from "@/lib/music/peerScoreComparison";
import { describe, expect, it } from "vitest";

describe("유사 그레이드 점수 비교", () => {
    it("화면 Grd 범위를 DB 저장 단위로 변환한다", () => {
        expect(PEER_STORED_GRADE_RANGE).toBe(20_000);
    });

    it("최소 표본을 충족하면 평균 점수를 반올림한다", () => {
        expect(
            buildPeerScoreComparison(943214.6, MIN_PEER_SCORE_SAMPLE)
        ).toEqual({
            averageScore: 943215,
            sampleCount: 5,
            gradeRange: PEER_GRADE_RANGE,
        });
    });

    it("최소 표본보다 적으면 비교 결과를 숨긴다", () => {
        expect(
            buildPeerScoreComparison(943214.6, MIN_PEER_SCORE_SAMPLE - 1)
        ).toBeNull();
    });

    it("평균 점수가 없으면 비교 결과를 만들지 않는다", () => {
        expect(
            buildPeerScoreComparison(null, MIN_PEER_SCORE_SAMPLE)
        ).toBeNull();
    });
});
