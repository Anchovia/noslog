import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    findFirst: vi.fn(),
    getJacketUrl: vi.fn(),
    notFound: vi.fn(),
    listChartComments: vi.fn(),
    getNameLabels: vi.fn(),
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
vi.mock("@/features/contributions/server/chartDraftService", () => ({
    listChartComments: mocks.listChartComments,
}));
vi.mock("@/features/contributions/server/contributionPointService", () => ({
    getNameLabels: mocks.getNameLabels,
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
        mocks.listChartComments.mockResolvedValue([]);
        mocks.getNameLabels.mockResolvedValue(new Map());
        mocks.notFound.mockImplementation(() => {
            throw new Error("NEXT_NOT_FOUND");
        });
    });

    it("초안이 아니라 공개 스냅샷만 뷰어에 전달한다", async () => {
        mocks.findFirst.mockResolvedValue({
            id: 7,
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
                publishedAt: new Date("2026-09-24T02:34:50.000Z"),
                publishedBy: { username: "운영자A", role: "admin" },
                author: null,
                // 영상 추출 버전(2)이 공개 번호(3) 이하 → 출처 표기
                revisions: [{ number: 2, kind: "vid2bmap", message: null }],
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
            source: {
                author: {
                    id: null,
                    name: "운영자A",
                    label: { kind: "operator" },
                },
                publisher: null,
                publishedAt: "2026-09-24T02:34:50.000Z",
                extracted: true,
            },
            contribution: {
                chartId: 7,
                signedIn: false,
                canModerate: false,
                draftHref: "/ko/music/music-index/normal/pattern/draft",
                returnTo: "/ko/music/music-index/normal/pattern",
                initialComments: [],
                initialTimeMs: null,
            },
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
                        select: expect.objectContaining({
                            publishedContent: true,
                            publishedRevision: true,
                        }),
                    },
                }),
            })
        );
    });

    it("초안 내용은 읽지 않는다", async () => {
        mocks.findFirst.mockResolvedValue(null);
        await expect(
            PublicChartPatternPage({
                params: Promise.resolve({
                    index: "music-index",
                    difficulty: "normal",
                }),
            })
        ).rejects.toThrow("NEXT_NOT_FOUND");
        const select = mocks.findFirst.mock.calls[0][0].select.pattern.select;
        expect(select).not.toHaveProperty("draftContent");
    });

    it("영상 추출 버전이 공개 뒤에만 있으면 출처 표기를 하지 않는다", async () => {
        mocks.findFirst.mockResolvedValue({
            id: 7,
            difficulty: "Normal",
            level: 1,
            music: {
                index: "music-index",
                title: "테스트 악곡",
                artist: null,
                background: null,
            },
            pattern: {
                publishedContent: publishedDocument,
                publishedRevision: 3,
                publishedAt: null,
                publishedBy: null,
                author: null,
                revisions: [{ number: 5, kind: "vid2bmap", message: null }],
            },
        });
        const element = await PublicChartPatternPage({
            params: Promise.resolve({
                index: "music-index",
                difficulty: "normal",
            }),
        });
        expect(element.props.source).toEqual({
            author: null,
            publisher: null,
            publishedAt: null,
            extracted: false,
        });
    });

    it("유저 기여 채보는 작성자 + 기여 라벨, 공개한 운영자는 따로 · 주소 t 로 시작 시각", async () => {
        mocks.getNameLabels.mockResolvedValue(
            new Map([[42, { kind: "level", level: 3, points: 45 }]])
        );
        mocks.findFirst.mockResolvedValue({
            id: 7,
            difficulty: "Normal",
            level: 1,
            music: {
                index: "music-index",
                title: "테스트 악곡",
                artist: null,
                background: null,
            },
            pattern: {
                publishedContent: publishedDocument,
                publishedRevision: 6,
                publishedAt: null,
                publishedBy: { username: "운영자A", role: "admin" },
                author: { id: 42, username: "하늘" },
                // 빈 채보에서 시작한 기여(6) — 그 전 관리자 초안의 영상 추출(4)은 조상이 아니다
                revisions: [
                    {
                        number: 6,
                        kind: "contribution",
                        message: "기여 초안 #1 · 하늘 · 새 채보",
                    },
                    { number: 4, kind: "vid2bmap", message: null },
                ],
            },
        });
        const element = await PublicChartPatternPage({
            params: Promise.resolve({
                index: "music-index",
                difficulty: "normal",
            }),
            searchParams: Promise.resolve({ t: "42.3" }),
        });
        expect(element.props.source).toEqual({
            author: {
                id: 42,
                name: "하늘",
                label: { kind: "level", level: 3, points: 45 },
            },
            publisher: { name: "운영자A" },
            publishedAt: null,
            extracted: false,
        });
        expect(element.props.contribution.initialTimeMs).toBe(42_300);
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
