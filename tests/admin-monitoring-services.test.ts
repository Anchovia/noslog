import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    admin: vi.fn(),
    submission: vi.fn(),
    chart: vi.fn(),
    catalog: vi.fn(),
    bingo: vi.fn(),
    music: vi.fn(),
    userCount: vi.fn(),
    users: vi.fn(),
    syncCount: vi.fn(),
    syncs: vi.fn(),
    feedbackCount: vi.fn(),
    feedback: vi.fn(),
    history: vi.fn(),
    snapshot: vi.fn(),
}));
vi.mock("@/lib/admin", () => ({ requireAdmin: mocks.admin }));
vi.mock("@/lib/db", () => ({
    default: {
        examSubmission: { count: mocks.submission },
        musicChart: { count: mocks.chart },
        musicCatalogCandidate: { count: mocks.catalog },
        bingo: { count: mocks.bingo },
        music: { count: mocks.music },
        user: { count: mocks.userCount, findMany: mocks.users },
        dataSync: { count: mocks.syncCount, findMany: mocks.syncs },
        feedbackReport: {
            count: mocks.feedbackCount,
            findMany: mocks.feedback,
        },
        chartPlayHistory: { groupBy: mocks.history },
        chartRecordSnapshot: { groupBy: mocks.snapshot },
    },
}));

import { getAdminSyncs } from "@/features/admin/server/adminSyncService";

describe("admin monitoring server boundaries", () => {
    const now = new Date(2026, 8, 5, 12);
    beforeEach(() => {
        vi.resetAllMocks();
        vi.useFakeTimers();
        vi.setSystemTime(now);
        mocks.admin.mockResolvedValue({ id: 1 });
        for (const key of [
            "submission",
            "chart",
            "catalog",
            "bingo",
            "music",
            "userCount",
            "syncCount",
            "feedbackCount",
        ] as const)
            mocks[key].mockResolvedValue(2);
        for (const key of [
            "users",
            "syncs",
            "feedback",
            "history",
            "snapshot",
        ] as const)
            mocks[key].mockResolvedValue([]);
    });
    afterEach(() => vi.useRealTimers());
    it("checks authority before sync data access", async () => {
        mocks.admin.mockRejectedValue(new Error("not authorized"));
        await expect(getAdminSyncs({})).rejects.toThrow("not authorized");
        for (const [key, mock] of Object.entries(mocks))
            if (key !== "admin") expect(mock).not.toHaveBeenCalled();
    });
    it.each([undefined, "invalid", "all", "processing", "completed", "failed"])(
        "normalizes sync filter %s and bounds the list to 100 newest",
        async (status) => {
            const data = await getAdminSyncs({ status });
            const expected =
                status && ["processing", "completed", "failed"].includes(status)
                    ? status
                    : "all";
            expect(data.status).toBe(expected);
            expect(data.syncs).toEqual([]);
            expect(mocks.syncs).toHaveBeenCalledWith(
                expect.objectContaining({
                    where:
                        expected === "all" ? undefined : { status: expected },
                    orderBy: { started_at: "desc" },
                    take: 100,
                })
            );
            expect(mocks.history).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        first_sync_id: { in: [] },
                    }),
                })
            );
        }
    );
    it("normalizes coverage counts, missing groups and health without changing dates", async () => {
        const row = {
            id: 9,
            status: "processing",
            started_at: new Date(now.getTime() - 600000),
            inserted_plays: 2,
            changed_records: 1,
            _count: { playHistory: 2, recordSnapshots: 1 },
        };
        mocks.syncs.mockResolvedValue([row]);
        mocks.history
            .mockResolvedValueOnce([
                { first_sync_id: null, _count: { _all: 20 } },
                { first_sync_id: 9, _count: { _all: 2 } },
            ])
            .mockResolvedValueOnce([]);
        mocks.snapshot
            .mockResolvedValueOnce([{ sync_id: 9, _count: { _all: 1 } }])
            .mockResolvedValueOnce([]);
        const data = await getAdminSyncs({ status: "processing" });
        expect(data.syncs[0]).toMatchObject({
            ...row,
            storedRecentCount: 2,
            storedSnapshotCount: 1,
            recentJudgementCount: 2,
            recentFastSlowCount: 0,
            snapshotJudgementCount: 1,
            snapshotNoteRateCount: 0,
            health: { label: "처리 지연", needsAttention: true },
        });
        expect(mocks.history).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({ first_sync_id: { in: [9] } }),
            })
        );
    });
    it("propagates query failures instead of rendering invented zero totals", async () => {
        mocks.syncs.mockRejectedValueOnce(new Error("database unavailable"));
        await expect(getAdminSyncs({})).rejects.toThrow("database unavailable");
    });
});
