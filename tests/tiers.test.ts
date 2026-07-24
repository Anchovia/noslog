import { describe, expect, it } from "vitest";

import {
    MAX_TIER_VALUE,
    MIN_TIER_VALUE,
    TIER_BAND_VALUES,
    formatTierValue,
    getJacketUrl,
    getTierRecommendation,
    getTierRecordStatus,
    isTierGoalAchieved,
    formatOfficialChartLevel,
} from "@/lib/tiers";

describe("TIER_BAND_VALUES", () => {
    it("14.5부터 1.0까지 0.1 간격의 136개 서열 상수를 제공한다", () => {
        expect(TIER_BAND_VALUES).toHaveLength(136);
        expect(TIER_BAND_VALUES[0]).toBe(MAX_TIER_VALUE);
        expect(TIER_BAND_VALUES.at(-1)).toBe(MIN_TIER_VALUE);
        expect(
            TIER_BAND_VALUES.every(
                (value, index) =>
                    index === 0 ||
                    Math.round((TIER_BAND_VALUES[index - 1] - value) * 10) === 1
            )
        ).toBe(true);
    });
});

describe("formatTierValue", () => {
    it("서열표 상수를 소수점 한 자리로 표시한다", () => {
        expect(formatTierValue(14)).toBe("14.0");
        expect(formatTierValue(13.8)).toBe("13.8");
    });
});

describe("getJacketUrl", () => {
    it("로컬 자켓이 없으면 저장된 URL을 사용하고 HTTPS로 정규화한다", () => {
        expect(getJacketUrl("music-id", "http://example.com/jacket.jpg")).toBe(
            "https://example.com/jacket.jpg"
        );
    });

    it("로컬 자켓이 있으면 DB와 기존 매핑보다 우선 사용한다", () => {
        expect(
            getJacketUrl(
                "818b48940c2d17325904fbab68689046",
                "https://example.com/old-jacket.jpg"
            )
        ).toBe("/bg/818b48940c2d17325904fbab68689046.png");
    });

    it("저장된 자켓이 없으면 공식 동적 자켓 URL을 반환한다", () => {
        expect(getJacketUrl("unknown-music", null)).toBe(
            "https://p.eagate.573.jp/game/nostalgia/op3/img/jacket.html?c=unknown-music"
        );
    });
});

describe("getTierRecommendation", () => {
    it.each([
        [450000, 11, 10.8, 11.2],
        [500000, 11.5, 11.3, 11.7],
        [550000, 12, 11.8, 12.2],
        [600000, 12.5, 12.3, 12.7],
        [650000, 13, 12.8, 13.2],
        [700000, 13.5, 13.3, 13.7],
    ])("Grd 원본 %i를 중심 %f 범위로 변환한다", (raw, target, min, max) => {
        expect(getTierRecommendation(raw)).toMatchObject({ target, min, max });
    });

    it("기록이 없으면 추천 구간을 반환하지 않는다", () => {
        expect(getTierRecommendation(null)).toBeNull();
        expect(getTierRecommendation(0)).toBeNull();
    });

    it("추천 범위를 1~14.5 안으로 제한한다", () => {
        expect(getTierRecommendation(1)?.min).toBe(6.3);
        expect(getTierRecommendation(9999999)).toMatchObject({
            target: 14.5,
            max: 14.5,
        });
    });
});

describe("getTierRecordStatus", () => {
    it("점수와 FC 상태에 따라 기록 상태를 분류한다", () => {
        expect(getTierRecordStatus(null)).toBe("unplayed");
        expect(getTierRecordStatus({ score: 0, rank: "D", fc_type: 0 })).toBe(
            "unplayed"
        );
        expect(
            getTierRecordStatus({ score: 1_000_000, rank: "S", fc_type: 0 })
        ).toBe("pianist");
        expect(
            getTierRecordStatus({ score: 980_000, rank: "S", fc_type: 2 })
        ).toBe("fc");
        expect(
            getTierRecordStatus({ score: 970_000, rank: "s", fc_type: 0 })
        ).toBe("s");
        expect(
            getTierRecordStatus({ score: 900_000, rank: "A", fc_type: 0 })
        ).toBe("a_plus");
        expect(
            getTierRecordStatus({ score: 899_999, rank: "A", fc_type: 0 })
        ).toBe("played");
    });

    it("Pianist, FC, S, A+ 순서로 우선 판정한다", () => {
        expect(
            getTierRecordStatus({ score: 1_000_000, rank: "S", fc_type: 2 })
        ).toBe("pianist");
        expect(
            getTierRecordStatus({ score: 970_000, rank: "S", fc_type: 2 })
        ).toBe("fc");
        expect(
            getTierRecordStatus({ score: 970_000, rank: "S", fc_type: 0 })
        ).toBe("s");
        expect(
            getTierRecordStatus({ score: 920_000, rank: "A+", fc_type: 0 })
        ).toBe("a_plus");
    });
});

describe("목표별 서열표", () => {
    const sRecord = { score: 970_000, rank: "S", fc_type: 0 };
    const fcRecord = { score: 980_000, rank: "S", fc_type: 2 };
    const pianistRecord = { score: 1_000_000, rank: "S", fc_type: 3 };

    it("각 목표의 달성 조건을 독립적으로 판정한다", () => {
        expect(isTierGoalAchieved(sRecord, "s")).toBe(true);
        expect(isTierGoalAchieved(sRecord, "fc")).toBe(false);
        expect(isTierGoalAchieved(fcRecord, "fc")).toBe(true);
        expect(isTierGoalAchieved(fcRecord, "pianist")).toBe(false);
        expect(isTierGoalAchieved(pianistRecord, "pianist")).toBe(true);
    });

    it("Real과 일반 채보의 공식 레벨 표기를 구분한다", () => {
        expect(formatOfficialChartLevel("Expert", 12)).toBe("Lv.12");
        expect(formatOfficialChartLevel("Real", 2)).toBe("Real 2");
    });
});
