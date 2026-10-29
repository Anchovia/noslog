import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    musicFindMany: vi.fn(),
    candidateFindUnique: vi.fn(),
    candidateCreate: vi.fn(),
    candidateUpdate: vi.fn(),
    candidateFindMany: vi.fn(),
    candidateCreateMany: vi.fn(),
    candidateUpdateMany: vi.fn(),
    candidateCount: vi.fn(),
    transaction: vi.fn(),
    updateMusic: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/db", () => ({
    default: {
        $transaction: mocks.transaction,
        music: { findMany: mocks.musicFindMany },
        musicCatalogCandidate: {
            findUnique: mocks.candidateFindUnique,
            create: mocks.candidateCreate,
            update: mocks.candidateUpdate,
            findMany: mocks.candidateFindMany,
            createMany: mocks.candidateCreateMany,
            updateMany: mocks.candidateUpdateMany,
            count: mocks.candidateCount,
        },
    },
}));

vi.mock("@/lib/services/music/update-music", () => ({
    updateMusic: mocks.updateMusic,
}));

import {
    describeMusicCatalogChanges,
    processBemaniCatalogUpdates,
} from "@/lib/services/music/catalog-sync";
import type { SyncMusicInput } from "@/lib/services/music/update-music";

function chart(
    difficulty: "Normal" | "Hard" | "Expert" | "Real",
    level: number
) {
    return {
        difficulty,
        level,
        score: 0,
        rank: "no",
        fc_type: 0,
        play_count: 0,
        clear_count: 0,
        clear_flag: [0] as [number],
        fullcombo_count: 0,
        pianistic_count: 0,
        max_combo: 0,
        grade_basic: 0,
        grade_recital: 0,
        judge: [0, 0, 0, 0, 0] as [number, number, number, number, number],
        note_success_rate: [-1, -1, -1, -1] as [number, number, number, number],
        besttime: "",
    };
}

function bemaniMusic(): SyncMusicInput {
    return {
        "@index": "sasoribi",
        title: "ピアノ協奏曲第1番“蠍火”",
        title_kana: "ピアノキョウソウキョク",
        artist: "Virkato Wakhmaninov",
        category: "BEMANI楽曲",
        category_short: "BM",
        description: null,
        license: "",
        unlock_type: 0,
        sheet: [
            chart("Normal", 6),
            chart("Hard", 9),
            chart("Expert", 12),
            chart("Real", 3),
        ],
    };
}

function newMusic(count: number): SyncMusicInput[] {
    return Array.from({ length: count }, (_, index) => ({
        ...bemaniMusic(),
        "@index": `new-music-${index}`,
    }));
}

function storedMusic() {
    return {
        index: "sasoribi",
        title: "ピアノ協奏曲第1番“蠍火”",
        titleKana: "ピアノキョウソウキョク",
        artist: "Virkato Wakhmaninov",
        category: "BEMANI楽曲",
        categoryShort: "BM",
        description: null,
        license: "",
        unlockType: 0,
        charts: [
            { difficulty: "Normal", level: 6 },
            { difficulty: "Hard", level: 9 },
            { difficulty: "Expert", level: 12 },
        ],
    };
}

describe("BEMANI 악곡 카탈로그 자동 감지", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.musicFindMany.mockResolvedValue([storedMusic()]);
        mocks.candidateFindUnique.mockResolvedValue(null);
        mocks.candidateCreate.mockResolvedValue({ id: 1 });
        mocks.candidateUpdate.mockResolvedValue({ id: 1 });
        mocks.candidateFindMany.mockResolvedValue([]);
        mocks.candidateCreateMany.mockResolvedValue({ count: 1 });
        mocks.candidateUpdateMany.mockResolvedValue({ count: 1 });
        mocks.candidateCount.mockResolvedValue(0);
        mocks.transaction.mockImplementation((queries) => Promise.all(queries));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("일반 사용자에게서 발견한 신규 채보는 검토 대기로 저장한다", async () => {
        const result = await processBemaniCatalogUpdates(
            [bemaniMusic()],
            false,
            7
        );

        expect(result).toEqual({
            detected: 1,
            pending: 1,
            applied: 0,
            overLimit: 0,
        });
        expect(mocks.updateMusic).not.toHaveBeenCalled();
        // 한 번 읽고 묶어서 쓴다(2026-10-15 S9)
        expect(mocks.candidateFindMany).toHaveBeenCalledOnce();
        expect(mocks.candidateCreateMany).toHaveBeenCalledWith({
            data: [
                expect.objectContaining({
                    musicIndex: "sasoribi",
                    status: "pending",
                    payload: expect.objectContaining({
                        charts: expect.arrayContaining([
                            { difficulty: "Real", level: 3 },
                        ]),
                    }),
                }),
            ],
            skipDuplicates: true,
        });
    });

    it("다시 본 후보는 횟수만 더하고 반려된 후보는 상태를 그대로 둔다", async () => {
        mocks.candidateFindMany.mockImplementation(
            async ({ where }: { where: { OR: { fingerprint: string }[] } }) => [
                {
                    id: 5,
                    musicIndex: "sasoribi",
                    fingerprint: where.OR[0].fingerprint,
                    status: "rejected",
                },
            ]
        );
        await processBemaniCatalogUpdates([bemaniMusic()], false, 7);

        expect(mocks.candidateCreateMany).not.toHaveBeenCalled();
        expect(mocks.candidateUpdateMany).toHaveBeenCalledOnce();
        expect(mocks.candidateUpdateMany).toHaveBeenCalledWith({
            where: { id: { in: [5] } },
            data: { seenCount: { increment: 1 }, lastSeenAt: expect.any(Date) },
        });
    });

    it("관리자 연동에서 발견한 신규 채보는 즉시 반영하고 이력으로 남긴다", async () => {
        const input = bemaniMusic();
        const result = await processBemaniCatalogUpdates([input], true, 7);

        expect(result).toEqual({
            detected: 1,
            pending: 0,
            applied: 1,
            overLimit: 0,
        });
        expect(mocks.updateMusic).toHaveBeenCalledWith([input]);
        expect(mocks.candidateCreate).toHaveBeenCalledWith({
            data: expect.objectContaining({
                musicIndex: "sasoribi",
                status: "applied",
                reviewedAt: expect.any(Date),
                appliedAt: expect.any(Date),
            }),
            select: { id: true },
        });
    });

    it("이미 일치하는 카탈로그는 후보나 이력을 추가하지 않는다", async () => {
        mocks.musicFindMany.mockResolvedValue([
            {
                ...storedMusic(),
                charts: [
                    ...storedMusic().charts,
                    { difficulty: "Real", level: 3 },
                ],
            },
        ]);

        const result = await processBemaniCatalogUpdates(
            [bemaniMusic()],
            false,
            7
        );

        expect(result).toEqual({
            detected: 0,
            pending: 0,
            applied: 0,
            overLimit: 0,
        });
        expect(mocks.candidateCreate).not.toHaveBeenCalled();
        expect(mocks.updateMusic).not.toHaveBeenCalled();
    });

    it("일반 사용자 동기화 한 번은 새 후보를 20개까지만 만들고 제출자를 남긴다", async () => {
        const result = await processBemaniCatalogUpdates(
            newMusic(25),
            false,
            7
        );

        expect(result).toEqual({
            detected: 25,
            pending: 20,
            applied: 0,
            overLimit: 5,
        });
        const [{ data }] = mocks.candidateCreateMany.mock.calls[0];
        expect(data).toHaveLength(20);
        expect(data[19].musicIndex).toBe("new-music-19");
        for (const row of data) expect(row.submittedById).toBe(7);
    });

    it("같은 사람이 24시간 안에 만든 후보까지 합쳐 100개를 넘기지 않는다", async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-10-29T03:00:00Z"));
        mocks.candidateCount.mockResolvedValue(95);

        const result = await processBemaniCatalogUpdates(
            newMusic(10),
            false,
            7
        );

        expect(mocks.candidateCount).toHaveBeenCalledWith({
            where: {
                submittedById: 7,
                createdAt: { gte: new Date("2026-10-28T03:00:00Z") },
            },
        });
        expect(result).toMatchObject({ pending: 5, overLimit: 5 });
        expect(mocks.candidateCreateMany.mock.calls[0][0].data).toHaveLength(5);
    });

    it("24시간 상한에 닿으면 새 후보는 만들지 않고 이미 있는 후보만 다시 본다", async () => {
        mocks.candidateCount.mockResolvedValue(100);
        mocks.candidateFindMany.mockImplementation(
            async ({ where }: { where: { OR: { fingerprint: string }[] } }) => [
                {
                    id: 9,
                    musicIndex: "new-music-0",
                    fingerprint: where.OR[0].fingerprint,
                    status: "pending",
                },
            ]
        );

        const result = await processBemaniCatalogUpdates(newMusic(3), false, 7);

        expect(result).toEqual({
            detected: 3,
            pending: 1,
            applied: 0,
            overLimit: 2,
        });
        expect(mocks.candidateCreateMany).not.toHaveBeenCalled();
        expect(mocks.candidateUpdateMany).toHaveBeenCalledWith({
            where: { id: { in: [9] } },
            data: {
                seenCount: { increment: 1 },
                lastSeenAt: expect.any(Date),
                status: "pending",
            },
        });
    });

    it("관리자 동기화는 상한 없이 모두 반영한다", async () => {
        const input = newMusic(25);
        const result = await processBemaniCatalogUpdates(input, true, 7);

        expect(result).toEqual({
            detected: 25,
            pending: 0,
            applied: 25,
            overLimit: 0,
        });
        expect(mocks.updateMusic).toHaveBeenCalledWith(input);
        expect(mocks.candidateCreate).toHaveBeenCalledTimes(25);
        expect(mocks.candidateCount).not.toHaveBeenCalled();
    });

    it("관리자 화면용 변경 내용을 난이도 단위로 설명한다", () => {
        const before = {
            musicIndex: "sasoribi",
            title: "피아노 협주곡",
            titleKana: "피아노",
            artist: "artist",
            category: "BEMANI",
            categoryShort: "BM",
            description: null,
            license: "",
            unlockType: 0,
            charts: [{ difficulty: "Expert" as const, level: 12 }],
        };
        const payload = {
            ...before,
            charts: [
                ...before.charts,
                { difficulty: "Real" as const, level: 3 },
            ],
        };

        expect(describeMusicCatalogChanges(before, payload)).toEqual([
            "Real 3 추가",
        ]);
    });
});
