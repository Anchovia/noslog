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
vi.mock("@/features/rankings/server/rankingPosition", () => ({
    getUserRankingPosition: vi.fn().mockResolvedValue(1),
}));

import { getCachedProfileData } from "@/app/(nevigation)/profile/[id]/data";

const sourceUser = {
    id: 7,
    username: "Public player",
    country: "ko-KR",
    nostalgia_name: "private-game-identity",
    discord_name: "private-discord-name",
    discord_username: "private-discord-username",
    preferredArcade: { name: "private-arcade" },
    play_count: 1234567,
    created_at: new Date("2026-01-01T00:00:00Z"),
    grade_basic: 500000,
    grade_recital: 100000,
    hide_nostalgia_name: false,
    hide_discord_name: false,
    hide_play_count: false,
    hide_preferred_arcade: false,
    hide_play_activity: false,
};
const sourcePlay = {
    id: 5,
    source_play_time: "2026-09-06 23:59:00",
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
            sourcePlay.source_play_time,
            "private-recent-music",
            "Private recent title",
        ])
            expect(payload).not.toContain(protectedValue);
        expect(profile?.recentPlays).toEqual([]);
        expect(profile?.user.last_played_at).toBeNull();
        expect(profile?.user.username).toBe("Public player");
    });
    it("keeps arcade, play count and activity independent", async () => {
        mocks.user.mockResolvedValue({
            ...sourceUser,
            hide_preferred_arcade: true,
        });
        const profile = await getCachedProfileData(7);
        expect(profile?.user.preferredArcade).toBeNull();
        expect(profile?.user.play_count).toBe(sourceUser.play_count);
        expect(profile?.user.last_played_at).toBe(sourcePlay.source_play_time);
        expect(profile?.recentPlays).toHaveLength(1);
    });
    it("preserves best performances when activity is hidden", async () => {
        mocks.user.mockResolvedValue({
            ...sourceUser,
            hide_play_activity: true,
        });
        mocks.best.mockResolvedValue([
            { score: 990000, music_idx: "public-best" },
        ]);
        const profile = await getCachedProfileData(7);
        expect(profile?.basicBestPlays).toEqual([
            { score: 990000, music_idx: "public-best" },
        ]);
        expect(profile?.recitalBestPlays).toHaveLength(1);
        expect(profile?.recentPlays).toEqual([]);
    });
});
