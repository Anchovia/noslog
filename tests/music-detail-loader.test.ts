import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    music: vi.fn(),
    record: vi.fn(),
    stats: vi.fn(),
    unlocks: vi.fn(),
    recent: vi.fn(),
    score: vi.fn(),
    performance: vi.fn(),
    peers: vi.fn(),
    tiers: vi.fn(),
    history: vi.fn(),
    count: vi.fn(),
    community: vi.fn(),
    ranking: vi.fn(),
    players: vi.fn(),
    player: vi.fn(),
    log: vi.fn(),
}));
vi.mock("@/lib/db", () => ({
    default: {
        tierList: { findMany: mocks.tiers },
        tierPlacementHistory: { findMany: mocks.history },
        playData: { count: mocks.count },
    },
}));
vi.mock("@/features/music/server/musicDetailData", () => ({
    getCachedMusicDetail: mocks.music,
    getUserChartRecord: mocks.record,
    getCachedChartDetailStats: mocks.stats,
    getCachedUnlockTranslations: mocks.unlocks,
    getRecentUserChartPlays: mocks.recent,
    getUserChartScoreTrend: mocks.score,
    getUserChartPerformanceTrend: mocks.performance,
    getUserChartPeerScoreComparison: mocks.peers,
}));
vi.mock("@/features/music/server/chartRanking", () => ({
    getChartRanking: mocks.ranking,
    getChartScorePlayers: mocks.players,
    getChartScorePlayer: mocks.player,
    MUSIC_RANKING_PAGE_SIZE: 25,
}));
vi.mock("@/features/music/server/communityData", () => ({
    getCommunityData: mocks.community,
}));
vi.mock("@/lib/observability/server", () => ({ logServerError: mocks.log }));
import { loadMusicDetail } from "@/features/music/server/loadMusicDetail";

describe("music detail query orchestration", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        mocks.music.mockResolvedValue({
            music: { index: "song", title: "Song", title_kana: "", charts: [] },
            chart: { id: 12, unlock_condition: null },
        });
        mocks.record.mockResolvedValue(null);
        mocks.stats.mockResolvedValue({
            scores: [
                { score: 960000, fc_type: 0 },
                { score: 999000, fc_type: 3 },
            ],
        });
        for (const mock of [
            mocks.tiers,
            mocks.history,
            mocks.recent,
            mocks.score,
            mocks.performance,
            mocks.players,
        ])
            mock.mockResolvedValue([]);
        mocks.peers.mockResolvedValue(null);
        mocks.ranking.mockResolvedValue({
            rows: [],
            page: 2,
            pageSize: 25,
            totalCount: 31,
        });
        mocks.count.mockResolvedValue(4);
        mocks.player.mockResolvedValue({ user_id: 7, score: 980000 });
    });

    it("loads independent sections while tier values are still pending", async () => {
        let release!: (value: []) => void;
        mocks.tiers.mockReturnValue(
            new Promise((resolve) => {
                release = resolve;
            })
        );
        const pending = loadMusicDetail(
            "song",
            "Expert",
            "detail",
            1,
            undefined,
            "ko",
            true
        );
        await vi.waitFor(() => expect(mocks.stats).toHaveBeenCalledWith(12, 0));
        expect(mocks.history).toHaveBeenCalledOnce();
        release([]);
        const result = await pending;
        expect(result?.chartDetail.playerCount).toBe(2);
        expect(
            result?.chartDetail.scoreDistribution.map((item) => item.count)
        ).toEqual([0, 1, 0, 0, 0, 1]);
        expect(result?.chartDetail).not.toHaveProperty("evaluationCount");
        expect(mocks.ranking).not.toHaveBeenCalled();
    });

    it.each([true, false])(
        "preserves private self inclusion (%s), rank and player pins",
        async (hidden) => {
            mocks.record.mockResolvedValue({
                score: 980000,
                user: { hide_play_scores: hidden, grade_basic: 123 },
            });
            const result = await loadMusicDetail(
                "song",
                "Expert",
                "ranking",
                2,
                7,
                "ko",
                true
            );
            expect(mocks.stats).toHaveBeenCalledWith(12, hidden ? 7 : 0);
            expect(mocks.ranking).toHaveBeenCalledWith(12, 2, hidden ? 7 : 0);
            expect(mocks.players).toHaveBeenCalledWith(12, 31, hidden ? 7 : 0);
            expect(mocks.count).toHaveBeenCalledWith({
                where: {
                    chart_id: 12,
                    score: { gt: 980000 },
                    user: { hide_play_scores: false },
                },
            });
            expect(result?.ranking.userRank).toBe(5);
            expect(result?.ranking.players).toEqual([
                { user_id: 7, score: 980000 },
            ]);
            expect(result?.chartDetail.scoreSeries).toEqual([999000, 960000]);
            expect(mocks.history).not.toHaveBeenCalled();
            expect(mocks.recent).not.toHaveBeenCalled();
        }
    );

    it("skips unrelated tab queries and uses the missing-record peer fallback", async () => {
        await loadMusicDetail("song", "Real", "record", 1, 7, "ja", true);
        expect(mocks.peers).toHaveBeenCalledWith(7, 12, undefined);
        expect(mocks.score).toHaveBeenCalledWith(7, 12, null);
        for (const mock of [
            mocks.stats,
            mocks.ranking,
            mocks.history,
            mocks.count,
            mocks.community,
        ])
            expect(mock).not.toHaveBeenCalled();
    });

    it("keeps optional section failure recovery", async () => {
        mocks.history.mockRejectedValue(new Error("history"));
        expect(
            (
                await loadMusicDetail(
                    "song",
                    "Expert",
                    "detail",
                    1,
                    undefined,
                    "ko",
                    true
                )
            )?.chartDetail.tierHistory
        ).toEqual([]);
        mocks.community.mockRejectedValue(new Error("community"));
        expect(
            (
                await loadMusicDetail(
                    "song",
                    "Expert",
                    "tier",
                    1,
                    undefined,
                    "ko",
                    true
                )
            )?.community
        ).toBeUndefined();
        expect(mocks.log).toHaveBeenCalledTimes(2);
    });
});
