import { describe, expect, it } from "vitest";

import { tierValueColor } from "@/lib/music/tier-value-color";

describe("tierValueColor", () => {
    it("paints one flat colour per step and clamps below 1", () => {
        expect(tierValueColor(0.5)).toBe("var(--nl-difficulty-normal)");
        expect(tierValueColor(4.4)).toBe("var(--nl-difficulty-normal)");
        expect(tierValueColor(8)).toBe("var(--nl-difficulty-hard)");
        expect(tierValueColor(11.25)).toBe("var(--nl-difficulty-expert)");
        expect(tierValueColor(13.05)).toBe("var(--nl-difficulty-real)");
    });
    it("includes the lower edge and excludes the upper edge of each step", () => {
        expect(tierValueColor(4.5)).toBe("var(--nl-tier-value-normal-hard)");
        expect(tierValueColor(7.99)).toBe("var(--nl-tier-value-normal-hard)");
        expect(tierValueColor(9.625)).toBe("var(--nl-tier-value-hard-expert)");
        expect(tierValueColor(12.15)).toBe("var(--nl-tier-value-expert-real)");
        expect(tierValueColor(13.775)).toBe("var(--nl-tier-value-real-end)");
        expect(tierValueColor(14.5)).toBe("var(--nl-tier-value-end)");
        expect(tierValueColor(15)).toBe("var(--nl-tier-value-end)");
    });
});
