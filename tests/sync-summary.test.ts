import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    dataSyncFindFirst: vi.fn(),
    playDataCount: vi.fn(),
    chartPlayHistoryGroupBy: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({
    default: {
        dataSync: {
            findFirst: mocks.dataSyncFindFirst,
        },
        playData: {
            count: mocks.playDataCount,
        },
        chartPlayHistory: {
            groupBy: mocks.chartPlayHistoryGroupBy,
        },
    },
}));

import { getLatestSyncSummary } from "@/features/sync/server/sync-summary-data";

describe("최근 동기화 결과", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("동기화 기록이 없으면 분석 데이터 조회를 생략한다", async () => {
        mocks.dataSyncFindFirst.mockResolvedValue(null);

        await expect(getLatestSyncSummary(1)).resolves.toBeNull();
        expect(mocks.playDataCount).not.toHaveBeenCalled();
        expect(mocks.chartPlayHistoryGroupBy).not.toHaveBeenCalled();
    });

    it("최근 처리 건수와 현재 분석 가능 채보 수를 함께 반환한다", async () => {
        const startedAt = new Date("2026-07-27T01:00:00+09:00");
        const completedAt = new Date("2026-07-27T01:00:12+09:00");
        mocks.dataSyncFindFirst.mockResolvedValue({
            id: 10,
            status: "completed",
            syncScope: "full",
            receivedPlays: 20,
            insertedPlays: 3,
            changedRecords: 14,
            errorMessage: "일부 채보 제외",
            startedAt: startedAt,
            completedAt: completedAt,
        });
        mocks.playDataCount
            .mockResolvedValueOnce(1200)
            .mockResolvedValueOnce(1180);
        mocks.chartPlayHistoryGroupBy.mockResolvedValue([
            { chartId: 1 },
            { chartId: 2 },
        ]);

        await expect(getLatestSyncSummary(1)).resolves.toEqual({
            id: 10,
            status: "completed",
            syncScope: "full",
            receivedPlays: 20,
            insertedPlays: 3,
            changedRecords: 14,
            hasNotice: true,
            startedAt,
            completedAt,
            playedChartCount: 1200,
            judgementChartCount: 1180,
            timingChartCount: 2,
        });
        expect(mocks.playDataCount).toHaveBeenNthCalledWith(1, {
            where: {
                userId: 1,
                playCount: { gt: 0 },
            },
        });
        expect(mocks.chartPlayHistoryGroupBy).toHaveBeenCalledWith({
            by: ["chartId"],
            where: {
                userId: 1,
                fastCount: { not: null },
                slowCount: { not: null },
            },
        });
    });
});
