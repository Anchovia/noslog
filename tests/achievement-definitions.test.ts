import { describe, expect, it } from "vitest";

import {
    ACHIEVEMENT_DEFINITIONS,
    ACHIEVEMENT_METRICS,
    ACHIEVEMENT_TIER_TOTAL,
    achievementProgress,
    achievementRecordsForViewer,
    achievementTierFor,
    autoShowcase,
    examGradeFromScore,
    examGradeScore,
    getAchievementDefinition,
    newAchievementTiers,
    summarizeAchievements,
    visibleAchievementDefinitions,
    type AchievementRecords,
} from "@/features/achievements/achievementDefinitions";

const sRank = getAchievementDefinition("s-rank")!;
const categoryBM = getAchievementDefinition("category-bm")!;
const examBasic = getAchievementDefinition("exam-basic")!;

describe("업적 정의", () => {
    it("키는 겹치지 않고, 기준은 세 단계 오름차순이며, 쓰는 값은 모두 모아 오는 값이다", () => {
        const keys = ACHIEVEMENT_DEFINITIONS.map((item) => item.key);
        expect(new Set(keys).size).toBe(keys.length);
        for (const definition of ACHIEVEMENT_DEFINITIONS) {
            const [bronze, silver, gold] = definition.thresholds;
            expect(bronze).toBeLessThan(silver);
            expect(silver).toBeLessThan(gold);
            expect(ACHIEVEMENT_METRICS).toContain(definition.metric);
        }
        expect(ACHIEVEMENT_TIER_TOTAL).toBe(ACHIEVEMENT_DEFINITIONS.length * 3);
    });

    it("값이 기준에 닿은 단계까지 — 기준값과 같으면 닿은 것", () => {
        expect(achievementTierFor(sRank, { value: 9 })).toBe(0);
        expect(achievementTierFor(sRank, { value: 10 })).toBe(1);
        expect(achievementTierFor(sRank, { value: 199 })).toBe(2);
        expect(achievementTierFor(sRank, { value: 500 })).toBe(3);
    });

    it("카테고리는 곡 수 대비 비율 — 곡이 없으면 0", () => {
        expect(achievementTierFor(categoryBM, { value: 50, total: 200 })).toBe(
            1
        );
        expect(achievementTierFor(categoryBM, { value: 200, total: 200 })).toBe(
            3
        );
        expect(achievementTierFor(categoryBM, { value: 0, total: 0 })).toBe(0);
    });

    it("검정은 급수를 올라가는 값으로 — 7급 동 · 4급 은 · 2급 금(명판 사다리와 같은 경계)", () => {
        expect(examGradeScore(null)).toBe(0);
        expect(examGradeFromScore(examGradeScore(7))).toBe(7);
        expect(
            achievementTierFor(examBasic, { value: examGradeScore(8) })
        ).toBe(0);
        expect(
            achievementTierFor(examBasic, { value: examGradeScore(7) })
        ).toBe(1);
        expect(
            achievementTierFor(examBasic, { value: examGradeScore(4) })
        ).toBe(2);
        expect(
            achievementTierFor(examBasic, { value: examGradeScore(2) })
        ).toBe(3);
    });
});

describe("새 단계 판정", () => {
    it("한 번에 여러 단계를 넘으면 모두 새 단계", () => {
        expect(newAchievementTiers(sRank, { value: 60 }, 0)).toEqual([1, 2]);
    });

    it("얻은 단계는 다시 주지 않고, 값이 내려가도 빼앗지 않는다(새 단계 없음)", () => {
        expect(newAchievementTiers(sRank, { value: 60 }, 2)).toEqual([]);
        expect(newAchievementTiers(sRank, { value: 0 }, 3)).toEqual([]);
    });
});

describe("진행", () => {
    it("다음 단계 기준까지 누적 비율", () => {
        expect(achievementProgress(sRank, { value: 142 }, 2)).toEqual({
            nextTier: 3,
            target: 200,
            current: 142,
            ratio: 0.71,
        });
    });

    it("금까지 얻었으면 다음 없음 · 막대 가득", () => {
        expect(achievementProgress(sRank, { value: 10 }, 3)).toMatchObject({
            nextTier: null,
            target: null,
            ratio: 1,
        });
    });

    it("카테고리는 기준 비율을 곡 수로 바꿔 보인다", () => {
        expect(
            achievementProgress(categoryBM, { value: 30, total: 222 }, 0)
        ).toMatchObject({ nextTier: 1, target: 56, current: 30 });
    });

    it("검정은 합격 전 0, 합격하면 가득", () => {
        expect(
            achievementProgress(examBasic, { value: examGradeScore(6) }, 1)
                .ratio
        ).toBe(0);
    });
});

describe("자동 진열(P5)", () => {
    it("높은 단계 → 달성 인원이 적은 순으로 3개", () => {
        expect(
            autoShowcase([
                { key: "s-rank", tier: 2, recipients: 40 },
                { key: "pianist", tier: 3, recipients: 5 },
                { key: "full-combo", tier: 2, recipients: 12 },
                { key: "opinion", tier: 1, recipients: 3 },
                { key: "gone", tier: 3, recipients: 1 },
            ]).map((item) => item.key)
        ).toEqual(["pianist", "full-combo", "s-rank"]);
    });
});

const records: AchievementRecords = {
    earned: [
        { key: "s-rank", tier: 1, achievedAt: "2026-09-20T00:00:00.000Z" },
        { key: "s-rank", tier: 2, achievedAt: "2026-09-22T00:00:00.000Z" },
        { key: "pianist", tier: 1, achievedAt: "2026-09-21T00:00:00.000Z" },
        { key: "opinion", tier: 1, achievedAt: "2026-09-23T00:00:00.000Z" },
        { key: "gone", tier: 3, achievedAt: "2026-09-24T00:00:00.000Z" },
    ],
    pins: [],
    recipients: {
        "s-rank:2": 30,
        "pianist:1": 4,
        "opinion:1": 50,
    },
};

describe("요약(프로필 구역 · 머리)", () => {
    it("얻은 단계 수 · 금은동 수 · 최근 순 3개 — 없어진 업적 키는 세지 않는다", () => {
        const summary = summarizeAchievements(records);
        expect(summary.earned).toBe(4);
        expect(summary.total).toBe(ACHIEVEMENT_TIER_TOTAL);
        expect(summary.byTier).toEqual([3, 1, 0]);
        expect(
            summary.recent.map((item) => `${item.key}:${item.tier}`)
        ).toEqual(["opinion:1", "s-rank:2", "pianist:1"]);
    });

    it("건 업적이 있으면 그 순서 그대로(가장 높은 단계), 없으면 자동", () => {
        expect(summarizeAchievements(records).showcase).toEqual([
            { key: "s-rank", tier: 2 },
            { key: "pianist", tier: 1 },
            { key: "opinion", tier: 1 },
        ]);
        expect(
            summarizeAchievements({ ...records, pins: ["opinion", "s-rank"] })
                .showcase
        ).toEqual([
            { key: "opinion", tier: 1 },
            { key: "s-rank", tier: 2 },
        ]);
    });
});

describe("점수 비공개(남이 볼 때)", () => {
    it("실력 · 수집 업적은 자료에서 빼고, 분모도 보이는 업적만", () => {
        const visible = achievementRecordsForViewer(
            { ...records, pins: ["s-rank", "opinion"] },
            true
        );
        expect(visible.earned.map((item) => item.key)).toEqual(["opinion"]);
        expect(visible.pins).toEqual(["opinion"]);
        expect(Object.keys(visible.recipients)).toEqual(["opinion:1"]);
        const summary = summarizeAchievements(visible, true);
        expect(summary.earned).toBe(1);
        expect(summary.total).toBe(
            visibleAchievementDefinitions(true).length * 3
        );
        expect(
            visibleAchievementDefinitions(true).every(
                (item) =>
                    item.category === "challenge" ||
                    item.category === "community"
            )
        ).toBe(true);
    });

    it("공개면 자료를 그대로 넘긴다", () => {
        expect(achievementRecordsForViewer(records, false)).toBe(records);
    });
});
