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
                chart_id: 201,
                score: 950000,
                rank: "S",
                fc_type: 0,
                max_combo: 300,
                play_count: 10,
                clear_count: 9,
                fullcombo_count: 1,
                pianistic_count: 0,
                judge_sjust: 900,
                judge_just: 70,
                judge_good: 20,
                judge_miss: 10,
                judge_near: 0,
                note_rate_standard: 9500,
                note_rate_tenuto: 9600,
                note_rate_glissando: null,
                note_rate_trill: 9000,
                besttime: "2026.07.20 12:00",
            },
        ]);
        mocks.queryRaw.mockResolvedValue([
            {
                chart_id: 201,
                fast_count: 12,
                slow_count: 8,
                source_play_time: "2026.07.20 12:00",
            },
        ]);

        const band = await getTierBandForUser("basic-expert", 11, 7);

        expect(mocks.playDataFindMany).toHaveBeenCalledWith({
            where: { user_id: 7, chart_id: { in: [201, 202] } },
            select: {
                chart_id: true,
                score: true,
                rank: true,
                fc_type: true,
                max_combo: true,
                play_count: true,
                clear_count: true,
                fullcombo_count: true,
                pianistic_count: true,
                judge_sjust: true,
                judge_just: true,
                judge_good: true,
                judge_miss: true,
                judge_near: true,
                note_rate_standard: true,
                note_rate_tenuto: true,
                note_rate_glissando: true,
                note_rate_trill: true,
                besttime: true,
            },
        });
        expect(band?.entries[0].record).toMatchObject({
            chart_id: 201,
            score: 950000,
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
