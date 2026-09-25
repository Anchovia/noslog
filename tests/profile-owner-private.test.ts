import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ user: vi.fn(), last: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({
    default: {
        user: { findUnique: mocks.user },
        chartPlayHistory: { findFirst: mocks.last },
    },
}));

import { getOwnerPrivateFields } from "@/features/profile/server/ownerPrivateService";

const base = {
    nostalgia_name: "CAROL",
    discord_name: "병훈",
    discord_username: "hoonie71",
    play_count: 951,
    hide_nostalgia_name: false,
    hide_discord_name: false,
    hide_preferred_arcade: false,
    hide_play_count: false,
    hide_play_activity: false,
    preferredArcade: { name: "짱구게임장" },
};

describe("owner private fields (2026-09-26 P1)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.last.mockResolvedValue({ source_play_time: "2026/09/12 22:30" });
    });
    it("returns only the values hidden by privacy settings", async () => {
        mocks.user.mockResolvedValue(base);
        expect(await getOwnerPrivateFields(1)).toEqual({
            nostalgiaName: null,
            discord: null,
            arcade: null,
            playCount: null,
            lastPlayedAt: null,
            activityHidden: false,
        });
        mocks.user.mockResolvedValue({
            ...base,
            hide_nostalgia_name: true,
            hide_discord_name: true,
            hide_preferred_arcade: true,
            hide_play_count: true,
            hide_play_activity: true,
        });
        expect(await getOwnerPrivateFields(1)).toEqual({
            nostalgiaName: "CAROL",
            discord: "병훈 @hoonie71",
            arcade: "짱구게임장",
            playCount: 951,
            lastPlayedAt: "2026/09/12 22:30",
            activityHidden: true,
        });
    });
    it("returns null for a missing user", async () => {
        mocks.user.mockResolvedValue(null);
        expect(await getOwnerPrivateFields(1)).toBeNull();
    });
});
