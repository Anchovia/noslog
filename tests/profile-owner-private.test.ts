import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ user: vi.fn(), last: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({
    default: {
        user: { findUnique: mocks.user },
        chartPlayHistory: { findFirst: mocks.last },
    },
}));

import { getOwnerPrivateFields } from "@/features/profile/server/owner-private-service";

const base = {
    nostalgiaName: "CAROL",
    discordName: "병훈",
    discordUsername: "hoonie71",
    stats: { playCount: 951 },
    hideNostalgiaName: false,
    hideDiscordName: false,
    hidePreferredArcade: false,
    hidePlayCount: false,
    hidePlayActivity: false,
    preferredArcade: { name: "짱구게임장" },
};

describe("owner private fields (2026-09-26 P1)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.last.mockResolvedValue({
            playedAt: new Date("2026-09-12T13:30:00Z"),
        });
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
            hideNostalgiaName: true,
            hideDiscordName: true,
            hidePreferredArcade: true,
            hidePlayCount: true,
            hidePlayActivity: true,
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
