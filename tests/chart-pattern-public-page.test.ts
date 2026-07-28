import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    findFirst: vi.fn(),
    getJacketUrl: vi.fn(),
    notFound: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    notFound: mocks.notFound,
}));
vi.mock("@/lib/db", () => ({
    default: {
        musicChart: {
            findFirst: mocks.findFirst,
        },
    },
}));
vi.mock("@/lib/musicJackets", () => ({
    getJacketUrl: mocks.getJacketUrl,
}));
vi.mock("@/lib/session", () => ({
    default: vi.fn().mockResolvedValue({}),
}));
vi.mock("@/lib/i18n/server", () => ({
    getServerI18n: vi.fn().mockResolvedValue({ locale: "ko" }),
}));

import PublicChartPatternPage from "@/app/(nevigation)/music/[index]/[difficulty]/pattern/page";

const publishedDocument = {
    version: 1 as const,
    laneCount: 28 as const,
    ticksPerQuarter: 480 as const,
    durationMs: 1_000,
    timingPoints: [
        {
            id: "timing",
            tick: 0,
            timeMs: 0,
            bpm: 120,
            numerator: 4,
            denominator: 4 as const,
        },
    ],
    notes: [],
};

describe("공개 채보 페이지", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.getJacketUrl.mockReturnValue("/jackets/music.webp");
        mocks.notFound.mockImplementation(() => {
            throw new Error("NEXT_NOT_FOUND");
        });
    });

    it("초안이 아니라 공개 스냅샷만 뷰어에 전달한다", async () => {
        mocks.findFirst.mockResolvedValue({
            difficulty: "Normal",
            level: 1,
            music: {
                index: "music-index",
                title: "테스트 악곡",
                artist: "테스트 아티스트",
                background: "music.webp",
            },
            pattern: {
                publishedContent: publishedDocument,
                publishedRevision: 3,
            },
        });

        const element = await PublicChartPatternPage({
            params: Promise.resolve({
                index: "music-index",
                difficulty: "normal",
            }),
        });

        expect(element.props).toMatchObject({
            title: "테스트 악곡",
            artist: "테스트 아티스트",
            difficulty: "Normal",
            level: 1,
            revision: 3,
            document: publishedDocument,
            jacketUrl: "/jackets/music.webp",
            backHref: "/ko/music/music-index/normal?tab=detail",
        });
        expect(mocks.findFirst).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    music_idx: "music-index",
                    difficulty: {
                        equals: "normal",
                        mode: "insensitive",
                    },
                },
                select: expect.objectContaining({
                    pattern: {
                        select: {
                            publishedContent: true,
                            publishedRevision: true,
                        },
                    },
                }),
            })
        );
    });

    it("공개 스냅샷이 없으면 채보를 노출하지 않는다", async () => {
        mocks.findFirst.mockResolvedValue({
            difficulty: "Normal",
            level: 1,
            music: {
                index: "music-index",
                title: "테스트 악곡",
                artist: null,
                background: null,
            },
            pattern: {
                publishedContent: null,
                publishedRevision: null,
            },
        });

        await expect(
            PublicChartPatternPage({
                params: Promise.resolve({
                    index: "music-index",
                    difficulty: "normal",
                }),
            })
        ).rejects.toThrow("NEXT_NOT_FOUND");
    });

    it("공개 데이터 형식이 손상되면 채보를 노출하지 않는다", async () => {
        mocks.findFirst.mockResolvedValue({
            difficulty: "Normal",
            level: 1,
            music: {
                index: "music-index",
                title: "테스트 악곡",
                artist: null,
                background: null,
            },
            pattern: {
                publishedContent: {
                    ...publishedDocument,
                    laneCount: 27,
                },
                publishedRevision: 1,
            },
        });

        await expect(
            PublicChartPatternPage({
                params: Promise.resolve({
                    index: "music-index",
                    difficulty: "normal",
                }),
            })
        ).rejects.toThrow("NEXT_NOT_FOUND");
    });
});
