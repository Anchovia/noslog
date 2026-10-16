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

// 2026/07/14 14:19 KST — 같은 플레이는 played_at 으로 가른다(2026-10-16 P5-1)
const playedAt = new Date("2026-07-14T05:19:00Z");
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
            { id: 7, musicIdx: "altale", difficulty: "Real" },
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
                    userId: 1,
                    chartId: 7,
                    playedAt,
                    score: 973886,
                    maxCombo: 637,
                    rank: "S",
                    bestScore: 976654,
                    classBasic: "03",
                    fastCount: 89,
                    slowCount: 15,
                    judgeSjust: 1485,
                    judgeNear: 0,
                    firstSyncId: 10,
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
                chartId: 7,
                playedAt,
                score: 973886,
                maxCombo: 637,
                rank: "S",
                level: 2,
                bestScore: 976654,
                gradeBasic: 11120,
                classBasic: "03",
                fastCount: 89,
                slowCount: 15,
                isOnehand: false,
                judgeSjust: 1485,
                judgeJust: 77,
                judgeGood: 27,
                judgeMiss: 15,
                judgeNear: 0,
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
                chartId: 7,
                playedAt,
                score: 973886,
                maxCombo: 637,
                rank: "S",
            },
        ]);

        const inserted = await updateRecentPlay(1, history, 11);

        expect(inserted).toEqual({ insertedPlays: 0, skippedCharts: [] });
        expect(mocks.historyUpsert).toHaveBeenCalledOnce();
        expect(mocks.historyUpsert.mock.calls[0][0].update).not.toHaveProperty(
            "firstSyncId"
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
                untimed: 0,
                duplicate: 1,
                existing: 0,
                inserted: 1,
            });
        } finally {
            info.mockRestore();
        }
    });

    it("시각을 읽지 못한 플레이는 같은 플레이를 가를 수 없어 저장하지 않는다", async () => {
        const info = vi.spyOn(console, "info").mockImplementation(() => {});
        try {
            expect(
                await updateRecentPlay(
                    1,
                    [{ ...history[0], play_time: "unknown" }],
                    13
                )
            ).toEqual({ insertedPlays: 0, skippedCharts: [] });
            expect(mocks.historyCreateMany).not.toHaveBeenCalled();
            expect(info).toHaveBeenCalledWith(
                "Recent play ingestion",
                expect.objectContaining({ unmapped: 0, untimed: 1 })
            );
        } finally {
            info.mockRestore();
        }
    });
});
