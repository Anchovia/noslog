import {
    buildPeerScoreComparison,
    MIN_PEER_SCORE_SAMPLE,
    PEER_GRADE_RANGE,
    PEER_STORED_GRADE_RANGE,
} from "@/lib/music/peerScoreComparison";
import { describe, expect, it } from "vitest";

describe("유사 그레이드 점수 비교", () => {
    const records = Array.from(
        { length: MIN_PEER_SCORE_SAMPLE },
        (_, index) => ({
            score: 943212 + index,
            judge_sjust: 900 + index * 10,
            judge_just: 70 - index * 5,
            judge_good: 20,
            judge_miss: 10,
            judge_near: 0,
            note_rate_standard: 9400 + index * 100,
            note_rate_tenuto: 9500 + index * 100,
            note_rate_glissando: 9000 + index * 200,
            note_rate_trill: 8200 + index * 300,
        })
    );

    it("화면 Grd 범위를 DB 저장 단위로 변환한다", () => {
        expect(PEER_STORED_GRADE_RANGE).toBe(20_000);
    });

    it("최소 표본을 충족하면 점수와 판정 퍼센트 평균을 계산한다", () => {
        const comparison = buildPeerScoreComparison(records);

        expect(comparison).toMatchObject({
            averageScore: 943214,
            sampleCount: 5,
            gradeRange: PEER_GRADE_RANGE,
        });
        expect(comparison?.judgement?.sampleCount).toBe(5);
        expect(comparison?.judgement?.averages.judge_sjust).toBeCloseTo(
            91.084,
            2
        );
        expect(comparison?.noteRates.averages).toEqual({
            note_rate_standard: 9600,
            note_rate_tenuto: 9700,
            note_rate_glissando: 9400,
            note_rate_trill: 8800,
        });
    });

    it("최소 표본보다 적으면 비교 결과를 숨긴다", () => {
        expect(buildPeerScoreComparison(records.slice(0, -1))).toBeNull();
    });

    it("판정 데이터가 부족하면 점수 비교만 제공한다", () => {
        const comparison = buildPeerScoreComparison(
            records.map((record, index) => ({
                ...record,
                judge_sjust: index === 0 ? record.judge_sjust : null,
            }))
        );

        expect(comparison?.averageScore).toBe(943214);
        expect(comparison?.judgement).toBeNull();
    });

    it("판정 합계가 0인 기록은 판정 평균에서 제외한다", () => {
        const comparison = buildPeerScoreComparison([
            ...records,
            {
                score: 950000,
                judge_sjust: 0,
                judge_just: 0,
                judge_good: 0,
                judge_miss: 0,
                judge_near: 0,
                note_rate_standard: null,
                note_rate_tenuto: null,
                note_rate_glissando: null,
                note_rate_trill: null,
            },
        ]);

        expect(comparison?.sampleCount).toBe(6);
        expect(comparison?.judgement?.sampleCount).toBe(5);
    });

    it("음표별 성공률은 항목별 최소 표본을 충족할 때만 평균을 제공한다", () => {
        const comparison = buildPeerScoreComparison(
            records.map((record, index) => ({
                ...record,
                note_rate_trill:
                    index === records.length - 1
                        ? null
                        : record.note_rate_trill,
            }))
        );

        expect(comparison?.noteRates.averages.note_rate_standard).toBe(9600);
        expect(comparison?.noteRates.averages.note_rate_trill).toBeNull();
        expect(comparison?.noteRates.sampleCounts.note_rate_trill).toBe(4);
    });
});
