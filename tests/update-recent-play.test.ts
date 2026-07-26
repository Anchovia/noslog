import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    musicChartFindMany: vi.fn(),
    historyFindMany: vi.fn(),
    historyUpsert: vi.fn(),
    transaction: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
    default: {
        musicChart: { findMany: mocks.musicChartFindMany },
        chartPlayHistory: {
            findMany: mocks.historyFindMany,
            upsert: mocks.historyUpsert,
        },
        $transaction: mocks.transaction,
    },
}));

import { updateRecentPlay } from "@/lib/services/user/updateRecentPlay";

const history = [
    {
        artist: "削除",
        best_score: 976654,
        class_basic: "03",
        difficulty: "Real",
        fast_count: 89,
        is_onehand: false,
        judge_count: [1485, 77, 27, 15, 0] as [
            number,
            number,
            number,
            number,
            number,
        ],
        level: 2,
        license: "",
        score: 973886,
        slow_count: 15,
        max_combo: 637,
        rank: "s",
        play_time: "2026/07/14 14:19",
        music: "altale",
        title: "Altale",
        grade_basic: 11120,
    },
];

describe("최근 플레이 저장", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.musicChartFindMany.mockResolvedValue([
            { id: 7, music_idx: "altale", difficulty: "Real" },
        ]);
        mocks.historyFindMany.mockResolvedValue([]);
        mocks.historyUpsert.mockResolvedValue({ id: 1 });
        mocks.transaction.mockImplementation((queries) => Promise.all(queries));
    });

    it("신규 최근 플레이를 상세 판정과 함께 저장한다", async () => {
        const inserted = await updateRecentPlay(1, history, 10);

        expect(inserted).toBe(1);
        expect(mocks.historyUpsert).toHaveBeenCalledWith({
            where: {
                user_id_chart_id_source_play_time_score_max_combo_rank: {
                    user_id: 1,
                    chart_id: 7,
                    source_play_time: "2026/07/14 14:19",
                    score: 973886,
                    max_combo: 637,
                    rank: "S",
                },
            },
            create: expect.objectContaining({
                best_score: 976654,
                class_basic: "03",
                fast_count: 89,
                slow_count: 15,
                judge_sjust: 1485,
                judge_near: 0,
                first_sync_id: 10,
            }),
            update: expect.objectContaining({
                best_score: 976654,
                class_basic: "03",
                fast_count: 89,
                slow_count: 15,
                judge_sjust: 1485,
                judge_near: 0,
            }),
        });
    });

    it("기존 최근 플레이도 재연동 시 상세 필드를 갱신한다", async () => {
        mocks.historyFindMany.mockResolvedValue([
            {
                chart_id: 7,
                source_play_time: "2026/07/14 14:19",
                score: 973886,
                max_combo: 637,
                rank: "S",
            },
        ]);

        const inserted = await updateRecentPlay(1, history, 11);

        expect(inserted).toBe(0);
        expect(mocks.historyUpsert).toHaveBeenCalledOnce();
        expect(mocks.historyUpsert.mock.calls[0][0].update).not.toHaveProperty(
            "first_sync_id"
        );
    });
});
