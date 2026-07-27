import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    musicFindMany: vi.fn(),
    candidateFindUnique: vi.fn(),
    candidateCreate: vi.fn(),
    candidateUpdate: vi.fn(),
    updateMusic: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/db", () => ({
    default: {
        music: { findMany: mocks.musicFindMany },
        musicCatalogCandidate: {
            findUnique: mocks.candidateFindUnique,
            create: mocks.candidateCreate,
            update: mocks.candidateUpdate,
        },
    },
}));

vi.mock("@/lib/services/music/updateMusic", () => ({
    updateMusic: mocks.updateMusic,
}));

import {
    describeMusicCatalogChanges,
    processBemaniCatalogUpdates,
} from "@/lib/services/music/catalogSync";
import type { SyncMusicInput } from "@/lib/services/music/updateMusic";

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

function storedMusic() {
    return {
        index: "sasoribi",
        title: "ピアノ協奏曲第1番“蠍火”",
        title_kana: "ピアノキョウソウキョク",
        artist: "Virkato Wakhmaninov",
        category: "BEMANI楽曲",
        category_short: "BM",
        description: null,
        license: "",
        unlock_type: 0,
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
    });

    it("일반 사용자에게서 발견한 신규 채보는 검토 대기로 저장한다", async () => {
        const result = await processBemaniCatalogUpdates(
            [bemaniMusic()],
            false
        );

        expect(result).toEqual({ detected: 1, pending: 1, applied: 0 });
        expect(mocks.updateMusic).not.toHaveBeenCalled();
        expect(mocks.candidateCreate).toHaveBeenCalledWith({
            data: expect.objectContaining({
                musicIndex: "sasoribi",
                status: "pending",
                payload: expect.objectContaining({
                    charts: expect.arrayContaining([
                        { difficulty: "Real", level: 3 },
                    ]),
                }),
            }),
            select: { id: true },
        });
    });

    it("관리자 연동에서 발견한 신규 채보는 즉시 반영하고 이력으로 남긴다", async () => {
        const input = bemaniMusic();
        const result = await processBemaniCatalogUpdates([input], true);

        expect(result).toEqual({ detected: 1, pending: 0, applied: 1 });
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
            false
        );

        expect(result).toEqual({ detected: 0, pending: 0, applied: 0 });
        expect(mocks.candidateCreate).not.toHaveBeenCalled();
        expect(mocks.updateMusic).not.toHaveBeenCalled();
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
