import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    musicFindMany: vi.fn(),
}));
vi.mock("@/lib/admin", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/db", () => ({
    default: { music: { findMany: mocks.musicFindMany } },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn(), updateTag: vi.fn() }));

import {
    ADMIN_MUSIC_PAGE_SIZE,
    getAdminMusicPage,
} from "@/features/music/server/musicTranslationAdminService";

const row = (index: number) => ({
    index: `m-${index}`,
    title: `Song ${index}`,
    artist: null,
    category_short: "BM",
    charts: [{ level_constant: 12.3 }, { level_constant: null }],
    translations: [],
});

describe("관리자 악곡 목록 — 검색 · 무한 스크롤(2026-09-25)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.requireAdmin.mockResolvedValue({ id: 1, role: "admin" });
    });

    it("대소문자를 가리지 않고 제목 · 읽기 · 아티스트 · 식별자 · 번역 제목에서 찾는다", async () => {
        mocks.musicFindMany.mockResolvedValue([]);
        await getAdminMusicPage({ q: "  altale " }, 0);
        const { where } = mocks.musicFindMany.mock.calls[0][0];
        const insensitive = { contains: "altale", mode: "insensitive" };
        expect(where.OR).toEqual([
            { title: insensitive },
            { title_kana: insensitive },
            { artist: insensitive },
            { index: insensitive },
            { translations: { some: { title: insensitive } } },
        ]);
        expect(mocks.requireAdmin).toHaveBeenCalled();
    });

    it("한 쪽은 40곡 — 한 곡 더 읽어 다음 쪽이 있는지 알고, offset 부터 건너뛴다", async () => {
        mocks.musicFindMany.mockResolvedValue(
            Array.from({ length: ADMIN_MUSIC_PAGE_SIZE + 1 }, (_, i) => row(i))
        );
        const page = await getAdminMusicPage({}, 80);
        expect(mocks.musicFindMany.mock.calls[0][0]).toMatchObject({
            skip: 80,
            take: ADMIN_MUSIC_PAGE_SIZE + 1,
        });
        expect(page.hasMore).toBe(true);
        expect(page.musics).toHaveLength(ADMIN_MUSIC_PAGE_SIZE);
        expect(page.musics[0]).toMatchObject({
            chartCount: 2,
            configuredChartCount: 1,
        });
        mocks.musicFindMany.mockResolvedValue([row(1)]);
        expect((await getAdminMusicPage({}, 0)).hasMore).toBe(false);
    });
});
