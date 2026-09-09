import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    getSession: vi.fn(),
    getRequestLocale: vi.fn(),
    getMusicTitleDisplayPreference: vi.fn(),
    loadMusicDetail: vi.fn(),
    logServerError: vi.fn(),
}));

vi.mock("@/lib/session", () => ({
    default: mocks.getSession,
}));

vi.mock("@/lib/i18n/server", () => ({
    getRequestLocale: mocks.getRequestLocale,
}));

vi.mock("@/lib/i18n/musicTitle", () => ({
    getMusicTitleDisplayPreference: mocks.getMusicTitleDisplayPreference,
}));

vi.mock("@/features/music/server/loadMusicDetail", () => ({
    loadMusicDetail: mocks.loadMusicDetail,
    normalizeMusicDetailTab: (value?: string) =>
        ["record", "detail", "ranking", "tier"].includes(value ?? "")
            ? value
            : "record",
    normalizeMusicDifficulty: (value: string) => {
        const normalized = value.toLowerCase();
        if (!["normal", "hard", "expert", "real"].includes(normalized)) {
            return undefined;
        }
        return `${normalized[0].toUpperCase()}${normalized.slice(1)}`;
    },
}));

vi.mock("@/lib/observability/server", () => ({
    logServerError: mocks.logServerError,
}));

import { GET } from "@/app/api/music-detail/route";

describe("GET /api/music-detail", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.getSession.mockResolvedValue({ id: 7 });
        mocks.getRequestLocale.mockResolvedValue("ko");
        mocks.getMusicTitleDisplayPreference.mockResolvedValue(true);
        mocks.loadMusicDetail.mockResolvedValue({
            music: { index: "music-1", title: "Test Music" },
            difficulty: "Expert",
            activeTab: "record",
        });
    });

    it("악곡 상세 데이터를 공통 API 응답으로 감싼다", async () => {
        const response = await GET(
            new Request(
                "https://noslog.app/api/music-detail?index=music-1&difficulty=expert&locale=ja"
            )
        );

        expect(response.status).toBe(200);
        expect(response.headers.get("cache-control")).toBe("private, no-store");
        await expect(response.json()).resolves.toEqual({
            isSuccess: true,
            code: "SUCCESS",
            message: "",
            result: expect.objectContaining({
                difficulty: "Expert",
                activeTab: "record",
            }),
        });
        expect(mocks.loadMusicDetail).toHaveBeenCalledWith(
            "music-1",
            "Expert",
            "record",
            1,
            7,
            "ja",
            true
        );
    });

    it("필수 파라미터가 없으면 정규화한 400 응답을 반환한다", async () => {
        const response = await GET(
            new Request("https://noslog.app/api/music-detail")
        );

        expect(response.status).toBe(400);
        await expect(response.json()).resolves.toEqual({
            isSuccess: false,
            code: "MUSIC_DETAIL_INVALID_REQUEST",
            message: "Invalid music detail request.",
            result: null,
        });
        expect(mocks.getSession).not.toHaveBeenCalled();
    });

    it("존재하지 않는 채보는 정규화한 404 응답을 반환한다", async () => {
        mocks.loadMusicDetail.mockResolvedValue(null);

        const response = await GET(
            new Request(
                "https://noslog.app/api/music-detail?index=missing&difficulty=normal"
            )
        );

        expect(response.status).toBe(404);
        await expect(response.json()).resolves.toEqual({
            isSuccess: false,
            code: "MUSIC_DETAIL_NOT_FOUND",
            message: "Music detail was not found.",
            result: null,
        });
    });

    it("내부 오류를 노출하지 않고 기록한다", async () => {
        const error = new Error("database secret");
        mocks.loadMusicDetail.mockRejectedValue(error);

        const response = await GET(
            new Request(
                "https://noslog.app/api/music-detail?index=music-1&difficulty=expert"
            )
        );

        expect(response.status).toBe(500);
        await expect(response.json()).resolves.toEqual({
            isSuccess: false,
            code: "MUSIC_DETAIL_FETCH_FAILED",
            message: "Unable to load music detail.",
            result: null,
        });
        expect(mocks.logServerError).toHaveBeenCalledWith(
            error,
            expect.objectContaining({ event: "music-detail.fetch.failed" })
        );
    });
});
