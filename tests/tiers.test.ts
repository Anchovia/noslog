import { describe, expect, it } from "vitest";

import { getTierRecommendation, getTierRecordStatus } from "@/lib/tiers";

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

    it("추천 범위를 1~14 안으로 제한한다", () => {
        expect(getTierRecommendation(1)?.min).toBe(6.3);
        expect(getTierRecommendation(9999999)).toMatchObject({
            target: 14,
            max: 14,
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
        ).toBe("played");
    });
});
