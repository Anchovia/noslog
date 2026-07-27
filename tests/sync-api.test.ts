import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    verifySyncToken: vi.fn(),
    userFindUnique: vi.fn(),
    transaction: vi.fn(),
    executeRaw: vi.fn(),
    dataSyncFindFirst: vi.fn(),
    dataSyncCreate: vi.fn(),
    dataSyncUpdate: vi.fn(),
    musicChartFindMany: vi.fn(),
    processBemaniCatalogUpdates: vi.fn(),
    updateGrade: vi.fn(),
    updatePlayerProfile: vi.fn(),
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
        $transaction: mocks.transaction,
        user: { findUnique: mocks.userFindUnique },
        dataSync: {
            create: mocks.dataSyncCreate,
            findFirst: mocks.dataSyncFindFirst,
            update: mocks.dataSyncUpdate,
        },
        musicChart: { findMany: mocks.musicChartFindMany },
    },
}));
vi.mock("@/lib/services/user/updateGrade", () => ({
    updateGrade: mocks.updateGrade,
}));
vi.mock("@/lib/services/music/catalogSync", () => ({
    processBemaniCatalogUpdates: mocks.processBemaniCatalogUpdates,
}));
vi.mock("@/lib/services/user/updatePlayerProfile", () => ({
    updatePlayerProfile: mocks.updatePlayerProfile,
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
        clear_count: 1,
        clear_flag: [0] as [number],
        fullcombo_count: 0,
        pianistic_count: 0,
        max_combo: 500,
        grade_basic: 100,
        grade_recital: 100,
        judge: [450, 30, 15, 5, 0] as [number, number, number, number, number],
        note_success_rate: [9800, 9700, -1, 9600] as [
            number,
            number,
            number,
            number,
        ],
        besttime: "2026-07-17 12:00",
    };
}

function requestBody(full = false) {
    return {
        token: "valid-token",
        playerData: {
            status: 0,
            data: {
                status: 0,
                fail_code: 0,
                player: {
                    name: "CAROL",
                    play_count: 100,
                    travel_info: {
                        money: 1205,
                    },
                    last: {
                        playtime: "2026-07-17 12:00",
                        brooch: {
                            "@index": "brooch-1",
                            name: "White Dog",
                            description: "A white dog brooch",
                        },
                    },
                    brooch_list: {
                        brooch: [
                            {
                                "@index": "brooch-1",
                                name: "White Dog",
                                description: "A white dog brooch",
                            },
                        ],
                    },
                },
            },
        },
        recentData: {
            status: 0,
            data: {
                status: 0,
                fail_code: 0,
                player: {
                    name: "CAROL",
                    history_list: {
                        history: [
                            {
                                artist: "artist",
                                best_score: 940000,
                                class_basic: "03",
                                difficulty: "Expert",
                                fast_count: 20,
                                is_onehand: false,
                                judge_count: [450, 30, 15, 5, 0],
                                level: 10,
                                license: "",
                                score: 950000,
                                slow_count: 15,
                                max_combo: 500,
                                rank: "s",
                                play_time: "2026-07-17 12:00",
                                music: "test-music",
                                title: "Test Music",
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
                      status: 0,
                      fail_code: 0,
                      music: [
                          {
                              "@index": "test-music",
                              artist: "artist",
                              category: "BEMANI",
                              category_short: "BM",
                              description: null,
                              license: "",
                              title: "Test Music",
                              title_kana: "test",
                              unlock_type: 1,
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

function createRequestWithHeaders(body: unknown, headers: HeadersInit) {
    return new NextRequest("http://localhost/api/receivePlayerData", {
        method: "POST",
        headers: { Origin: origin, ...headers },
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
            role: "user",
        });
        mocks.transaction.mockImplementation((callback) =>
            callback({
                $executeRaw: mocks.executeRaw,
                dataSync: {
                    create: mocks.dataSyncCreate,
                    findFirst: mocks.dataSyncFindFirst,
                    update: mocks.dataSyncUpdate,
                },
            })
        );
        mocks.dataSyncFindFirst.mockResolvedValue(null);
        mocks.dataSyncCreate.mockResolvedValue({ id: 10 });
        mocks.dataSyncUpdate.mockResolvedValue({ id: 10 });
        mocks.musicChartFindMany.mockResolvedValue([
            { music_idx: "test-music", difficulty: "Normal" },
            { music_idx: "test-music", difficulty: "Hard" },
            { music_idx: "test-music", difficulty: "Expert" },
        ]);
        mocks.updateRecentPlay.mockResolvedValue(1);
        mocks.updatePlayData.mockResolvedValue(3);
        mocks.processBemaniCatalogUpdates.mockResolvedValue({
            detected: 0,
            pending: 0,
            applied: 0,
        });
    });

    it("허용되지 않은 Origin 요청을 거부한다", async () => {
        const response = await POST(
            createRequest(requestBody(), "https://example.com")
        );

        expect(response.status).toBe(403);
        expect(mocks.verifySyncToken).not.toHaveBeenCalled();
    });

    it("JSON이 아닌 요청을 거부한다", async () => {
        const response = await POST(
            createRequestWithHeaders(requestBody(), {
                "Content-Type": "text/plain",
            })
        );

        expect(response.status).toBe(415);
        expect(mocks.verifySyncToken).not.toHaveBeenCalled();
    });

    it("허용 크기를 초과한 요청을 본문 파싱 전에 거부한다", async () => {
        const response = await POST(
            createRequestWithHeaders(requestBody(), {
                "Content-Type": "application/json",
                "Content-Length": String(8 * 1024 * 1024 + 1),
            })
        );

        expect(response.status).toBe(413);
        expect(mocks.verifySyncToken).not.toHaveBeenCalled();
    });

    it("허용 개수를 초과한 최근 기록 배열을 거부한다", async () => {
        const body = requestBody();
        const history = body.recentData.data.player.history_list.history;
        body.recentData.data.player.history_list.history = Array.from(
            { length: 101 },
            () => history[0]
        );

        const response = await POST(createRequest(body));

        expect(response.status).toBe(400);
        expect(mocks.verifySyncToken).not.toHaveBeenCalled();
    });

    it("잘못된 연동 토큰을 거부한다", async () => {
        mocks.verifySyncToken.mockReturnValue(null);

        const response = await POST(createRequest(requestBody()));
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.message).toBe("연동 토큰이 올바르지 않습니다.");
    });

    it("이미 처리 중인 사용자의 중복 동기화를 거부한다", async () => {
        mocks.dataSyncFindFirst.mockResolvedValue({
            id: 9,
            status: "processing",
            started_at: new Date(),
        });

        const response = await POST(createRequest(requestBody()));
        const data = await response.json();

        expect(response.status).toBe(409);
        expect(data.message).toContain("이미 동기화를 처리하고 있습니다");
        expect(mocks.dataSyncCreate).not.toHaveBeenCalled();
        expect(mocks.updatePlayerProfile).not.toHaveBeenCalled();
    });

    it("사용자별 동기화 잠금 키를 PostgreSQL integer로 고정한다", async () => {
        await POST(createRequest(requestBody()));

        const [queryParts, userId] = mocks.executeRaw.mock.calls[0];

        expect(queryParts.join("?")).toContain(
            "pg_advisory_xact_lock(73051, ?::integer)"
        );
        expect(userId).toBe(1);
    });

    it("30초 안에 반복된 동기화 요청을 제한한다", async () => {
        mocks.dataSyncFindFirst.mockResolvedValue({
            id: 9,
            status: "completed",
            started_at: new Date(),
        });

        const response = await POST(createRequest(requestBody()));

        expect(response.status).toBe(429);
        expect(Number(response.headers.get("Retry-After"))).toBeGreaterThan(0);
        expect(mocks.dataSyncCreate).not.toHaveBeenCalled();
    });

    it("15분 넘게 멈춘 동기화를 실패 처리하고 새 요청을 시작한다", async () => {
        mocks.dataSyncFindFirst.mockResolvedValue({
            id: 9,
            status: "processing",
            started_at: new Date(Date.now() - 16 * 60 * 1000),
        });

        const response = await POST(createRequest(requestBody()));

        expect(response.status).toBe(200);
        expect(mocks.dataSyncUpdate).toHaveBeenCalledWith({
            where: { id: 9 },
            data: expect.objectContaining({
                status: "failed",
                error_message: "동기화 처리 시간이 초과되었습니다.",
            }),
        });
        expect(mocks.dataSyncCreate).toHaveBeenCalledOnce();
    });

    it("최근 기록만 동기화하고 사용자 프로필 캐시를 갱신한다", async () => {
        const response = await POST(createRequest(requestBody()));
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.syncScope).toBe("recent");
        expect(data).toMatchObject({
            receivedPlays: 1,
            insertedPlays: 1,
            changedRecords: 0,
        });
        expect(mocks.updatePlayerProfile).toHaveBeenCalledWith(
            1,
            requestBody().playerData.data.player
        );
        expect(mocks.updateRecentPlay).toHaveBeenCalledWith(
            1,
            requestBody().recentData.data.player.history_list.history,
            10
        );
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
        expect(data).toMatchObject({
            receivedPlays: 1,
            insertedPlays: 1,
            changedRecords: 3,
        });
        expect(mocks.processBemaniCatalogUpdates).toHaveBeenCalledWith(
            requestBody(true).totalData?.data.music,
            false
        );
        expect(mocks.updatePlayData).toHaveBeenCalledWith(
            1,
            requestBody(true).totalData?.data.music,
            10
        );
        expect(mocks.updateGrade).toHaveBeenCalledWith(1);
        expect(mocks.updateDummy).toHaveBeenCalledOnce();
        for (const tag of [
            "chart-rankings",
            "user-rankings",
            "bingos",
            "user-profiles",
        ]) {
            expect(mocks.revalidateTag).toHaveBeenCalledWith(tag, "max");
        }
        expect(mocks.revalidateTag).not.toHaveBeenCalledWith(
            "music-catalog",
            "max"
        );
        expect(mocks.revalidateTag).not.toHaveBeenCalledWith(
            "music-details",
            "max"
        );
    });

    it("미등록 채보는 개인 기록에서 제외하고 동기화 내역에 남긴다", async () => {
        mocks.musicChartFindMany.mockResolvedValue([
            { music_idx: "test-music", difficulty: "Normal" },
            { music_idx: "test-music", difficulty: "Hard" },
        ]);

        const response = await POST(createRequest(requestBody(true)));

        expect(response.status).toBe(200);
        expect(mocks.updatePlayData).toHaveBeenCalledWith(
            1,
            [
                expect.objectContaining({
                    "@index": "test-music",
                    sheet: [musicSheet("Normal"), musicSheet("Hard")],
                }),
            ],
            10
        );
        expect(mocks.dataSyncUpdate).toHaveBeenCalledWith({
            where: { id: 10 },
            data: expect.objectContaining({
                status: "completed",
                error_message: expect.stringContaining("test-music (Expert)"),
            }),
        });
    });

    it("등록된 채보가 하나도 없으면 기존 개인 기록을 덮어쓰지 않는다", async () => {
        mocks.musicChartFindMany.mockResolvedValue([]);

        const response = await POST(createRequest(requestBody(true)));

        expect(response.status).toBe(200);
        expect(mocks.updatePlayData).not.toHaveBeenCalled();
        expect(mocks.processBemaniCatalogUpdates).toHaveBeenCalledWith(
            requestBody(true).totalData?.data.music,
            false
        );
        expect(mocks.updateGrade).not.toHaveBeenCalled();
        expect(mocks.updateDummy).not.toHaveBeenCalled();
        expect(mocks.dataSyncUpdate).toHaveBeenCalledWith({
            where: { id: 10 },
            data: expect.objectContaining({
                status: "completed",
                changed_records: 0,
                error_message:
                    expect.stringContaining("DB에 등록되지 않은 채보 3개"),
            }),
        });
    });

    it("관리자 전체 연동은 감지한 카탈로그 변경을 즉시 반영한다", async () => {
        mocks.userFindUnique.mockResolvedValue({
            id: 1,
            sync_token_version: 0,
            role: "admin",
        });
        mocks.processBemaniCatalogUpdates.mockResolvedValue({
            detected: 1,
            pending: 0,
            applied: 1,
        });

        const response = await POST(createRequest(requestBody(true)));
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.catalogUpdates).toEqual({
            detected: 1,
            pending: 0,
            applied: 1,
        });
        expect(mocks.processBemaniCatalogUpdates).toHaveBeenCalledWith(
            requestBody(true).totalData?.data.music,
            true
        );
        expect(mocks.revalidateTag).toHaveBeenCalledWith(
            "music-catalog",
            "max"
        );
        expect(mocks.revalidateTag).toHaveBeenCalledWith(
            "music-details",
            "max"
        );
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
