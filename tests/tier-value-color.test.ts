import { describe, expect, it } from "vitest";

import { tierValueColor } from "@/lib/music/tierValueColor";

describe("tierValueColor", () => {
    it("uses the anchor colours at anchor values and clamps the ends", () => {
        expect(tierValueColor(0.5)).toBe("var(--nl-tier-value-start)");
        expect(tierValueColor(3.5)).toBe("var(--nl-difficulty-text-normal)");
        expect(tierValueColor(8)).toBe("var(--nl-difficulty-text-hard)");
        expect(tierValueColor(15)).toBe("var(--nl-tier-value-end)");
    });
    it("mixes neighbouring anchors in oklch", () => {
        expect(tierValueColor(7)).toBe(
            "color-mix(in oklch, var(--nl-judgement-just) 50%, var(--nl-difficulty-text-hard))"
        );
        expect(tierValueColor(13.6)).toBe(
            "color-mix(in oklch, var(--nl-difficulty-text-real) 62%, var(--nl-tier-value-end))"
        );
    });
});
