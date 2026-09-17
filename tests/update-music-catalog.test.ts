import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    musicFindMany: vi.fn(),
    musicCreateMany: vi.fn(),
    musicUpdate: vi.fn(),
    chartUpsert: vi.fn(),
    transaction: vi.fn(),
    getLocalJacketUrl: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
    default: {
        music: {
            findMany: mocks.musicFindMany,
            createMany: mocks.musicCreateMany,
            update: mocks.musicUpdate,
        },
        musicChart: { upsert: mocks.chartUpsert },
        $transaction: mocks.transaction,
    },
}));
vi.mock("@/lib/musicJackets", () => ({
    getLocalJacketUrl: mocks.getLocalJacketUrl,
    isManualJacketUrl: (url: string | null | undefined) =>
        Boolean(url?.includes("/jackets/manual/")),
}));

import { updateMusic } from "@/lib/services/music/updateMusic";

describe("BEMANI 악곡 카탈로그 반영", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.musicFindMany.mockResolvedValue([
            {
                index: "sasoribi",
                title: "ピアノ協奏曲第1番“蠍火”",
                title_kana: "ピアノキョウソウキョク",
                artist: "Virkato Wakhmaninov",
                category: "BEMANI楽曲",
                category_short: "BM",
                description: null,
                license: "",
                unlock_type: 0,
                background: null,
            },
        ]);
        mocks.chartUpsert.mockResolvedValue({ id: 1 });
        mocks.transaction.mockResolvedValue([]);
        mocks.getLocalJacketUrl.mockReturnValue(null);
    });

    it("관리자가 직접 올린 자켓은 로컬 파일이 있어도 덮어쓰지 않는다", async () => {
        const manual =
            "https://store.public.blob.vercel-storage.com/jackets/manual/sasoribi/jacket-abc.png";
        mocks.getLocalJacketUrl.mockReturnValue("/bg/sasoribi.png");
        mocks.musicFindMany.mockResolvedValue([
            {
                index: "sasoribi",
                title: "ピアノ協奏曲第1番“蠍火”",
                title_kana: "ピアノキョウソウキョク",
                artist: "Virkato Wakhmaninov",
                category: "BEMANI楽曲",
                category_short: "BM",
                description: null,
                license: "",
                unlock_type: 0,
                background: manual,
            },
        ]);

        await updateMusic([
            {
                "@index": "sasoribi",
                title: "ピアノ協奏曲第1番“蠍火”",
                title_kana: "ピアノキョウソウキョク",
                artist: "Virkato Wakhmaninov",
                category: "BEMANI楽曲",
                category_short: "BM",
                description: null,
                license: "",
                unlock_type: 0,
                sheet: [{ difficulty: "Real", level: 3 }],
            },
        ]);

        expect(mocks.musicUpdate).not.toHaveBeenCalled();
    });

    it("새 Real 3 채보에 13.0 초기 정규화 상수를 적용한다", async () => {
        await updateMusic([
            {
                "@index": "sasoribi",
                title: "ピアノ協奏曲第1番“蠍火”",
                title_kana: "ピアノキョウソウキョク",
                artist: "Virkato Wakhmaninov",
                category: "BEMANI楽曲",
                category_short: "BM",
                description: null,
                license: "",
                unlock_type: 0,
                sheet: [{ difficulty: "Real", level: 3 }],
            },
        ]);

        expect(mocks.chartUpsert).toHaveBeenCalledWith({
            where: {
                music_idx_difficulty: {
                    music_idx: "sasoribi",
                    difficulty: "Real",
                },
            },
            create: {
                music_idx: "sasoribi",
                difficulty: "Real",
                level: 3,
                level_constant: null,
            },
            update: { level: 3 },
        });
    });
});
