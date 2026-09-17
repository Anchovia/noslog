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
    it("keeps the main peak near where most players are, even with few", () => {
        const samples = scoreDensity(
            [
                1_000_000, 998_420, 995_310, 992_870, 988_200, 983_640, 976_654,
                972_150, 961_480, 947_320, 912_050,
            ],
            910_000,
            1_000_000
        );
        const peak = samples.reduce((best, sample) =>
            sample.density > best.density ? sample : best
        );
        expect(peak.at).toBeGreaterThan(985_000);
        // 봉우리가 사람 수만큼 생기지 않는다(0.25배처럼 울퉁불퉁하지 않게)
        const turns = samples
            .slice(1, -1)
            .filter(
                (sample, index) =>
                    sample.density > samples[index].density &&
                    sample.density > samples[index + 2].density
            );
        expect(turns.length).toBeLessThanOrEqual(3);
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
