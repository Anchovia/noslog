import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Prisma } from "@prisma/client";
import type { SyncMusicInput } from "@/lib/services/music/update-music";
import type {
    PendingRecordPlay,
    RecordValues,
} from "@/lib/services/user/recent-record-merge";

const mocks = vi.hoisted(() => ({
    db: {
        $queryRaw: vi.fn(),
        $executeRaw: vi.fn(),
        $transaction: vi.fn(),
        musicChart: { findMany: vi.fn() },
        dataSync: { findUniqueOrThrow: vi.fn() },
        user: { findUniqueOrThrow: vi.fn(), update: vi.fn() },
        playerStats: { upsert: vi.fn(), findUnique: vi.fn() },
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
import { updateRecentBestRecords } from "@/lib/services/user/update-recent-best-records";
import { updatePlayData } from "@/lib/services/user/update-play-data";
import { recordBestAt } from "@/lib/services/user/recent-record-merge";

const chart = {
    id: 10,
    musicIdx: "test",
    difficulty: "Expert",
    level: 12,
    noteCount: 1000,
    levelConstant: 12,
};
type StoredRecord = RecordValues & {
    userId: number;
    chartId: number;
};
type History = PendingRecordPlay & { userId: number; chart: typeof chart };
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
    chartId: 10,
    userId: 1,
    recordApplied: false,
    chart,
    level: 12,
    score,
    rank: "S",
    maxCombo: 900,
    gradeBasic: 10000,
    playedAt: recordBestAt(date)!,
    judgeSjust: 900,
    judgeJust: 80,
    judgeGood: 10,
    judgeMiss: 10,
    judgeNear: 0,
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
        startedAt: syncTime,
    }));
    mocks.db.musicChart.findMany.mockResolvedValue([chart]);
    // 랭크별 수(2026-10-15 S9) — 서비스가 SQL 로 세는 값을 같은 규칙으로 메모리에서 센다. 그 밖(행 잠금)은 빈 결과
    mocks.db.$queryRaw.mockImplementation(
        async (strings: TemplateStringsArray, ...values: unknown[]) => {
            if (!strings.join("?").includes("FILTER")) return [];
            const played = state.records.filter(
                (record) => record.userId === values[0] && record.playCount > 0
            );
            const rank = (value: string) =>
                played.filter((record) => record.rank === value).length;
            return [
                {
                    p: rank("P"),
                    s: rank("S"),
                    a2: rank("A2"),
                    a: rank("A"),
                    b2: rank("B2"),
                    b: rank("B"),
                    c: rank("C"),
                    d: rank("D"),
                    f: played.filter((record) => record.fcType === 2).length,
                },
            ];
        }
    );
    mocks.db.playerStats.findUnique.mockImplementation(async () => ({
        lastFullRecordAt: state.fullAt,
    }));
    // 동기화 결과는 player_stats 에만 쓴다(2026-10-16 P5-1)
    mocks.db.playerStats.upsert.mockImplementation(
        async ({ update }: { update: Record<string, unknown> }) => {
            if (update.lastFullRecordAt instanceof Date)
                state.fullAt = update.lastFullRecordAt;
            state.stats = { ...state.stats, ...update };
        }
    );
    mocks.db.playData.findMany.mockImplementation(
        async ({ where }: { where: { userId: number } }) =>
            state.records.filter((r) => r.userId === where.userId)
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
                    r.chartId === create.chartId && r.userId === create.userId
            );
            if (existing) Object.assign(existing, update);
            else state.records.push(structuredClone(create));
        }
    );
    // 전체 기록(2026-10-15 D6) — 응답에 없는 채보만 지우고, 바뀐 줄은 (userId, chartId) 로 넣거나 고친다
    mocks.db.playData.deleteMany.mockImplementation(
        async ({
            where,
        }: {
            where: {
                userId: number;
                chartId: { notIn: number[] };
            };
        }) => {
            const kept = where.chartId.notIn;
            state.records = state.records.filter(
                (r) => r.userId !== where.userId || kept.includes(r.chartId)
            );
        }
    );
    const upsertColumns = [
        "userId",
        "chartId",
        "level",
        "score",
        "rank",
        "fcType",
        "playCount",
        "clearCount",
        "clearFlag",
        "fullcomboCount",
        "pianisticCount",
        "maxCombo",
        "gradeBasic",
        "gradeRecital",
        "judgeSjust",
        "judgeJust",
        "judgeGood",
        "judgeMiss",
        "judgeNear",
        "noteRateStandard",
        "noteRateTenuto",
        "noteRateGlissando",
        "noteRateTrill",
        "bestAt",
    ] as const;
    mocks.db.$executeRaw.mockImplementation(
        async (_strings: TemplateStringsArray, rows: Prisma.Sql) => {
            for (
                let start = 0;
                start < rows.values.length;
                start += upsertColumns.length
            ) {
                const row = Object.fromEntries(
                    upsertColumns.map((column, index) => [
                        column,
                        rows.values[start + index],
                    ])
                ) as StoredRecord;
                const existing = state.records.find(
                    (r) => r.chartId === row.chartId && r.userId === row.userId
                );
                if (existing) Object.assign(existing, row);
                else state.records.push(row);
            }
        }
    );
    mocks.db.chartPlayHistory.findMany.mockImplementation(
        async ({ where }: { where: { userId: number } }) =>
            state.history.filter(
                (h) =>
                    h.userId === where.userId &&
                    (!h.recordApplied || h.gradeBasic === 0)
            )
    );
    mocks.db.chartPlayHistory.updateMany.mockImplementation(
        async ({
            where,
        }: {
            where: { userId: number; id?: { in: number[] } };
        }) => {
            state.history.forEach((h) => {
                if (
                    h.userId === where.userId &&
                    (!where.id || where.id.in.includes(h.id))
                )
                    h.recordApplied = true;
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
                    s.chartId === create.chartId && s.syncId === create.syncId
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
            { ...history(3, "2026/09/20 10:20"), userId: 2 }
        );
        expect(await updateRecentBestRecords(1, 1)).toEqual({
            changedRecords: 1,
            changedChartIds: [10],
        });
        expect(state.records[0]).toMatchObject({
            playCount: 2,
            score: 990000,
            gradeRecital: null,
        });
        expect(state.stats.scoreS).toBe(1);
        expect(state.history[2].recordApplied).toBe(false);
        expect(await updateRecentBestRecords(1, 2)).toEqual({
            changedRecords: 0,
            changedChartIds: [],
        });
        expect(state.records[0].playCount).toBe(2);
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
        expect(state.history[0].recordApplied).toBe(false);
        await updateRecentBestRecords(1, 2);
        expect(state.records[0].playCount).toBe(1);
    });
    it("does not consume receipts if the distribution update fails", async () => {
        state.history.push(history(1, "2026/09/20 10:00"));
        mocks.db.playerStats.upsert.mockRejectedValueOnce(
            new Error("stats failed")
        );
        await expect(updateRecentBestRecords(1, 1)).rejects.toThrow(
            "stats failed"
        );
        expect(state.history[0].recordApplied).toBe(false);
        expect(state.records).toHaveLength(0);
    });
    it("handles never-subscribed → full → expired → renewed → expired", async () => {
        state.history.push(history(1, "2026/09/20 10:00"));
        await updateRecentBestRecords(1, 1);
        expect(state.records[0].playCount).toBe(1);
        expect(await updatePlayData(1, full(), 2)).toEqual({
            changedRecords: 1,
            changedChartIds: [10],
        });
        expect(state.records[0]).toMatchObject({
            playCount: 100,
            score: 980000,
            gradeRecital: 8000,
        });
        expect(state.fullAt).toEqual(syncTime);
        // A newly discovered overlap is not a new lifetime play.
        state.history.push(
            history(2, "2026/09/20 10:30"),
            history(3, "2026/09/20 12:00", 995000)
        );
        await updateRecentBestRecords(1, 3);
        expect(state.records[0]).toMatchObject({
            playCount: 101,
            score: 995000,
            gradeRecital: 8000,
            noteRateStandard: 9800,
        });
        const beforeRenewalHistory = state.history.length;
        syncTime = new Date("2026-09-21T02:00:00Z");
        const renewed = full(200);
        renewed[0].sheet[0].score = 995000;
        await updatePlayData(1, renewed, 4);
        expect(state.records[0].playCount).toBe(200);
        expect(state.history).toHaveLength(beforeRenewalHistory);
        state.history.push(
            history(4, "2026/09/21 10:00"),
            history(5, "2026/09/21 12:00", 999000)
        );
        await updateRecentBestRecords(1, 5);
        expect(state.records[0]).toMatchObject({
            playCount: 201,
            score: 999000,
            gradeRecital: 8000,
        });
        expect(state.snapshots).toHaveLength(5);
    });
    it("writes only changed full records and keeps unchanged rows in place", async () => {
        await updatePlayData(1, full(), 2);
        // 늘리기 단계 — User 와 같은 값을 player_stats 에도 쓴다(2026-10-16 P3)
        expect(mocks.db.playerStats.upsert).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { userId: 1 },
                update: expect.objectContaining({ lastFullRecordAt: syncTime }),
            })
        );
        mocks.db.$executeRaw.mockClear();
        expect(await updatePlayData(1, full(), 3)).toEqual({
            changedRecords: 0,
            changedChartIds: [],
        });
        expect(mocks.db.$executeRaw).not.toHaveBeenCalled();
        expect(state.records).toHaveLength(1);
        expect(state.snapshots).toHaveLength(1);
    });
    it("keeps the existing row and its clear count when the chart was rejected by the range check", async () => {
        await updatePlayData(1, full(), 2);
        mocks.db.playerStats.upsert.mockClear();
        const before = structuredClone(state.records);

        const result = await updatePlayData(1, [], 3, undefined, [10]);

        expect(state.records).toEqual(before);
        expect(result.changedChartIds).toEqual([]);
        expect(mocks.db.playerStats.upsert).toHaveBeenCalledWith(
            expect.objectContaining({
                update: expect.objectContaining({
                    [`score${before[0].rank}`]: 1,
                }),
            })
        );

        await updatePlayData(1, [], 4);
        expect(state.records).toHaveLength(0);
    });
    it("rolls back a failed full replacement without losing existing partial records", async () => {
        state.history.push(history(1, "2026/09/20 10:00"));
        await updateRecentBestRecords(1, 1);
        const before = structuredClone(state);
        mocks.db.$executeRaw.mockRejectedValueOnce(
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
                where: { id: 2, userId: 1, status: "processing" },
            })
        );
    });
});

it("repairs already applied zero Grd transactionally without incrementing attempts", async () => {
    const play = {
        ...history(900, "2026/09/20 10:00"),
        gradeBasic: 0,
        isOnehand: false,
    };
    state.history.push(play);
    await updateRecentBestRecords(1, 1);
    const record = state.records.find((r) => r.chartId === 10)!;
    record.gradeBasic = 0;
    const counts = record.playCount;
    expect((await updateRecentBestRecords(1, 2)).changedRecords).toBe(1);
    expect(record.gradeBasic).toBeGreaterThan(0);
    expect(record.playCount).toBe(counts);
    expect(state.history.find((h) => h.id === 900)?.gradeBasic).toBe(0);
    expect((await updateRecentBestRecords(1, 3)).changedRecords).toBe(0);
});
