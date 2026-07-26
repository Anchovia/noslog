import { buildProfileSJustAnalytics } from "@/lib/profile/profileAnalytics";
import { describe, expect, it } from "vitest";

const records = [
    {
        judge_sjust: 90,
        judge_just: 5,
        judge_good: 3,
        judge_miss: 2,
        judge_near: 0,
    },
    {
        judge_sjust: 80,
        judge_just: 10,
        judge_good: 5,
        judge_miss: 5,
        judge_near: 0,
    },
];

describe("프로필 S-Just 분석", () => {
    it("판정 데이터가 있는 베스트 기록의 S-Just 비율을 집계한다", () => {
        const result = buildProfileSJustAnalytics(records);

        expect(result).toEqual({
            sjustRate: 85,
            chartCount: 2,
        });
    });

    it("일부 판정이 비어 있는 기록은 집계에서 제외한다", () => {
        const result = buildProfileSJustAnalytics([
            ...records,
            { ...records[0], judge_near: null },
        ]);

        expect(result.chartCount).toBe(2);
        expect(result.sjustRate).toBe(85);
    });

    it("분석 가능한 기록이 없으면 비율을 표시하지 않는다", () => {
        const result = buildProfileSJustAnalytics([]);

        expect(result).toEqual({
            sjustRate: null,
            chartCount: 0,
        });
    });
});
