import { describe, expect, it } from "vitest";
import { hasRecentDeletionVerification } from "@/features/settings/schemas/deletionVerification";

describe("fixed deletion-specific verification window", () => {
    const verifiedAt = 1_000_000;
    const grant = { userId: 7, discordId: "identity", verifiedAt };
    it("expires exactly at ten minutes without depending on ordinary activity", () => {
        expect(
            hasRecentDeletionVerification(
                grant,
                7,
                "identity",
                verifiedAt + 599_999
            )
        ).toBe(true);
        expect(
            hasRecentDeletionVerification(
                grant,
                7,
                "identity",
                verifiedAt + 600_000
            )
        ).toBe(false);
        expect(
            hasRecentDeletionVerification(grant, 7, "identity", verifiedAt - 1)
        ).toBe(false);
    });
    it("requires the current account and Discord identity", () => {
        expect(
            hasRecentDeletionVerification(grant, 8, "identity", verifiedAt)
        ).toBe(false);
        expect(
            hasRecentDeletionVerification(grant, 7, "other", verifiedAt)
        ).toBe(false);
        expect(hasRecentDeletionVerification(grant, 7, null, verifiedAt)).toBe(
            false
        );
        expect(
            hasRecentDeletionVerification(undefined, 7, "identity", verifiedAt)
        ).toBe(false);
    });
});
