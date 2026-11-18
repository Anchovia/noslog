import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    tierBandFindFirst: vi.fn(),
}));

vi.mock("next/cache", () => ({
    unstable_cache: (callback: unknown) => callback,
}));

vi.mock("@/lib/db", () => ({
    default: {
        tierBand: { findFirst: mocks.tierBandFindFirst },
    },
}));

import { getCachedTierBand } from "@/features/tiers/server/public-tier-data";

describe("공개 서열표 데이터 최적화", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("난이도와 일반·Real 공식 레벨 필터를 구간 조회에 전달한다", async () => {
        mocks.tierBandFindFirst.mockResolvedValue({
            id: 11,
            value: 12.5,
            position: 1,
            entries: [],
        });

        await getCachedTierBand(
            "basic-s",
            11,
            ["Expert", "Real"],
            ["12", "real-2"]
        );

        expect(mocks.tierBandFindFirst).toHaveBeenCalledWith(
            expect.objectContaining({
                select: expect.objectContaining({
                    entries: expect.objectContaining({
                        where: {
                            chart: {
                                difficulty: { in: ["Expert", "Real"] },
                                OR: [
                                    {
                                        difficulty: { not: "Real" },
                                        level: { in: [12] },
                                    },
                                    {
                                        difficulty: "Real",
                                        level: { in: [2] },
                                    },
                                ],
                            },
                        },
                    }),
                }),
            })
        );
    });
});
