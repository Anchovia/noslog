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
} from "@/app/(site)/tiers/data";

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
                        level: 12,
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
                        level: 12,
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
            {
                chartId: 201,
                score: 950000,
                rank: "S",
                fcType: 0,
                maxCombo: 300,
                playCount: 10,
                clearCount: 9,
                fullcomboCount: 1,
                pianisticCount: 0,
                judgeSjust: 900,
                judgeJust: 70,
                judgeGood: 20,
                judgeMiss: 10,
                judgeNear: 0,
                noteRateStandard: 9500,
                noteRateTenuto: 9600,
                noteRateGlissando: null,
                noteRateTrill: 9000,
                // 2026-07-20 12:00 KST
                bestAt: new Date("2026-07-20T03:00:00Z"),
            },
        ]);
        mocks.queryRaw.mockResolvedValue([
            {
                chart_id: 201,
                fast_count: 12,
                slow_count: 8,
                source_play_time: "2026/07/20 12:00",
            },
        ]);

        const band = await getTierBandForUser("basic-expert", 11, 7);

        expect(mocks.playDataFindMany).toHaveBeenCalledWith({
            where: { userId: 7, chartId: { in: [201, 202] } },
            select: {
                chartId: true,
                score: true,
                rank: true,
                fcType: true,
                maxCombo: true,
                playCount: true,
                clearCount: true,
                fullcomboCount: true,
                pianisticCount: true,
                judgeSjust: true,
                judgeJust: true,
                judgeGood: true,
                judgeMiss: true,
                judgeNear: true,
                noteRateStandard: true,
                noteRateTenuto: true,
                noteRateGlissando: true,
                noteRateTrill: true,
                bestAt: true,
            },
        });
        expect(band?.entries[0].record).toMatchObject({
            chart_id: 201,
            score: 950000,
            // 응답 모양은 그대로 besttime 글자(2026-10-16 P5-1)
            besttime: "2026-07-20 12:00",
            latestPlay: {
                fast_count: 12,
                slow_count: 8,
            },
        });
        expect(band?.entries[1].record).toBeNull();
    });

    it("난이도와 일반·Real 공식 레벨 필터를 구간 조회에 전달한다", async () => {
        mocks.tierBandFindFirst.mockResolvedValue({
            id: 11,
            value: 12.5,
            position: 1,
            entries: [],
        });

        await getTierBandForUser(
            "basic-s",
            11,
            undefined,
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
