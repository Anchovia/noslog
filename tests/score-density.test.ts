import { describe, expect, it } from "vitest";

import {
    scoreDensity,
    scoreDomainMin,
} from "@/features/music/components/scoreScatter";

describe("score distribution curve", () => {
    it("peaks where scores cluster", () => {
        const samples = scoreDensity(
            [990_000, 991_000, 989_000, 940_000],
            925_000,
            1_000_000
        );
        const peak = samples.reduce((best, sample) =>
            sample.density > best.density ? sample : best
        );
        expect(Math.abs(peak.at - 990_000)).toBeLessThan(2_000);
    });
    it("starts the axis at 925k, narrower on phones, lower for low scores", () => {
        expect(scoreDomainMin([990_000], 340)).toBe(925_000);
        expect(scoreDomainMin([990_000], 256)).toBe(935_000);
        expect(scoreDomainMin([], 256)).toBe(935_000);
        const low = [
            ...Array.from({ length: 19 }, () => 990_000),
            812_345,
            812_345,
        ];
        expect(scoreDomainMin(low, 340)).toBe(810_000);
    });
});
