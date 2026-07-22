import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    queryRaw: vi.fn(),
    tierBandFindFirst: vi.fn(),
    playDataFindMany: vi.fn(),
}));

vi.mock("next/cache", () => ({
    unstable_cache: (callback: unknown) => callback,
}));

vi.mock("@/lib/db", () => ({
    default: {
        $queryRaw: mocks.queryRaw,
        tierBand: { findFirst: mocks.tierBandFindFirst },
        playData: { findMany: mocks.playDataFindMany },
    },
}));

import {
    getTierBandForUser,
    getUserTierListProgress,
} from "@/app/(nevigation)/tiers/data";

describe("공개 서열표 데이터 최적화", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("목록 진행도 집계값을 직렬화 가능한 숫자로 변환한다", async () => {
        mocks.queryRaw.mockResolvedValue([
            {
                tier_list_id: 3,
                pianist_count: BigInt(10),
                fc_count: BigInt(20),
                s_count: BigInt(30),
                cleared_count: BigInt(100),
            },
        ]);

        await expect(getUserTierListProgress(7, [3])).resolves.toEqual([
            {
                tierListId: 3,
                pianistCount: 10,
                fcCount: 20,
                sCount: 30,
                clearedCount: 100,
            },
        ]);
    });

    it("서열표가 없으면 진행도 DB 조회를 생략한다", async () => {
        await expect(getUserTierListProgress(7, [])).resolves.toEqual([]);
        expect(mocks.queryRaw).not.toHaveBeenCalled();
    });

    it("요청한 구간의 채보에 현재 사용자 기록만 결합한다", async () => {
        mocks.tierBandFindFirst.mockResolvedValue({
            id: 11,
            value: 12.5,
            position: 0,
            entries: [
                {
                    id: 101,
                    chartId: 201,
                    position: 0,
                    chart: {
                        difficulty: "Expert",
                        music: {
                            index: "music-1",
                            title: "Music 1",
                            background: null,
                        },
                    },
                },
                {
                    id: 102,
                    chartId: 202,
                    position: 1,
                    chart: {
                        difficulty: "Expert",
                        music: {
                            index: "music-2",
                            title: "Music 2",
                            background: null,
                        },
                    },
                },
            ],
        });
        mocks.playDataFindMany.mockResolvedValue([
            { chart_id: 201, score: 950000, rank: "S", fc_type: 0 },
        ]);

        const band = await getTierBandForUser("basic-expert", 11, 7);

        expect(mocks.playDataFindMany).toHaveBeenCalledWith({
            where: { user_id: 7, chart_id: { in: [201, 202] } },
            select: {
                chart_id: true,
                score: true,
                rank: true,
                fc_type: true,
            },
        });
        expect(band?.entries.map((entry) => entry.record)).toEqual([
            { chart_id: 201, score: 950000, rank: "S", fc_type: 0 },
            null,
        ]);
    });
});
