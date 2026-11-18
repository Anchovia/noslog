import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    musicFindMany: vi.fn(),
    musicCount: vi.fn(),
    translationGroupBy: vi.fn(),
}));
vi.mock("@/lib/admin", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/db", () => ({
    default: {
        music: { findMany: mocks.musicFindMany, count: mocks.musicCount },
        musicTranslation: { groupBy: mocks.translationGroupBy },
    },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn(), updateTag: vi.fn() }));

import { getAdminMusicList } from "@/features/music/server/admin-music-list-service";

const row = (index: number) => ({
    index: `m-${index}`,
    title: `Song ${index}`,
    artist: null,
    categoryShort: "BM",
    charts: [{ levelConstant: 12.3 }, { levelConstant: null }],
    translations: [],
});

describe("관리자 악곡 목록 — 검색", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
        mocks.musicCount.mockResolvedValue(0);
        mocks.translationGroupBy.mockResolvedValue([]);
    });

    it("대소문자를 가리지 않고 제목 · 읽기 · 아티스트 · 식별자 · 번역 제목에서 찾는다", async () => {
        mocks.musicFindMany.mockResolvedValue([]);
        await getAdminMusicList({ q: "  altale " });
        const { where } = mocks.musicFindMany.mock.calls[0][0];
        const insensitive = { contains: "altale", mode: "insensitive" };
        expect(where.OR).toEqual([
            { title: insensitive },
            { titleKana: insensitive },
            { artist: insensitive },
            { index: insensitive },
            { translations: { some: { title: insensitive } } },
        ]);
        expect(mocks.requireAdmin).toHaveBeenCalled();
    });

    it("채보 수와 상수를 넣은 채보 수를 센다", async () => {
        mocks.musicFindMany.mockResolvedValue([row(1)]);
        const data = await getAdminMusicList({});
        expect(data.musics[0]).toMatchObject({
            chartCount: 2,
            configuredChartCount: 1,
        });
    });
});
