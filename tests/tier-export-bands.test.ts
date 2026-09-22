import { describe, expect, it } from "vitest";

import {
    defaultExportBands,
    TIER_EXPORT_MAX,
} from "@/features/tiers/lib/tierExportImage";

// S 서열표 실제 구간 수(2026-09-22, 위 = 높은 구간)
const S_LIST = [
    [13.5, 1],
    [13, 78],
    [12.5, 2],
    [12, 434],
    [11, 266],
    [10, 122],
].map(([value, totalCount]) => ({ value, totalCount }));

describe("defaultExportBands", () => {
    it("keeps every band when the view fits in one image", () => {
        const small = S_LIST.slice(0, 3);
        expect(defaultExportBands(small)).toEqual([13.5, 13, 12.5]);
    });

    it("picks consecutive bands from the top until the next would overflow", () => {
        // 1 + 78 + 2 = 81, 12.0(434)을 더하면 515 로 넘어서 멈춘다
        expect(defaultExportBands(S_LIST)).toEqual([13.5, 13, 12.5]);
        expect(
            defaultExportBands([
                { value: 11, totalCount: 266 },
                { value: 10, totalCount: 122 },
                { value: 9, totalCount: 87 },
                { value: 8, totalCount: 141 },
            ])
        ).toEqual([11, 10, 9]);
    });

    it("uses the 500-song limit by default", () => {
        expect(TIER_EXPORT_MAX).toBe(500);
        expect(
            defaultExportBands([
                { value: 12, totalCount: 500 },
                { value: 11, totalCount: 1 },
            ])
        ).toEqual([12]);
    });
});
