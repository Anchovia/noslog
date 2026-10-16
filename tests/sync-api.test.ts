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
    keepTodayGrade: vi.fn(),
    recordProfileRatings: vi.fn(),
    refreshUserPlayerRatings: vi.fn(),
    updatePlayerProfile: vi.fn(),
    updatePlayData: vi.fn(),
    updateRecentPlay: vi.fn(),
    updateRecentBestRecords: vi.fn(),
    updateDummy: vi.fn(),
    revalidateTag: vi.fn(),
    getMissingJacketIndexes: vi.fn(),
    evaluateUserAchievements: vi.fn(),
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
vi.mock("@/lib/services/user/update-grade", () => ({
    updateGrade: mocks.updateGrade,
    keepTodayGrade: mocks.keepTodayGrade,
}));
vi.mock("@/features/profile/server/profile-rating-history-service", () => ({
    recordProfileRatings: mocks.recordProfileRatings,
}));
vi.mock("@/features/rankings/server/player-rating-service", () => ({
    refreshUserPlayerRatings: mocks.refreshUserPlayerRatings,
}));
vi.mock("@/lib/services/music/catalog-sync", () => ({
    processBemaniCatalogUpdates: mocks.processBemaniCatalogUpdates,
}));
vi.mock("@/lib/services/user/update-player-profile", () => ({
    updatePlayerProfile: mocks.updatePlayerProfile,
}));
vi.mock("@/lib/services/user/update-play-data", () => ({
    updatePlayData: mocks.updatePlayData,
}));
vi.mock("@/lib/services/user/update-recent-best-records", () => ({
    updateRecentBestRecords: mocks.updateRecentBestRecords,
}));
vi.mock("@/lib/services/user/update-recent-play", () => ({
    updateRecentPlay: mocks.updateRecentPlay,
}));
vi.mock("@/lib/dummy/bingo", () => ({
    updateDummy: mocks.updateDummy,
}));
vi.mock("next/cache", () => ({
    revalidateTag: mocks.revalidateTag,
}));
vi.mock("@/features/music/server/jacket-collection-service", () => ({
    getMissingJacketIndexes: mocks.getMissingJacketIndexes,
}));
vi.mock("@/features/achievements/server/achievement-service", () => ({
    evaluateUserAchievements: mocks.evaluateUserAchievements,
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

function createRequest(
    body: unknown,
    requestOrigin = origin,
    locale?: "ko" | "ja" | "en"
) {
    const url = new URL("http://localhost/api/receivePlayerData");
    if (locale) url.searchParams.set("locale", locale);

    return new NextRequest(url, {
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
        mocks.evaluateUserAchievements.mockResolvedValue([]);
        mocks.verifySyncToken.mockReturnValue({ userId: 1, version: 0 });
        mocks.userFindUnique.mockResolvedValue({
            id: 1,
            syncTokenVersion: 0,
            role: "user",
            stats: { gradeBasic: 1000, gradeRecital: null },
        });
        mocks.updateGrade.mockResolvedValue({
            grade_basic: 1000,
            grade_recital: null,
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
            { musicIdx: "test-music", difficulty: "Normal" },
            { musicIdx: "test-music", difficulty: "Hard" },
            { musicIdx: "test-music", difficulty: "Expert" },
        ]);
        mocks.updateRecentPlay.mockResolvedValue({
            insertedPlays: 1,
            skippedCharts: [],
        });
        mocks.updatePlayData.mockResolvedValue({
            changedRecords: 3,
            changedChartIds: [11, 12, 13],
        });
        mocks.updateRecentBestRecords.mockResolvedValue({
            changedRecords: 0,
            changedChartIds: [],
        });
        mocks.processBemaniCatalogUpdates.mockResolvedValue({
            detected: 0,
            pending: 0,
            applied: 0,
        });
        mocks.getMissingJacketIndexes.mockResolvedValue(["missing-a"]);
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

    it("선택한 언어로 동기화 API 결과를 반환한다", async () => {
        mocks.verifySyncToken.mockReturnValue(null);

        const response = await POST(createRequest(requestBody(), origin, "en"));
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.message).toBe("The sync token is invalid.");
    });

    it("이미 처리 중인 사용자의 중복 동기화를 거부한다", async () => {
        mocks.dataSyncFindFirst.mockResolvedValue({
            id: 9,
            status: "processing",
            startedAt: new Date(),
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
            startedAt: new Date(),
        });

        const response = await POST(createRequest(requestBody()));

        expect(response.status).toBe(429);
        expect(Number(response.headers.get("Retry-After"))).toBeGreaterThan(0);
        expect(mocks.dataSyncCreate).not.toHaveBeenCalled();
    });

    it("5분 넘게 멈춘 동기화를 실패 처리하고 새 요청을 시작한다", async () => {
        mocks.dataSyncFindFirst.mockResolvedValue({
            id: 9,
            status: "processing",
            startedAt: new Date(Date.now() - 6 * 60 * 1000),
        });

        const response = await POST(createRequest(requestBody()));

        expect(response.status).toBe(200);
        expect(mocks.dataSyncUpdate).toHaveBeenCalledWith({
            where: { id: 9 },
            data: expect.objectContaining({
                status: "failed",
                errorMessage: "동기화 처리 시간이 초과되었습니다.",
            }),
        });
        expect(mocks.dataSyncCreate).toHaveBeenCalledOnce();
    });

    it("최근 기록의 미등록 채보를 제외 안내에 남기고 응답 호환성을 보존한다", async () => {
        mocks.updateRecentPlay.mockResolvedValue({
            insertedPlays: 0,
            skippedCharts: [
                { musicIndex: "unknown", difficulty: "Expert" },
                { musicIndex: "unknown", difficulty: "Expert" },
            ],
        });
        const response = await POST(createRequest(requestBody()));
        expect(response.status).toBe(200);
        expect(await response.json()).toMatchObject({
            syncScope: "recent",
            insertedPlays: 0,
        });
        expect(mocks.dataSyncUpdate).toHaveBeenCalledWith({
            where: { id: 10 },
            data: expect.objectContaining({
                status: "completed",
                errorMessage:
                    "DB에 등록되지 않은 채보 1개를 건너뛰었습니다: unknown (Expert)",
            }),
        });
        expect(mocks.updatePlayData).not.toHaveBeenCalled();
    });

    it("최근 기록만 동기화하고 개인 기록·Grd·Rating과 캐시를 갱신한다", async () => {
        mocks.updateRecentBestRecords.mockResolvedValue({
            changedRecords: 1,
            changedChartIds: [21],
        });
        const response = await POST(createRequest(requestBody()));
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.syncScope).toBe("recent");
        expect(data).toMatchObject({
            receivedPlays: 1,
            insertedPlays: 1,
            changedRecords: 1,
        });
        // 북마클릿이 보내는 브로치 · NOS 는 받은 뒤 버린다(2026-10-16 K5)
        expect(mocks.updatePlayerProfile).toHaveBeenCalledWith(1, {
            name: "CAROL",
            play_count: 100,
            last: { playtime: "2026-07-17 12:00" },
        });
        expect(mocks.updateRecentPlay).toHaveBeenCalledWith(
            1,
            requestBody().recentData.data.player.history_list.history,
            10
        );
        expect(mocks.updatePlayData).not.toHaveBeenCalled();
        expect(mocks.updateRecentBestRecords).toHaveBeenCalledWith(1, 10);
        expect(mocks.updateGrade).toHaveBeenCalledWith(1);
        expect(mocks.recordProfileRatings).toHaveBeenCalledWith(1, 10);
        // 랭킹용 저장 레이팅도 이 사람만 다시 센다(2026-10-15 L2-A2)
        expect(mocks.refreshUserPlayerRatings).toHaveBeenCalledWith(1);
        // 바뀐 채보 하나만 — 전체 순위 · 모든 프로필 · 빙고는 그대로
        expect(mocks.revalidateTag).toHaveBeenCalledWith(
            "chart-ranking-21",
            "max"
        );
        expect(mocks.revalidateTag).toHaveBeenCalledWith(
            "user-rankings",
            "max"
        );
        for (const tag of ["chart-rankings", "user-profiles", "bingos"])
            expect(mocks.revalidateTag).not.toHaveBeenCalledWith(tag, "max");
        expect(mocks.dataSyncUpdate).toHaveBeenCalledWith({
            where: { id: 10 },
            data: expect.objectContaining({
                status: "completed",
                insertedPlays: 1,
                changedRecords: 1,
            }),
        });
        expect(mocks.revalidateTag).toHaveBeenCalledWith(
            "user-profile-1",
            "max"
        );
    });

    it("기록을 반영한 뒤 업적을 판정하고 새 단계 수를 돌려준다", async () => {
        mocks.evaluateUserAchievements.mockResolvedValueOnce([
            { key: "s-rank", tier: 1 },
            { key: "s-rank", tier: 2 },
        ]);
        const response = await POST(createRequest(requestBody()));
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(mocks.evaluateUserAchievements).toHaveBeenCalledWith(1);
        expect(
            mocks.evaluateUserAchievements.mock.invocationCallOrder[0]
        ).toBeGreaterThan(mocks.updateGrade.mock.invocationCallOrder[0]);
        expect(data.newAchievements).toBe(2);
    });

    it("업적 판정이 실패해도 동기화는 완료로 남긴다", async () => {
        const error = vi.spyOn(console, "error").mockImplementation(() => {});
        mocks.evaluateUserAchievements.mockRejectedValueOnce(new Error("x"));
        const response = await POST(createRequest(requestBody()));
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.newAchievements).toBe(0);
        expect(mocks.dataSyncUpdate).toHaveBeenCalledWith({
            where: { id: 10 },
            data: expect.objectContaining({ status: "completed" }),
        });
        error.mockRestore();
    });

    it("중복 연동이어도 이전 실패로 빠진 Grd·Rating 계산을 복구한다", async () => {
        const response = await POST(createRequest(requestBody()));
        expect(response.status).toBe(200);
        expect(mocks.updateGrade).toHaveBeenCalledWith(1);
        expect(mocks.recordProfileRatings).toHaveBeenCalledWith(1, 10);
        // 랭킹용 저장 레이팅도 이 사람만 다시 센다(2026-10-15 L2-A2)
        expect(mocks.refreshUserPlayerRatings).toHaveBeenCalledWith(1);
    });

    it("바뀐 기록이 없고 직전 동기화가 완료됐으면 Grd · 랭킹 레이팅을 다시 세지 않는다", async () => {
        mocks.dataSyncFindFirst.mockResolvedValueOnce({
            id: 9,
            status: "completed",
            startedAt: new Date(Date.now() - 60 * 60 * 1000),
        });
        mocks.updateRecentBestRecords.mockResolvedValueOnce({
            changedRecords: 0,
            changedChartIds: [],
        });
        const response = await POST(createRequest(requestBody()));
        expect(response.status).toBe(200);
        expect(mocks.updateGrade).not.toHaveBeenCalled();
        expect(mocks.refreshUserPlayerRatings).not.toHaveBeenCalled();
        // 그래프 점(레이팅 이력)과 Grd 「하루 한 줄」 은 남긴다
        expect(mocks.keepTodayGrade).toHaveBeenCalledWith(1);
        expect(mocks.recordProfileRatings).toHaveBeenCalledWith(1, 10);
    });

    it("최근 기록 병합 실패를 성공으로 표시하지 않는다", async () => {
        mocks.updateRecentBestRecords.mockRejectedValueOnce(
            new Error("projection failed")
        );
        const response = await POST(createRequest(requestBody()));
        expect(response.status).toBe(500);
        expect(mocks.updateGrade).not.toHaveBeenCalled();
        expect(mocks.dataSyncUpdate).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({ status: "failed" }),
            })
        );
    });

    it("응답 내부 상태 메타데이터가 없어도 바깥 성공 상태로 동기화한다", async () => {
        const body = requestBody();
        const playerData = body.playerData.data as unknown as Record<
            string,
            unknown
        >;
        const recentData = body.recentData.data as unknown as Record<
            string,
            unknown
        >;
        delete playerData.status;
        delete playerData.fail_code;
        delete recentData.status;
        delete recentData.fail_code;

        const response = await POST(createRequest(body));

        expect(response.status).toBe(200);
        expect(mocks.updatePlayerProfile).toHaveBeenCalledOnce();
        expect(mocks.updateRecentPlay).toHaveBeenCalledOnce();
    });

    it("플레이어 배열과 단일 악곡 응답을 정규화한다", async () => {
        const body = requestBody(true);
        const playerData = body.playerData.data as unknown as Record<
            string,
            unknown
        >;
        const recentData = body.recentData.data as unknown as Record<
            string,
            unknown
        >;
        const totalData = body.totalData?.data as unknown as Record<
            string,
            unknown
        >;
        playerData.player = [playerData.player];
        recentData.player = [recentData.player];
        totalData.music = (totalData.music as unknown[])[0];

        const response = await POST(createRequest(body));

        expect(response.status).toBe(200);
        expect(mocks.updatePlayerProfile).toHaveBeenCalledOnce();
        expect(mocks.updateRecentPlay).toHaveBeenCalledOnce();
        expect(mocks.updatePlayData).toHaveBeenCalledOnce();
    });

    it("전체 기록 동기화 후 바뀐 채보와 전체 랭킹만 갱신한다", async () => {
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
            10,
            // 곡 목록 반영 뒤 한 번 읽은 채보 지도를 넘긴다(2026-10-16 Q2)
            expect.any(Map)
        );
        expect(mocks.updateGrade).toHaveBeenCalledWith(1);
        expect(mocks.updateDummy).toHaveBeenCalledOnce();
        for (const tag of [
            "user-profile-1",
            "chart-ranking-11",
            "chart-ranking-12",
            "chart-ranking-13",
            "user-rankings",
        ]) {
            expect(mocks.revalidateTag).toHaveBeenCalledWith(tag, "max");
        }
        // Grd 가 그대로이고 새 업적 · 카탈로그 변경이 없으면 전체 순위 · 모든 프로필 · 빙고는 두고
        for (const tag of ["chart-rankings", "user-profiles", "bingos"])
            expect(mocks.revalidateTag).not.toHaveBeenCalledWith(tag, "max");
        expect(mocks.revalidateTag).not.toHaveBeenCalledWith(
            "music-catalog",
            "max"
        );
        expect(mocks.revalidateTag).not.toHaveBeenCalledWith(
            "music-details",
            "max"
        );
        expect(data).not.toHaveProperty("missingJackets");
        expect(mocks.getMissingJacketIndexes).not.toHaveBeenCalled();
    });

    it("미등록 채보는 개인 기록에서 제외하고 동기화 내역에 남긴다", async () => {
        mocks.musicChartFindMany.mockResolvedValue([
            { musicIdx: "test-music", difficulty: "Normal" },
            { musicIdx: "test-music", difficulty: "Hard" },
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
            10,
            expect.any(Map)
        );
        expect(mocks.dataSyncUpdate).toHaveBeenCalledWith({
            where: { id: 10 },
            data: expect.objectContaining({
                status: "completed",
                errorMessage: expect.stringContaining("test-music (Expert)"),
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
                changedRecords: 0,
                errorMessage:
                    expect.stringContaining("DB에 등록되지 않은 채보 3개"),
            }),
        });
    });

    it("바뀐 기록 · Grd · 업적이 없으면 본인 프로필 캐시만 비운다", async () => {
        const response = await POST(createRequest(requestBody()));
        expect(response.status).toBe(200);
        expect(mocks.revalidateTag.mock.calls).toEqual([
            ["user-profile-1", "max"],
        ]);
    });

    it("Grd 가 바뀌면 전체 랭킹과 모든 프로필의 순위를 비운다", async () => {
        mocks.updateGrade.mockResolvedValue({
            grade_basic: 1001,
            grade_recital: null,
        });
        const response = await POST(createRequest(requestBody()));
        expect(response.status).toBe(200);
        for (const tag of ["user-rankings", "user-profiles"])
            expect(mocks.revalidateTag).toHaveBeenCalledWith(tag, "max");
    });

    it("새 업적을 얻으면 모든 프로필의 달성 인원을 비운다", async () => {
        mocks.evaluateUserAchievements.mockResolvedValueOnce([
            { key: "s-rank", tier: 1 },
        ]);
        const response = await POST(createRequest(requestBody()));
        expect(response.status).toBe(200);
        expect(mocks.revalidateTag).toHaveBeenCalledWith(
            "user-profiles",
            "max"
        );
        expect(mocks.revalidateTag).not.toHaveBeenCalledWith(
            "user-rankings",
            "max"
        );
    });

    it("바뀐 채보가 아주 많으면 채보별 대신 전체 순위 태그 하나로 비운다", async () => {
        mocks.updatePlayData.mockResolvedValue({
            changedRecords: 300,
            changedChartIds: Array.from({ length: 300 }, (_, i) => i + 1),
        });
        const response = await POST(createRequest(requestBody(true)));
        expect(response.status).toBe(200);
        expect(mocks.revalidateTag).toHaveBeenCalledWith(
            "chart-rankings",
            "max"
        );
        expect(mocks.revalidateTag).not.toHaveBeenCalledWith(
            "chart-ranking-1",
            "max"
        );
    });

    it("관리자 전체 연동은 감지한 카탈로그 변경을 즉시 반영한다", async () => {
        mocks.userFindUnique.mockResolvedValue({
            id: 1,
            syncTokenVersion: 0,
            role: "admin",
            stats: { gradeBasic: 1000, gradeRecital: null },
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
        expect(mocks.revalidateTag).toHaveBeenCalledWith("bingos", "max");
        expect(data.missingJackets).toEqual(["missing-a"]);
    });

    it("자켓 목록 조회가 실패해도 관리자 동기화는 성공으로 끝난다", async () => {
        vi.spyOn(console, "error").mockImplementation(() => undefined);
        mocks.userFindUnique.mockResolvedValue({
            id: 1,
            syncTokenVersion: 0,
            role: "admin",
            stats: { gradeBasic: 1000, gradeRecital: null },
        });
        mocks.getMissingJacketIndexes.mockRejectedValue(new Error("db down"));

        const response = await POST(createRequest(requestBody(true)));
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.missingJackets).toEqual([]);
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
                errorMessage: "sync failed",
            }),
        });
    });
});
