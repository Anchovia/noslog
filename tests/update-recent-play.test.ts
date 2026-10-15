import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    musicChartFindMany: vi.fn(),
    historyFindMany: vi.fn(),
    historyUpsert: vi.fn(),
    historyCreateMany: vi.fn(),
    transaction: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
    default: {
        musicChart: { findMany: mocks.musicChartFindMany },
        chartPlayHistory: {
            findMany: mocks.historyFindMany,
            upsert: mocks.historyUpsert,
            createMany: mocks.historyCreateMany,
        },
        $transaction: mocks.transaction,
    },
}));

import { updateRecentPlay } from "@/lib/services/user/update-recent-play";

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
        mocks.historyCreateMany.mockResolvedValue({ count: 1 });
        mocks.transaction.mockImplementation((queries) => Promise.all(queries));
    });

    it("신규 최근 플레이를 상세 판정과 함께 한 문장으로 저장한다", async () => {
        const inserted = await updateRecentPlay(1, history, 10);

        expect(inserted).toEqual({ insertedPlays: 1, skippedCharts: [] });
        expect(mocks.historyCreateMany).toHaveBeenCalledWith({
            data: [
                expect.objectContaining({
                    user_id: 1,
                    chart_id: 7,
                    source_play_time: "2026/07/14 14:19",
                    score: 973886,
                    max_combo: 637,
                    rank: "S",
                    best_score: 976654,
                    class_basic: "03",
                    fast_count: 89,
                    slow_count: 15,
                    judge_sjust: 1485,
                    judge_near: 0,
                    first_sync_id: 10,
                }),
            ],
            skipDuplicates: true,
        });
        // 새 플레이에는 upsert 를 쓰지 않는다(2026-10-15 S9)
        expect(mocks.historyUpsert).not.toHaveBeenCalled();
    });

    it("이미 저장된 플레이의 값이 같으면 아무것도 쓰지 않는다", async () => {
        mocks.historyFindMany.mockResolvedValue([
            {
                chart_id: 7,
                source_play_time: "2026/07/14 14:19",
                score: 973886,
                max_combo: 637,
                rank: "S",
                level: 2,
                best_score: 976654,
                grade_basic: 11120,
                class_basic: "03",
                fast_count: 89,
                slow_count: 15,
                is_onehand: false,
                judge_sjust: 1485,
                judge_just: 77,
                judge_good: 27,
                judge_miss: 15,
                judge_near: 0,
            },
        ]);

        const inserted = await updateRecentPlay(1, history, 11);

        expect(inserted).toEqual({ insertedPlays: 0, skippedCharts: [] });
        expect(mocks.historyCreateMany).not.toHaveBeenCalled();
        expect(mocks.historyUpsert).not.toHaveBeenCalled();
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

        expect(inserted).toEqual({ insertedPlays: 0, skippedCharts: [] });
        expect(mocks.historyUpsert).toHaveBeenCalledOnce();
        expect(mocks.historyUpsert.mock.calls[0][0].update).not.toHaveProperty(
            "first_sync_id"
        );
    });

    it("수신 중복과 미등록 채보를 구분하고 알려진 기록만 한 번 저장한다", async () => {
        const info = vi.spyOn(console, "info").mockImplementation(() => {});
        try {
            expect(
                await updateRecentPlay(
                    1,
                    [
                        history[0],
                        history[0],
                        { ...history[0], music: "unknown" },
                    ],
                    12
                )
            ).toEqual({
                insertedPlays: 1,
                skippedCharts: [{ musicIndex: "unknown", difficulty: "Real" }],
            });
            expect(mocks.historyCreateMany).toHaveBeenCalledOnce();
            expect(mocks.historyCreateMany.mock.calls[0][0].data).toHaveLength(
                1
            );
            expect(info).toHaveBeenCalledWith("Recent play ingestion", {
                syncId: 12,
                received: 3,
                unmapped: 1,
                duplicate: 1,
                existing: 0,
                inserted: 1,
            });
        } finally {
            info.mockRestore();
        }
    });
});
