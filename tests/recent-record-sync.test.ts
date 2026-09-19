import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Prisma } from "@prisma/client";
import type { SyncMusicInput } from "@/lib/services/music/updateMusic";
import type {
    PendingRecordPlay,
    RecordValues,
} from "@/lib/services/user/recentRecordMerge";

const mocks = vi.hoisted(() => ({
    db: {
        $queryRaw: vi.fn(),
        $transaction: vi.fn(),
        musicChart: { findMany: vi.fn() },
        dataSync: { findUniqueOrThrow: vi.fn() },
        user: { findUniqueOrThrow: vi.fn(), update: vi.fn() },
        playData: {
            findMany: vi.fn(),
            upsert: vi.fn(),
            deleteMany: vi.fn(),
            createMany: vi.fn(),
        },
        chartPlayHistory: { findMany: vi.fn(), updateMany: vi.fn() },
        chartRecordSnapshot: { upsert: vi.fn(), createMany: vi.fn() },
    },
}));
vi.mock("@/lib/db", () => ({ default: mocks.db }));
import { updateRecentBestRecords } from "@/lib/services/user/updateRecentBestRecords";
import { updatePlayData } from "@/lib/services/user/updatePlayData";

const chart = {
    id: 10,
    music_idx: "test",
    difficulty: "Expert",
    level: 12,
    note_count: 1000,
    level_constant: 12,
};
type StoredRecord = RecordValues & {
    user_id: number;
    chart_id: number;
    music_idx: string;
    difficulty: string;
};
type History = PendingRecordPlay & { user_id: number; chart: typeof chart };
type State = {
    records: StoredRecord[];
    history: History[];
    snapshots: Prisma.ChartRecordSnapshotCreateManyInput[];
    fullAt: Date | null;
    stats: Record<string, unknown>;
};
let state: State;
let syncTime: Date;
const history = (id: number, date: string, score = 950000): History => ({
    id,
    chart_id: 10,
    user_id: 1,
    record_applied: false,
    chart,
    level: 12,
    score,
    rank: "S",
    max_combo: 900,
    grade_basic: 10000,
    source_play_time: date,
    judge_sjust: 900,
    judge_just: 80,
    judge_good: 10,
    judge_miss: 10,
    judge_near: 0,
});
const full = (count = 100): SyncMusicInput[] => [
    {
        "@index": "test",
        title: "Test",
        title_kana: "",
        artist: "Test",
        category: "Test",
        category_short: "T",
        description: null,
        license: "",
        unlock_type: 0,
        sheet: [
            {
                difficulty: "Expert",
                level: 12,
                score: 980000,
                rank: "S",
                fc_type: 2,
                play_count: count,
                clear_count: 90,
                clear_flag: [1],
                fullcombo_count: 10,
                pianistic_count: 0,
                max_combo: 1000,
                grade_basic: 12000,
                grade_recital: 8000,
                judge: [950, 40, 10, 0, 0],
                note_success_rate: [9800, 9700, 9600, 9500],
                besttime: "2026/09/19 10:00",
            },
        ],
    },
];

beforeEach(() => {
    vi.resetAllMocks();
    state = {
        records: [],
        history: [],
        snapshots: [],
        fullAt: null,
        stats: {},
    };
    syncTime = new Date("2026-09-20T02:00:00Z");
    mocks.db.$transaction.mockImplementation(
        async (callback: (tx: typeof mocks.db) => Promise<unknown>) => {
            const before = structuredClone(state);
            try {
                return await callback(mocks.db);
            } catch (error) {
                state = before;
                throw error;
            }
        }
    );
    mocks.db.dataSync.findUniqueOrThrow.mockImplementation(async () => ({
        id: 1,
        started_at: syncTime,
    }));
    mocks.db.musicChart.findMany.mockResolvedValue([chart]);
    mocks.db.user.findUniqueOrThrow.mockImplementation(async () => ({
        last_full_record_at: state.fullAt,
    }));
    mocks.db.user.update.mockImplementation(
        async ({ data }: { data: Record<string, unknown> }) => {
            if (data.last_full_record_at instanceof Date)
                state.fullAt = data.last_full_record_at;
            state.stats = { ...state.stats, ...data };
        }
    );
    mocks.db.playData.findMany.mockImplementation(
        async ({ where }: { where: { user_id: number } }) =>
            state.records.filter((r) => r.user_id === where.user_id)
    );
    mocks.db.playData.upsert.mockImplementation(
        async ({
            create,
            update,
        }: {
            create: StoredRecord;
            update: RecordValues;
        }) => {
            const existing = state.records.find(
                (r) =>
                    r.chart_id === create.chart_id &&
                    r.user_id === create.user_id
            );
            if (existing) Object.assign(existing, update);
            else state.records.push(structuredClone(create));
        }
    );
    mocks.db.playData.deleteMany.mockImplementation(
        async ({ where }: { where: { user_id: number } }) => {
            state.records = state.records.filter(
                (r) => r.user_id !== where.user_id
            );
        }
    );
    mocks.db.playData.createMany.mockImplementation(
        async ({ data }: { data: StoredRecord[] }) => {
            state.records.push(...structuredClone(data));
        }
    );
    mocks.db.chartPlayHistory.findMany.mockImplementation(
        async ({ where }: { where: { user_id: number } }) =>
            state.history.filter(
                (h) =>
                    h.user_id === where.user_id &&
                    (!h.record_applied || h.grade_basic === 0)
            )
    );
    mocks.db.chartPlayHistory.updateMany.mockImplementation(
        async ({
            where,
        }: {
            where: { user_id: number; id?: { in: number[] } };
        }) => {
            state.history.forEach((h) => {
                if (
                    h.user_id === where.user_id &&
                    (!where.id || where.id.in.includes(h.id))
                )
                    h.record_applied = true;
            });
        }
    );
    mocks.db.chartRecordSnapshot.upsert.mockImplementation(
        async ({
            create,
        }: {
            create: Prisma.ChartRecordSnapshotCreateManyInput;
        }) => {
            const existing = state.snapshots.find(
                (s) =>
                    s.chart_id === create.chart_id &&
                    s.sync_id === create.sync_id
            );
            if (existing) Object.assign(existing, create);
            else state.snapshots.push(structuredClone(create));
        }
    );
    mocks.db.chartRecordSnapshot.createMany.mockImplementation(
        async ({
            data,
        }: {
            data: Prisma.ChartRecordSnapshotCreateManyInput[];
        }) => {
            state.snapshots.push(...structuredClone(data));
        }
    );
});

describe("recent/full record persistence with an isolated transaction double", () => {
    it("applies existing stored history once, preserves other users and updates distribution", async () => {
        state.history.push(
            history(1, "2026/09/20 10:00"),
            history(2, "2026/09/20 10:10", 990000),
            { ...history(3, "2026/09/20 10:20"), user_id: 2 }
        );
        expect(await updateRecentBestRecords(1, 1)).toBe(1);
        expect(state.records[0]).toMatchObject({
            play_count: 2,
            score: 990000,
            grade_recital: null,
        });
        expect(state.stats.score_s).toBe(1);
        expect(state.history[2].record_applied).toBe(false);
        expect(await updateRecentBestRecords(1, 2)).toBe(0);
        expect(state.records[0].play_count).toBe(2);
        expect(state.snapshots).toHaveLength(1);
        expect(mocks.db.$queryRaw).toHaveBeenCalled();
    });
    it("rolls back both records and receipts on failure, then retries without losing a play", async () => {
        state.history.push(history(1, "2026/09/20 10:00"));
        mocks.db.chartPlayHistory.updateMany.mockRejectedValueOnce(
            new Error("receipt failed")
        );
        await expect(updateRecentBestRecords(1, 1)).rejects.toThrow(
            "receipt failed"
        );
        expect(state.records).toEqual([]);
        expect(state.snapshots).toEqual([]);
        expect(state.history[0].record_applied).toBe(false);
        await updateRecentBestRecords(1, 2);
        expect(state.records[0].play_count).toBe(1);
    });
    it("does not consume receipts if the distribution update fails", async () => {
        state.history.push(history(1, "2026/09/20 10:00"));
        mocks.db.user.update.mockRejectedValueOnce(new Error("stats failed"));
        await expect(updateRecentBestRecords(1, 1)).rejects.toThrow(
            "stats failed"
        );
        expect(state.history[0].record_applied).toBe(false);
        expect(state.records).toHaveLength(0);
    });
    it("handles never-subscribed → full → expired → renewed → expired", async () => {
        state.history.push(history(1, "2026/09/20 10:00"));
        await updateRecentBestRecords(1, 1);
        expect(state.records[0].play_count).toBe(1);
        await updatePlayData(1, full(), 2);
        expect(state.records[0]).toMatchObject({
            play_count: 100,
            score: 980000,
            grade_recital: 8000,
        });
        expect(state.fullAt).toEqual(syncTime);
        // A newly discovered overlap is not a new lifetime play.
        state.history.push(
            history(2, "2026/09/20 10:30"),
            history(3, "2026/09/20 12:00", 995000)
        );
        await updateRecentBestRecords(1, 3);
        expect(state.records[0]).toMatchObject({
            play_count: 101,
            score: 995000,
            grade_recital: 8000,
            note_rate_standard: 9800,
        });
        const beforeRenewalHistory = state.history.length;
        syncTime = new Date("2026-09-21T02:00:00Z");
        const renewed = full(200);
        renewed[0].sheet[0].score = 995000;
        await updatePlayData(1, renewed, 4);
        expect(state.records[0].play_count).toBe(200);
        expect(state.history).toHaveLength(beforeRenewalHistory);
        state.history.push(
            history(4, "2026/09/21 10:00"),
            history(5, "2026/09/21 12:00", 999000)
        );
        await updateRecentBestRecords(1, 5);
        expect(state.records[0]).toMatchObject({
            play_count: 201,
            score: 999000,
            grade_recital: 8000,
        });
        expect(state.snapshots).toHaveLength(5);
    });
    it("rolls back a failed full replacement without losing existing partial records", async () => {
        state.history.push(history(1, "2026/09/20 10:00"));
        await updateRecentBestRecords(1, 1);
        const before = structuredClone(state);
        mocks.db.playData.createMany.mockRejectedValueOnce(
            new Error("full import failed")
        );
        await expect(updatePlayData(1, full(), 2)).rejects.toThrow(
            "full import failed"
        );
        expect(state).toEqual(before);
    });
    it("rejects a timed-out or foreign sync before modifying records", async () => {
        state.history.push(history(1, "2026/09/20 10:00"));
        mocks.db.dataSync.findUniqueOrThrow.mockRejectedValueOnce(
            new Error("stale sync")
        );
        await expect(updateRecentBestRecords(1, 2)).rejects.toThrow(
            "stale sync"
        );
        expect(state.records).toEqual([]);
        expect(mocks.db.dataSync.findUniqueOrThrow).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 2, user_id: 1, status: "processing" },
            })
        );
    });
});

it("repairs already applied zero Grd transactionally without incrementing attempts", async () => {
    const play = {
        ...history(900, "2026/09/20 10:00"),
        grade_basic: 0,
        is_onehand: false,
    };
    state.history.push(play);
    await updateRecentBestRecords(1, 1);
    const record = state.records.find((r) => r.chart_id === 10)!;
    record.grade_basic = 0;
    const counts = record.play_count;
    expect(await updateRecentBestRecords(1, 2)).toBe(1);
    expect(record.grade_basic).toBeGreaterThan(0);
    expect(record.play_count).toBe(counts);
    expect(state.history.find((h) => h.id === 900)?.grade_basic).toBe(0);
    expect(await updateRecentBestRecords(1, 3)).toBe(0);
});
