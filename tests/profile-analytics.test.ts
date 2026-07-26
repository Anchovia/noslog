import { buildProfilePerformanceAnalytics } from "@/lib/profile/profileAnalytics";
import { describe, expect, it } from "vitest";

const records = [
    {
        play_count: 10,
        clear_count: 8,
        fullcombo_count: 2,
        pianistic_count: 1,
        judge_sjust: 90,
        judge_just: 5,
        judge_good: 3,
        judge_miss: 2,
        judge_near: 0,
        note_rate_standard: 9000,
        note_rate_tenuto: 8000,
        note_rate_glissando: null,
        note_rate_trill: 9500,
    },
    {
        play_count: 20,
        clear_count: null,
        fullcombo_count: 1,
        pianistic_count: 1,
        judge_sjust: 80,
        judge_just: 10,
        judge_good: 5,
        judge_miss: 5,
        judge_near: 0,
        note_rate_standard: 10000,
        note_rate_tenuto: null,
        note_rate_glissando: 9900,
        note_rate_trill: 9700,
    },
];

const recentPlays = [
    {
        id: 1,
        play_time: "2026/07/14 14:15",
        fast_count: 10,
        slow_count: 5,
        judge_sjust: 90,
        judge_just: 5,
        judge_good: 3,
        judge_miss: 2,
        judge_near: 0,
    },
    {
        id: 2,
        play_time: "2026/07/14 14:19",
        fast_count: 20,
        slow_count: 5,
        judge_sjust: 80,
        judge_just: 10,
        judge_good: 5,
        judge_miss: 5,
        judge_near: 0,
    },
];

describe("프로필 플레이 분석", () => {
    it("베스트 기록 판정과 음표별 평균을 집계한다", () => {
        const result = buildProfilePerformanceAnalytics(records, recentPlays);

        expect(result.judgement).toEqual({
            sjustRate: 85,
            averageMissNear: 3.5,
            chartCount: 2,
        });
        expect(result.noteRates).toEqual([
            { key: "standard", label: "일반", value: 95 },
            { key: "tenuto", label: "테누토", value: 80 },
            { key: "glissando", label: "글리산도", value: 99 },
            { key: "trill", label: "트릴", value: 96 },
        ]);
        expect(result.weakestNoteType).toBe("테누토");
    });

    it("플레이 횟수를 기준으로 성과율을 계산한다", () => {
        const result = buildProfilePerformanceAnalytics(records, recentPlays);

        expect(result.outcomes.clearRate).toBe(80);
        expect(result.outcomes.fullComboRate).toBe(10);
        expect(result.outcomes.pianistRate).toBeCloseTo(6.67, 2);
        expect(result.outcomes.playCount).toBe(30);
    });

    it("최근 30플레이의 타이밍과 판정 추이를 계산한다", () => {
        const result = buildProfilePerformanceAnalytics(records, recentPlays);

        expect(result.timing).toEqual({
            fastCount: 30,
            slowCount: 10,
            fastRate: 75,
            playCount: 2,
        });
        expect(result.recentTrend).toEqual([
            {
                id: 1,
                play_time: "2026/07/14 14:15",
                fast: 10,
                slow: 5,
                sjust_rate: 90,
                miss_near: 2,
            },
            {
                id: 2,
                play_time: "2026/07/14 14:19",
                fast: 20,
                slow: 5,
                sjust_rate: 80,
                miss_near: 5,
            },
        ]);
    });

    it("분석 가능한 기록이 없으면 null과 빈 추이를 반환한다", () => {
        const result = buildProfilePerformanceAnalytics([], []);

        expect(result.judgement.sjustRate).toBeNull();
        expect(result.timing.fastRate).toBeNull();
        expect(result.weakestNoteType).toBeNull();
        expect(result.outcomes.clearRate).toBeNull();
        expect(result.recentTrend).toEqual([]);
    });
});
