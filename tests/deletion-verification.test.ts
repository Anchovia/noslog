import { describe, expect, it } from "vitest";
import { hasRecentDiscordVerification } from "@/lib/recent-discord-verification";

describe("fixed deletion-specific verification window", () => {
    const verifiedAt = 1_000_000;
    const grant = { userId: 7, discordId: "identity", verifiedAt };
    it("expires exactly at ten minutes without depending on ordinary activity", () => {
        expect(
            hasRecentDiscordVerification(
                grant,
                7,
                "identity",
                verifiedAt + 599_999
            )
        ).toBe(true);
        expect(
            hasRecentDiscordVerification(
                grant,
                7,
                "identity",
                verifiedAt + 600_000
            )
        ).toBe(false);
        expect(
            hasRecentDiscordVerification(grant, 7, "identity", verifiedAt - 1)
        ).toBe(false);
    });
    it("requires the current account and Discord identity", () => {
        expect(
            hasRecentDiscordVerification(grant, 8, "identity", verifiedAt)
        ).toBe(false);
        expect(
            hasRecentDiscordVerification(grant, 7, "other", verifiedAt)
        ).toBe(false);
        expect(hasRecentDiscordVerification(grant, 7, null, verifiedAt)).toBe(
            false
        );
        expect(
            hasRecentDiscordVerification(undefined, 7, "identity", verifiedAt)
        ).toBe(false);
    });
});
