import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    verifySyncToken: vi.fn(),
    userFindUnique: vi.fn(),
    dataSyncCreate: vi.fn(),
    dataSyncUpdate: vi.fn(),
    updateMusic: vi.fn(),
    updateGrade: vi.fn(),
    updatePlayCount: vi.fn(),
    updatePlayData: vi.fn(),
    updateRecentPlay: vi.fn(),
    updateDummy: vi.fn(),
    revalidateTag: vi.fn(),
}));

vi.mock("@/lib/bookmarklet", () => ({
    verifySyncToken: mocks.verifySyncToken,
}));

vi.mock("@/lib/db", () => ({
    default: {
        user: { findUnique: mocks.userFindUnique },
        dataSync: {
            create: mocks.dataSyncCreate,
            update: mocks.dataSyncUpdate,
        },
    },
}));

vi.mock("@/lib/services/music/updateMusic", () => ({
    updateMusic: mocks.updateMusic,
}));
vi.mock("@/lib/services/user/updateGrade", () => ({
    updateGrade: mocks.updateGrade,
}));
vi.mock("@/lib/services/user/updatePlayCount", () => ({
    updatePlayCount: mocks.updatePlayCount,
}));
vi.mock("@/lib/services/user/updatePlayData", () => ({
    updatePlayData: mocks.updatePlayData,
}));
vi.mock("@/lib/services/user/updateRecentPlay", () => ({
    updateRecentPlay: mocks.updateRecentPlay,
}));
vi.mock("@/lib/dummy/bingo", () => ({
    updateDummy: mocks.updateDummy,
}));
vi.mock("next/cache", () => ({
    revalidateTag: mocks.revalidateTag,
}));

import { POST } from "@/app/api/receivePlayerData/route";

const origin = "https://p.eagate.573.jp";

function musicSheet(difficulty: "Normal" | "Hard" | "Expert") {
    return {
        difficulty,
        level: difficulty === "Expert" ? 10 : 5,
        score: 950000,
        rank: "S",
        fc_type: 0,
        play_count: 1,
        fullcombo_count: 0,
        pianistic_count: 0,
        max_combo: 500,
        grade_basic: 100,
        grade_recital: 100,
        besttime: "2026-07-17 12:00",
    };
}

function requestBody(full = false) {
    return {
        token: "valid-token",
        playerData: {
            status: 0,
            data: { player: { name: "CAROL", play_count: 100 } },
        },
        recentData: {
            status: 0,
            data: {
                player: {
                    history_list: {
                        history: [
                            {
                                difficulty: "Expert",
                                level: 10,
                                score: 950000,
                                max_combo: 500,
                                rank: "S",
                                play_time: "2026-07-17 12:00",
                                music: "test-music",
                                grade_basic: 100,
                            },
                        ],
                    },
                },
            },
        },
        totalData: full
            ? {
                  status: 0,
                  data: {
                      music: [
                          {
                              "@index": "test-music",
                              artist: "artist",
                              category: "BEMANI",
                              category_short: "BM",
                              description: null,
                              title: "Test Music",
                              title_kana: "test",
                              sheet: [
                                  musicSheet("Normal"),
                                  musicSheet("Hard"),
                                  musicSheet("Expert"),
                              ],
                          },
                      ],
                  },
              }
            : null,
    };
}

function createRequest(body: unknown, requestOrigin = origin) {
    return new NextRequest("http://localhost/api/receivePlayerData", {
        method: "POST",
        headers: {
            Origin: requestOrigin,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
}

describe("POST /api/receivePlayerData", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.verifySyncToken.mockReturnValue({ userId: 1, version: 0 });
        mocks.userFindUnique.mockResolvedValue({
            id: 1,
            sync_token_version: 0,
        });
        mocks.dataSyncCreate.mockResolvedValue({ id: 10 });
        mocks.dataSyncUpdate.mockResolvedValue({ id: 10 });
        mocks.updateRecentPlay.mockResolvedValue(1);
        mocks.updatePlayData.mockResolvedValue(3);
    });

    it("허용되지 않은 Origin 요청을 거부한다", async () => {
        const response = await POST(
            createRequest(requestBody(), "https://example.com")
        );

        expect(response.status).toBe(403);
        expect(mocks.verifySyncToken).not.toHaveBeenCalled();
    });

    it("잘못된 연동 토큰을 거부한다", async () => {
        mocks.verifySyncToken.mockReturnValue(null);

        const response = await POST(createRequest(requestBody()));
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.message).toBe("연동 토큰이 올바르지 않습니다.");
    });

    it("최근 기록만 동기화하고 사용자 프로필 캐시를 갱신한다", async () => {
        const response = await POST(createRequest(requestBody()));
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.syncScope).toBe("recent");
        expect(mocks.updateRecentPlay).toHaveBeenCalledWith(
            1,
            expect.any(Array),
            10
        );
        expect(mocks.updateMusic).not.toHaveBeenCalled();
        expect(mocks.updatePlayData).not.toHaveBeenCalled();
        expect(mocks.dataSyncUpdate).toHaveBeenCalledWith({
            where: { id: 10 },
            data: expect.objectContaining({
                status: "completed",
                inserted_plays: 1,
                changed_records: 0,
            }),
        });
        expect(mocks.revalidateTag).toHaveBeenCalledWith(
            "user-profile-1",
            "max"
        );
    });

    it("전체 기록 동기화 후 관련 공개 캐시를 모두 갱신한다", async () => {
        const response = await POST(createRequest(requestBody(true)));
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.syncScope).toBe("full");
        expect(mocks.updateMusic).toHaveBeenCalledOnce();
        expect(mocks.updatePlayData).toHaveBeenCalledOnce();
        expect(mocks.updateGrade).toHaveBeenCalledWith(1);
        expect(mocks.updateDummy).toHaveBeenCalledOnce();
        for (const tag of [
            "music-catalog",
            "music-details",
            "chart-rankings",
            "user-rankings",
            "bingos",
            "user-profiles",
        ]) {
            expect(mocks.revalidateTag).toHaveBeenCalledWith(tag, "max");
        }
    });

    it("처리 실패 시 동기화 실행을 실패 상태로 기록한다", async () => {
        vi.spyOn(console, "error").mockImplementation(() => undefined);
        mocks.updateRecentPlay.mockRejectedValue(new Error("sync failed"));

        const response = await POST(createRequest(requestBody()));
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.message).toBe("데이터 처리 중 오류가 발생했습니다.");
        expect(mocks.dataSyncUpdate).toHaveBeenCalledWith({
            where: { id: 10 },
            data: expect.objectContaining({
                status: "failed",
                error_message: "sync failed",
            }),
        });
    });
});
