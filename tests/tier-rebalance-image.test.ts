import { describe, expect, it } from "vitest";

import {
    TIER_REBALANCE_2026_10_08,
    tierRebalanceImageAlt,
    tierRebalanceTotals,
} from "@/features/announcements/lib/tier-rebalance-image";
import {
    TIER_REBALANCE_BAND_COUNT,
    tierRebalanceImageSchema,
} from "@/features/announcements/schemas/tier-rebalance-image-schema";

describe("전체 재배치 요약 이미지", () => {
    it("네 서열표의 배치 수로 합계와 유지 수를 계산한다", () => {
        const data = tierRebalanceImageSchema.parse(TIER_REBALANCE_2026_10_08);
        expect(tierRebalanceTotals(data)).toEqual({
            total: 8688,
            changed: 7542,
            added: 12,
            retained: 1134,
        });
        expect(TIER_REBALANCE_BAND_COUNT).toBe(136);
        expect(
            data.rows.map((row) => data.chartsPerTier - row.changed - row.added)
        ).toEqual([219, 292, 342, 281]);
    });
    it("빈 숫자를 0으로 간주하지 않고 음수·소수·잘못된 날짜·누락된 표를 거부한다", () => {
        for (const chartsPerTier of ["", " ", -1, 1.5, Number.MAX_SAFE_INTEGER])
            expect(
                tierRebalanceImageSchema.safeParse({
                    ...TIER_REBALANCE_2026_10_08,
                    chartsPerTier,
                }).success
            ).toBe(false);
        expect(
            tierRebalanceImageSchema.safeParse({
                ...TIER_REBALANCE_2026_10_08,
                date: "2026-02-30",
            }).success
        ).toBe(false);
        expect(
            tierRebalanceImageSchema.safeParse({
                ...TIER_REBALANCE_2026_10_08,
                rows: TIER_REBALANCE_2026_10_08.rows.slice(1),
            }).success
        ).toBe(false);
    });
    it("변경·신규 합계 및 이전·이후 최대 밀집도의 물리적 범위를 검증한다", () => {
        for (const patch of [
            { changed: 2172 },
            { added: 2173 },
            { beforeMax: 0 },
            { beforeMax: 2170 },
            { afterMax: 15 },
            { afterMax: 2173 },
        ]) {
            const rows = TIER_REBALANCE_2026_10_08.rows.map((row, index) =>
                index === 0 ? { ...row, ...patch } : row
            );
            expect(
                tierRebalanceImageSchema.safeParse({
                    ...TIER_REBALANCE_2026_10_08,
                    rows,
                }).success
            ).toBe(false);
        }
        const rows = Array.from({ length: 4 }, () => ({
            changed: "0",
            added: "20",
            beforeMax: "0",
            afterMax: "1",
        }));
        expect(
            tierRebalanceImageSchema.safeParse({
                date: "2026-10-08",
                chartsPerTier: "20",
                rows,
            }).success
        ).toBe(true);
    });
    it("세 언어 대체 설명에 총계와 네 표의 전후 값이 모두 들어간다", () => {
        for (const locale of ["ko", "en", "ja"] as const) {
            const alt = tierRebalanceImageAlt(
                TIER_REBALANCE_2026_10_08,
                locale
            );
            for (const value of [
                "8,688",
                "7,542",
                "12",
                "1,134",
                "2,172",
                "136",
                "0.1",
                "230 → 39",
                "227 → 39",
                "226 → 39",
                "231 → 39",
                "Recital Grd",
            ])
                expect(alt).toContain(value);
            expect(alt).not.toContain("announcements.");
        }
    });
});
