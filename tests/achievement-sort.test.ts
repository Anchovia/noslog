import { describe, expect, it } from "vitest";

import {
    ACHIEVEMENT_DEFINITIONS,
    type AchievementMetrics,
    type AchievementRecords,
} from "@/features/achievements/achievementDefinitions";
import { sortAchievementDefinitions } from "@/features/achievements/achievementSort";

const pick = (...keys: string[]) =>
    ACHIEVEMENT_DEFINITIONS.filter((item) => keys.includes(item.key));
const definitions = pick("s-rank", "score-990k", "pianist", "opinion");
const records: AchievementRecords = {
    earned: [
        { key: "opinion", tier: 1, achievedAt: "2026-09-25T00:00:00.000Z" },
        { key: "s-rank", tier: 3, achievedAt: "2026-09-20T00:00:00.000Z" },
        { key: "score-990k", tier: 2, achievedAt: "2026-09-22T00:00:00.000Z" },
    ],
    pins: [],
    recipients: { "opinion:1": 40, "s-rank:3": 12, "score-990k:2": 5 },
};
const keys = (
    sort: Parameters<typeof sortAchievementDefinitions>[1],
    m = null as AchievementMetrics | null
) =>
    sortAchievementDefinitions(definitions, sort, records, m).map(
        (item) => item.key
    );

describe("업적 정렬(2026-09-25)", () => {
    it("분류 순 = 정의 순서", () => {
        expect(keys("category")).toEqual([
            "s-rank",
            "score-990k",
            "pianist",
            "opinion",
        ]);
    });

    it("높은 등급 · 최근 달성 · 희귀한 순 — 못 얻은 업적은 뒤", () => {
        expect(keys("tier")).toEqual([
            "s-rank",
            "score-990k",
            "opinion",
            "pianist",
        ]);
        expect(keys("recent")).toEqual([
            "opinion",
            "score-990k",
            "s-rank",
            "pianist",
        ]);
        expect(keys("rare")).toEqual([
            "score-990k",
            "s-rank",
            "opinion",
            "pianist",
        ]);
    });

    it("다음 단계에 가까운 순 — 진행 비율 높은 순, 값이 없으면(남) 분류 순", () => {
        const metrics = {
            sRankCharts: { value: 450 }, // III → IV 500: 0.9
            score990kCharts: { value: 100 }, // II → III 200: 0.5
            pianistCharts: { value: 9 }, // 0 → I 10: 0.9
            opinions: { value: 2 }, // I → II 10: 0.2
        } as AchievementMetrics;
        expect(keys("closest", metrics)).toEqual([
            "s-rank",
            "pianist",
            "score-990k",
            "opinion",
        ]);
        expect(keys("closest")).toEqual(keys("category"));
    });
});
