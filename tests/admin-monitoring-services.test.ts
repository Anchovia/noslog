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

import { getAdminDashboard } from "@/features/admin/server/adminDashboardService";
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
    it.each(["dashboard", "syncs"])(
        "checks authority before %s data access",
        async (scope) => {
            mocks.admin.mockRejectedValue(new Error("not authorized"));
            await expect(
                scope === "dashboard" ? getAdminDashboard() : getAdminSyncs({})
            ).rejects.toThrow("not authorized");
            for (const [key, mock] of Object.entries(mocks))
                if (key !== "admin") expect(mock).not.toHaveBeenCalled();
        }
    );
    it("retains 24-hour, 10-minute and seven-calendar-day dashboard windows", async () => {
        const start = new Date(2026, 7, 30);
        mocks.users.mockResolvedValue([
            { created_at: start },
            { created_at: now },
            { created_at: new Date(2020, 0, 1) },
        ]);
        mocks.syncs.mockResolvedValue([
            { started_at: now },
            { started_at: now },
        ]);
        mocks.feedback.mockResolvedValue([{ createdAt: start }]);
        const data = await getAdminDashboard();
        expect(data.activity).toHaveLength(7);
        expect(data.activity[0]).toMatchObject({
            date: "8.30",
            users: 1,
            feedback: 1,
            syncs: 0,
        });
        expect(data.activity[6]).toMatchObject({
            date: "9.05",
            users: 1,
            feedback: 0,
            syncs: 2,
        });
        expect(data.userCount).toBe(2);
        expect(mocks.users).toHaveBeenCalledWith({
            where: { created_at: { gte: start } },
            select: { created_at: true },
        });
        expect(mocks.syncCount).toHaveBeenCalledWith({
            where: {
                status: "failed",
                started_at: { gte: new Date(now.getTime() - 86400000) },
            },
        });
        expect(mocks.syncCount).toHaveBeenCalledWith({
            where: {
                status: "processing",
                started_at: { lte: new Date(now.getTime() - 600000) },
            },
        });
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
        mocks.submission.mockRejectedValueOnce(
            new Error("database unavailable")
        );
        await expect(getAdminDashboard()).rejects.toThrow(
            "database unavailable"
        );
        mocks.syncs.mockRejectedValueOnce(new Error("database unavailable"));
        await expect(getAdminSyncs({})).rejects.toThrow("database unavailable");
    });
});
