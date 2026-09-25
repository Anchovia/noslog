import { describe, expect, it } from "vitest";

import {
    examGradeScore,
    staleAchievementRows,
    type AchievementMetrics,
} from "@/features/achievements/achievementDefinitions";

const metrics = {
    pianistCharts: { value: 6 },
    sRankCharts: { value: 686 },
    examBasic: { value: examGradeScore(4) },
    categoryBM: { value: 30, total: 222 },
} as AchievementMetrics;

describe("기준에 못 미치는 단계 빼기(2026-09-25 R1)", () => {
    it("없어진 업적 · 없는 등급 · 기준 미달 단계만 고른다", () => {
        const rows = [
            { id: 1, key: "pianist", tier: 1 }, // 새 기준 10곡 — 6 이라 미달
            { id: 2, key: "bingo", tier: 1 }, // 없어진 업적
            { id: 3, key: "s-rank", tier: 4 }, // 500 ≤ 686 — 남김
            { id: 4, key: "s-rank", tier: 5 }, // 1000 > 686 — 미달
            { id: 5, key: "exam-basic", tier: 2 }, // 5급 이상 — 4급 합격이라 남김
            { id: 6, key: "exam-basic", tier: 3 }, // 3급 이상 — 미달
            { id: 7, key: "category-bm", tier: 2 }, // 25% = 56곡 — 30 이라 미달
            { id: 8, key: "category-bm", tier: 1 }, // 10% = 23곡 — 남김
            { id: 9, key: "s-rank", tier: 7 }, // 없는 등급
        ];
        expect(
            staleAchievementRows(rows, metrics).map((row) => row.id)
        ).toEqual([1, 2, 4, 6, 7, 9]);
    });
});
