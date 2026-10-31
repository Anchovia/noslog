import { describe, expect, it } from "vitest";

import {
    ACHIEVEMENT_DEFINITIONS,
    ACHIEVEMENT_METRICS,
    ACHIEVEMENT_TIER_TOTAL,
    achievementProgress,
    achievementStepTotal,
    achievementSteps,
    achievementRecordsForViewer,
    achievementTierFor,
    autoShowcase,
    examGradeFromScore,
    examGradeScore,
    getAchievementDefinition,
    newAchievementTiers,
    summarizeAchievements,
    visibleAchievementDefinitions,
    ACHIEVEMENT_SONG_SET_KEYS,
    type AchievementChartRow,
    type AchievementRecords,
    chartAchievementMetrics,
    songSetThresholds,
} from "@/features/achievements/achievement-definitions";
import { ACHIEVEMENT_SONG_SETS } from "@/features/achievements/achievement-song-sets";

const sRank = getAchievementDefinition("s-rank")!;
const categoryBM = getAchievementDefinition("category-bm")!;
const examBasic = getAchievementDefinition("exam-basic")!;

describe("업적 정의", () => {
    it("키는 겹치지 않고, 가진 등급이 높을수록 기준도 높으며, 쓰는 값은 모두 모아 오는 값이다", () => {
        const keys = ACHIEVEMENT_DEFINITIONS.map((item) => item.key);
        expect(new Set(keys).size).toBe(keys.length);
        for (const definition of ACHIEVEMENT_DEFINITIONS) {
            const steps = achievementSteps(definition);
            expect(steps.length).toBeGreaterThan(0);
            steps
                .slice(1)
                .forEach((step, index) =>
                    expect(steps[index].threshold).toBeLessThan(step.threshold)
                );
            expect(ACHIEVEMENT_METRICS).toContain(definition.metric);
        }
        expect(ACHIEVEMENT_TIER_TOTAL).toBe(
            ACHIEVEMENT_DEFINITIONS.reduce(
                (sum, definition) => sum + achievementSteps(definition).length,
                0
            )
        );
    });

    it("업적마다 가진 등급만 — 다이아 하나만 · 동 · 은 · 금 셋만도 된다(2026-09-25)", () => {
        const diamondOnly = {
            key: "rare",
            category: "skill" as const,
            metric: "pianistCharts" as const,
            thresholds: { 5: 1 },
        };
        expect(achievementTierFor(diamondOnly, { value: 0 })).toBe(0);
        expect(achievementTierFor(diamondOnly, { value: 1 })).toBe(5);
        expect(newAchievementTiers(diamondOnly, { value: 3 }, 0)).toEqual([5]);
        expect(achievementProgress(diamondOnly, { value: 0 }, 0)).toMatchObject(
            { nextTier: 5, target: 1 }
        );
        const threeTier = { ...diamondOnly, thresholds: { 1: 1, 2: 5, 3: 10 } };
        expect(newAchievementTiers(threeTier, { value: 99 }, 1)).toEqual([
            2, 3,
        ]);
        expect(achievementProgress(threeTier, { value: 99 }, 3)).toMatchObject({
            nextTier: null,
        });
        expect(achievementStepTotal([diamondOnly, threeTier])).toBe(4);
    });

    it("빙고 업적은 없다(유저가 직접 체크하는 기록, 2026-09-25)", () => {
        expect(getAchievementDefinition("bingo")).toBeNull();
    });

    it("S 헌터 · 990k · 풀콤보 · 피아니스트 = 10 · 50 · 200 · 500 · 1000(사용자 지정)", () => {
        for (const key of ["s-rank", "score-990k", "full-combo", "pianist"])
            expect(getAchievementDefinition(key)!.thresholds).toEqual({
                1: 10,
                2: 50,
                3: 200,
                4: 500,
                5: 1000,
            });
    });

    it("값이 기준에 닿은 단계까지 — 기준값과 같으면 닿은 것", () => {
        expect(achievementTierFor(sRank, { value: 9 })).toBe(0);
        expect(achievementTierFor(sRank, { value: 10 })).toBe(1);
        expect(achievementTierFor(sRank, { value: 199 })).toBe(2);
        expect(achievementTierFor(sRank, { value: 500 })).toBe(4);
        expect(achievementTierFor(sRank, { value: 1000 })).toBe(5);
    });

    it("카테고리는 곡 수 대비 비율 — 곡이 없으면 0", () => {
        expect(achievementTierFor(categoryBM, { value: 50, total: 200 })).toBe(
            2
        );
        expect(achievementTierFor(categoryBM, { value: 200, total: 200 })).toBe(
            5
        );
        expect(achievementTierFor(categoryBM, { value: 0, total: 0 })).toBe(0);
    });

    it("검정은 급수를 올라가는 값으로 — 7 · 5 · 3 · 2 · 1급(사용자 지정)", () => {
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
            achievementTierFor(examBasic, { value: examGradeScore(3) })
        ).toBe(3);
        expect(
            achievementTierFor(examBasic, { value: examGradeScore(2) })
        ).toBe(4);
        expect(
            achievementTierFor(examBasic, { value: examGradeScore(1) })
        ).toBe(5);
    });
});

describe("새 단계 판정", () => {
    it("한 번에 여러 단계를 넘으면 모두 새 단계", () => {
        expect(newAchievementTiers(sRank, { value: 60 }, 0)).toEqual([1, 2]);
    });

    it("얻은 단계는 다시 주지 않고, 값이 내려가도 빼앗지 않는다(새 단계 없음)", () => {
        expect(newAchievementTiers(sRank, { value: 60 }, 2)).toEqual([]);
        expect(newAchievementTiers(sRank, { value: 0 }, 5)).toEqual([]);
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

    it("다이아까지 얻었으면 다음 없음 · 막대 가득", () => {
        expect(achievementProgress(sRank, { value: 10 }, 5)).toMatchObject({
            nextTier: null,
            target: null,
            ratio: 1,
        });
    });

    it("카테고리는 기준 비율을 곡 수로 바꿔 보인다", () => {
        expect(
            achievementProgress(categoryBM, { value: 30, total: 222 }, 1)
        ).toMatchObject({ nextTier: 2, target: 56, current: 30 });
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
    it("얻은 단계 수 · 최근 순 3개 — 없어진 업적 키는 세지 않는다", () => {
        const summary = summarizeAchievements(records);
        expect(summary.earned).toBe(4);
        expect(summary.total).toBe(ACHIEVEMENT_TIER_TOTAL);
        expect(
            summary.recent.map((item) => `${item.key}:${item.tier}`)
        ).toEqual(["opinion:1", "s-rank:2", "pianist:1"]);
    });

    it("건 업적이 있으면 그 순서 그대로(가장 높은 단계), 없으면 자동", () => {
        expect(
            summarizeAchievements(records).showcase.map(({ key, tier }) => ({
                key,
                tier,
            }))
        ).toEqual([
            { key: "s-rank", tier: 2 },
            { key: "pianist", tier: 1 },
            { key: "opinion", tier: 1 },
        ]);
        expect(
            summarizeAchievements({
                ...records,
                pins: ["opinion", "s-rank"],
            }).showcase.map(({ key, tier }) => ({ key, tier }))
        ).toEqual([
            { key: "opinion", tier: 1 },
            { key: "s-rank", tier: 2 },
        ]);
    });
});

describe("점수 비공개(남이 볼 때)", () => {
    it("실력 · 수집 · 곡 묶음 · 계절 업적은 자료에서 빼고, 분모도 보이는 업적만", () => {
        const visible = achievementRecordsForViewer(
            { ...records, pins: ["s-rank", "opinion"] },
            true
        );
        expect(visible.earned.map((item) => item.key)).toEqual(["opinion"]);
        expect(visible.pins).toEqual(["opinion"]);
        expect(Object.keys(visible.recipients)).toEqual(["opinion:1"]);
        const summary = summarizeAchievements(visible, true);
        expect(summary.earned).toBe(1);
        // 분모는 보이는 업적이 가진 단계 수의 합(커뮤니티 업적도 다섯 단계가 아닌 것이 있다)
        expect(summary.total).toBe(
            achievementStepTotal(visibleAchievementDefinitions(true))
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

describe("머리 배지 도움말(2026-09-25)", () => {
    it("진열 배지에 그 단계의 달성일 · 달성 인원을 싣는다", () => {
        expect(summarizeAchievements(records).showcase[0]).toEqual({
            key: "s-rank",
            tier: 2,
            achievedAt: "2026-09-22T00:00:00.000Z",
            recipients: 30,
        });
    });
});

describe("곡 묶음 업적", () => {
    const row = (
        musicIndex: string,
        difficulty: string,
        level: number,
        lamp: Partial<AchievementChartRow> = {}
    ): AchievementChartRow => ({
        musicIndex,
        difficulty,
        level,
        sRank: false,
        fullCombo: false,
        pianist: false,
        ...lamp,
    });

    it("곡 수로 단계를 나눈다 — 10곡 이상 다섯 · 5–9곡 셋 · 2–4곡 금 하나 · 한 곡은 램프", () => {
        expect(songSetThresholds(21)).toEqual({
            1: 5,
            2: 9,
            3: 13,
            4: 17,
            5: 21,
        });
        expect(songSetThresholds(7)).toEqual({ 1: 3, 2: 5, 3: 7 });
        expect(songSetThresholds(4)).toEqual({ 3: 4 });
        expect(songSetThresholds(1)).toEqual({ 1: 1, 2: 2, 3: 3 });
    });

    it("묶음마다 곡이 겹치지 않고, 묶음 업적은 곡 묶음 · 계절 분류다", () => {
        for (const key of ACHIEVEMENT_SONG_SET_KEYS) {
            const songs = ACHIEVEMENT_SONG_SETS[key].songs;
            expect(new Set(songs).size).toBe(songs.length);
            expect(["songSet", "season"]).toContain(
                getAchievementDefinition(key)?.category
            );
        }
    });

    it("묶음 곡 중 아무 난이도 S 이상인 곡 수를 센다", () => {
        const [first, second] = ACHIEVEMENT_SONG_SETS.chopin.songs;
        const metrics = chartAchievementMetrics([
            row(first, "Normal", 2, { sRank: true }),
            row(first, "Expert", 9, { sRank: true }),
            row(second, "Expert", 10),
        ]);
        expect(metrics["songSet:chopin"]).toEqual({ value: 1 });
    });

    it("난이도를 정한 묶음은 그 난이도 기록만 센다", () => {
        const [song] = ACHIEVEMENT_SONG_SETS["hard-normal"].songs;
        expect(
            chartAchievementMetrics([row(song, "Expert", 12, { sRank: true })])[
                "songSet:hard-normal"
            ]
        ).toEqual({ value: 0 });
        expect(
            chartAchievementMetrics([row(song, "Normal", 7, { sRank: true })])[
                "songSet:hard-normal"
            ]
        ).toEqual({ value: 1 });
    });

    it("한 곡 업적은 가장 높은 램프 — S 1 · 풀콤보 2 · Pianist 3", () => {
        const [song] = ACHIEVEMENT_SONG_SETS.mei.songs;
        const metrics = chartAchievementMetrics([
            row(song, "Hard", 8, { sRank: true }),
            row(song, "Expert", 11, { sRank: true, fullCombo: true }),
        ]);
        expect(metrics["songSet:mei"]).toEqual({ value: 2 });
        const mei = getAchievementDefinition("mei")!;
        expect(mei.unit).toBe("lamp");
        expect(newAchievementTiers(mei, metrics["songSet:mei"], 0)).toEqual([
            1, 2,
        ]);
        expect(achievementProgress(mei, { value: 2 }, 2)).toMatchObject({
            nextTier: 3,
            ratio: 0,
        });
    });

    it("한 곡 완주는 그 곡의 모든 채보가 S 이상인 곡만 센다", () => {
        const metrics = chartAchievementMetrics([
            row("a", "Normal", 2, { sRank: true }),
            row("a", "Hard", 5, { sRank: true }),
            row("b", "Normal", 2, { sRank: true }),
            row("b", "Real", 2),
        ]);
        expect(metrics.allDifficultySongs).toEqual({ value: 1 });
    });

    it("레벨 사다리는 Lv.1 부터 끊기지 않은 가장 높은 레벨이고 Real 의 ◆ 는 세지 않는다", () => {
        const levels = [1, 2, 3, 5].map((level) =>
            row(`m${level}`, "Expert", level, { sRank: true })
        );
        expect(
            chartAchievementMetrics([
                ...levels,
                row("r", "Real", 4, { sRank: true }),
            ]).levelLadder
        ).toEqual({ value: 3 });
    });
});

describe("조건을 정한 곡 묶음", () => {
    const row = (
        musicIndex: string,
        difficulty: string,
        lamp: Partial<AchievementChartRow> = {}
    ): AchievementChartRow => ({
        musicIndex,
        difficulty,
        level: 10,
        sRank: false,
        fullCombo: false,
        pianist: false,
        ...lamp,
    });

    it("모든 난이도 묶음은 그 곡의 채보가 하나라도 모자라면 세지 않고, 단계는 금 하나다", () => {
        const [song] = ACHIEVEMENT_SONG_SETS["bad-apple"].songs;
        const s = { sRank: true };
        expect(
            chartAchievementMetrics([
                row(song, "Normal", s),
                row(song, "Hard", s),
                row(song, "Expert"),
            ])["songSet:bad-apple"]
        ).toEqual({ value: 0 });
        expect(
            chartAchievementMetrics([
                row(song, "Normal", s),
                row(song, "Hard", s),
                row(song, "Expert", s),
            ])["songSet:bad-apple"]
        ).toEqual({ value: 1 });
        const definition = getAchievementDefinition("bad-apple")!;
        expect(definition.thresholds).toEqual({ 3: 1 });
        expect(definition.unit).toBeUndefined();
    });

    it("풀콤보 기준 묶음은 S 만으로는 세지 않는다", () => {
        const [song] = ACHIEVEMENT_SONG_SETS.bells.songs;
        expect(
            chartAchievementMetrics([row(song, "Expert", { sRank: true })])[
                "songSet:bells"
            ]
        ).toEqual({ value: 0 });
        expect(
            chartAchievementMetrics([
                row(song, "Expert", { sRank: true, fullCombo: true }),
            ])["songSet:bells"]
        ).toEqual({ value: 1 });
    });

    it("Expert 로 정한 묶음은 다른 난이도의 기록을 세지 않는다", () => {
        const [song] = ACHIEVEMENT_SONG_SETS["demon-kings"].songs;
        expect(
            chartAchievementMetrics([
                row(song, "Hard", { sRank: true }),
                row(song, "Expert", { sRank: true }),
            ])["songSet:demon-kings"]
        ).toEqual({ value: 1 });
        expect(
            chartAchievementMetrics([row(song, "Hard", { sRank: true })])[
                "songSet:demon-kings"
            ]
        ).toEqual({ value: 0 });
    });
});
