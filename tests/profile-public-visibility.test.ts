import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    user: vi.fn(),
    grades: vi.fn(),
    best: vi.fn(),
    recent: vi.fn(),
}));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));
vi.mock("@/lib/db", () => ({
    default: {
        user: { findUnique: mocks.user },
        userBestGrade: { findMany: mocks.grades },
        playData: { findMany: mocks.best },
        chartPlayHistory: { findMany: mocks.recent },
    },
}));
vi.mock("@/features/rankings/server/ranking-position", () => ({
    getUserRankingPosition: vi.fn().mockResolvedValue(1),
}));
vi.mock("@/features/contributions/server/contribution-point-service", () => ({
    getContributionTotal: vi.fn().mockResolvedValue({
        points: 0,
        chart_field: 0,
        arcade_report: 0,
        cabinet_check: 0,
    }),
}));

vi.mock("@/features/achievements/server/achievement-service", () => ({
    getAchievementRecords: vi
        .fn()
        .mockResolvedValue({ earned: [], pins: [], recipients: {} }),
}));

import { getCachedProfileData } from "@/app/(site)/profile/[id]/data";

const sourceUser = {
    id: 7,
    username: "Public player",
    country: "ko-KR",
    nostalgia_name: "private-game-identity",
    discord_name: "private-discord-name",
    discord_username: "private-discord-username",
    preferredArcade: { name: "private-arcade" },
    // 동기화 결과는 player_stats 에서(2026-10-16 DB 재설계 P4)
    stats: { playCount: 1234567, gradeBasic: 500000, gradeRecital: 100000 },
    created_at: new Date("2026-01-01T00:00:00Z"),
    hide_nostalgia_name: false,
    hide_discord_name: false,
    hide_play_count: false,
    hide_preferred_arcade: false,
    hide_play_activity: false,
    examAchievements: [
        { exam: { mode: "basic", grade: 5 } },
        { exam: { mode: "basic", grade: 2 } },
    ],
};
// 최근 플레이 시각은 played_at — 응답에는 공식 표기 글자로 나간다(2026-10-16 P5-1)
const sourcePlayTime = "2026/09/06 23:59";
const sourcePlay = {
    id: 5,
    playedAt: new Date("2026-09-06T14:59:00Z"),
    score: 987654,
    rank: "S",
    grade_basic: 100,
    chart: {
        difficulty: "expert",
        level: 12,
        music_idx: "private-recent-music",
        music: { title: "Private recent title" },
    },
};

describe("public profile visibility boundary", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.user.mockResolvedValue(sourceUser);
        mocks.grades.mockResolvedValue([]);
        mocks.best.mockResolvedValue([]);
        mocks.recent.mockResolvedValue([sourcePlay]);
    });
    it("removes protected identity and activity values from the entire public payload", async () => {
        mocks.user.mockResolvedValue({
            ...sourceUser,
            hide_nostalgia_name: true,
            hide_discord_name: true,
            hide_play_count: true,
            hide_preferred_arcade: true,
            hide_play_activity: true,
        });
        const profile = await getCachedProfileData(7);
        const payload = JSON.stringify(profile);
        for (const protectedValue of [
            "private-game-identity",
            "private-discord-name",
            "private-discord-username",
            "private-arcade",
            "1234567",
            sourcePlayTime,
            "private-recent-music",
            "Private recent title",
        ])
            expect(payload).not.toContain(protectedValue);
        expect(profile).not.toHaveProperty("recentPlays");
        expect(profile?.user.last_played_at).toBeNull();
        expect(profile?.user.username).toBe("Public player");
        // 검정 급수는 합격 기록에서 유도한 모드별 최고 급수만 싣고, 원본 기록 배열은 싣지 않는다
        expect(profile?.user.exam_basic).toBe(2);
        expect(profile?.user.exam_recital).toBeNull();
        expect(payload).not.toContain("examAchievements");
    });
    it("keeps arcade, play count and activity independent", async () => {
        mocks.user.mockResolvedValue({
            ...sourceUser,
            hide_preferred_arcade: true,
        });
        const profile = await getCachedProfileData(7);
        expect(profile?.user.preferredArcade).toBeNull();
        expect(profile?.user.play_count).toBe(sourceUser.stats.playCount);
        expect(profile?.user.last_played_at).toBe(sourcePlayTime);
        expect(mocks.recent).toHaveBeenCalledWith({
            where: { user_id: 7 },
            select: { playedAt: true },
            // 최신순은 played_at(2026-10-16 P4)
            orderBy: [{ playedAt: "desc" }, { id: "desc" }],
            take: 1,
        });
    });
    it("does not fetch unused best performances or growth history", async () => {
        mocks.user.mockResolvedValue({
            ...sourceUser,
            hide_play_activity: true,
        });
        const profile = await getCachedProfileData(7);
        expect(mocks.best).not.toHaveBeenCalled();
        expect(mocks.grades).not.toHaveBeenCalled();
        expect(profile?.user.grade_basic).toBe(sourceUser.stats.gradeBasic);
        expect(profile?.user.grade_recital).toBe(sourceUser.stats.gradeRecital);
        expect(profile?.user.last_played_at).toBeNull();
        expect(Object.keys(profile!)).toEqual(["user"]);
    });
    it("retains empty activity and missing-user behavior", async () => {
        mocks.recent.mockResolvedValue([]);
        expect((await getCachedProfileData(7))?.user.last_played_at).toBeNull();
        mocks.user.mockResolvedValue(null);
        expect(await getCachedProfileData(7)).toBeNull();
    });
});
