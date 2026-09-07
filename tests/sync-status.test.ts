import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    attempts: vi.fn(),
    previous: vi.fn(),
    count: vi.fn(),
    timing: vi.fn(),
    records: vi.fn(),
    recent: vi.fn(),
    session: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({
    default: {
        dataSync: { findMany: mocks.attempts, findFirst: mocks.previous },
        playData: { count: mocks.count },
        chartPlayHistory: { groupBy: mocks.timing, findMany: mocks.recent },
        chartRecordSnapshot: { findMany: mocks.records },
    },
}));
vi.mock("@/lib/session", () => ({ default: mocks.session }));
vi.mock("@/lib/i18n/server", () => ({
    getServerI18n: async () => ({ t: (key: string) => key }),
}));
import {
    classifySyncAttempt,
    getSyncStatus,
} from "@/features/sync/server/syncStatusService";
import { GET } from "@/app/api/sync/status/route";

const now = new Date("2026-09-07T00:00:00.000Z");
const attempt = {
    id: 40,
    status: "completed",
    sync_scope: "full",
    received_plays: 30,
    inserted_plays: 0,
    changed_records: 1,
    error_message: null as string | null,
    started_at: new Date(now.getTime() - 120000),
    completed_at: new Date(now.getTime() - 110000),
};
beforeEach(() => {
    vi.clearAllMocks();
    mocks.attempts.mockResolvedValue([attempt]);
    mocks.previous.mockResolvedValue({ id: 39 });
    mocks.count.mockResolvedValue(12);
    mocks.timing.mockResolvedValue([{ chart_id: 1 }]);
    mocks.records.mockResolvedValue([]);
    mocks.recent.mockResolvedValue([]);
    mocks.session.mockResolvedValue({ id: 7 });
});

describe("P8 safe own-account sync status", () => {
    it.each([
        [599999, "processing"],
        [600000, "delayed"],
        [899999, "delayed"],
        [900000, "timedOut"],
    ])("classifies the %i ms processing boundary as %s", (age, status) => {
        expect(
            classifySyncAttempt(
                {
                    status: "processing",
                    error_message: null,
                    started_at: new Date(now.getTime() - Number(age)),
                },
                now
            )
        ).toBe(status);
    });
    it("keeps persistent coverage when no attempt exists", async () => {
        mocks.attempts.mockResolvedValue([]);
        const result = await getSyncStatus(7, now);
        expect(result.attempts).toEqual([]);
        expect(result.coverage).toEqual({
            played: 12,
            judgement: 12,
            timing: 1,
        });
        expect(mocks.records).not.toHaveBeenCalled();
    });
    it("returns only a safe count from the known exclusion diagnostic", async () => {
        mocks.attempts.mockResolvedValue([
            {
                ...attempt,
                error_message:
                    "DB에 등록되지 않은 채보 3개를 건너뛰었습니다: SECRET_CHART_IDS",
            },
        ]);
        const result = await getSyncStatus(7, now);
        expect(result.attempts[0]).toMatchObject({
            status: "partial",
            excludedCount: 3,
        });
        expect(JSON.stringify(result)).not.toContain("SECRET");
    });
    it("does not guess token or official login failures from an arbitrary diagnostic", async () => {
        mocks.attempts.mockResolvedValue([
            {
                ...attempt,
                status: "failed",
                error_message: "SECRET TOKEN database error",
            },
        ]);
        const result = await getSyncStatus(7, now);
        expect(result.attempts[0]).toMatchObject({
            status: "failed",
            excludedCount: null,
        });
        expect(JSON.stringify(result)).not.toContain("SECRET");
        expect(mocks.records).not.toHaveBeenCalled();
    });
    it("uses newly stored recent plays for recent-only previews and preserves coverage", async () => {
        mocks.attempts.mockResolvedValue([
            { ...attempt, sync_scope: "recent" },
        ]);
        mocks.recent.mockResolvedValue([
            {
                score: 900000,
                chart: {
                    music_idx: "music",
                    difficulty: "EXPERT",
                    level: 12,
                    music: { title: "曲" },
                },
            },
        ]);
        const result = await getSyncStatus(7, now);
        expect(result.previews[0]).toMatchObject({
            musicId: "music",
            difficulty: "EXPERT",
            score: 900000,
        });
        expect(mocks.recent).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { user_id: 7, first_sync_id: 40 },
                take: 3,
            })
        );
        expect(result.coverage.played).toBe(12);
        expect(mocks.records).not.toHaveBeenCalled();
    });
    it("summarizes a first full import beyond the three-preview capacity", async () => {
        mocks.previous.mockResolvedValue(null);
        mocks.attempts.mockResolvedValue([
            { ...attempt, changed_records: 500 },
        ]);
        const result = await getSyncStatus(7, now);
        expect(result.firstFullImport).toBe(true);
        expect(result.previews).toEqual([]);
    });
    it("derives cooldown from the server clock and clamps future timestamps", async () => {
        mocks.attempts.mockResolvedValue([
            { ...attempt, started_at: new Date(now.getTime() - 18000) },
        ]);
        expect((await getSyncStatus(7, now)).retryAfter).toBe(12);
        mocks.attempts.mockResolvedValue([
            { ...attempt, started_at: new Date(now.getTime() + 1000) },
        ]);
        expect((await getSyncStatus(7, now)).retryAfter).toBe(30);
    });
    it("rejects guests before querying any personal information", async () => {
        mocks.session.mockResolvedValue({});
        const response = await GET();
        expect(response.status).toBe(401);
        expect(response.headers.get("cache-control")).toContain("no-store");
        expect(mocks.attempts).not.toHaveBeenCalled();
    });
    it("limits every query to the authenticated owner and five attempts", async () => {
        const response = await GET();
        expect(response.status).toBe(200);
        expect(mocks.attempts).toHaveBeenCalledWith(
            expect.objectContaining({ where: { user_id: 7 }, take: 5 })
        );
        expect(await response.json()).toMatchObject({
            isSuccess: true,
            result: { coverage: { played: 12 } },
        });
    });
});
