import { describe, expect, it } from "vitest";
import { getAuthReturnPath } from "@/lib/authReturnPath";

describe("localized authentication return destination", () => {
    it.each([
        undefined,
        "https://example.com",
        "//example.com",
        "/\\example.com",
        "/\n/example.com",
        "/admin/users",
        "/ko/admin/users",
        "/api/sync/status",
        "/discord/complete",
        "/login?returnTo=/login",
        "/ja/onboarding",
        "/_next/static/test.js",
        "/%61dmin/users",
        "/music/../../admin",
        "/music/%5cexample.com",
    ])("keeps unsafe destination %s on NosLog", (value) => {
        expect(getAuthReturnPath(value, "ja")).toBe("/ja");
    });
    it("preserves an internal destination and query in the selected locale", () => {
        expect(getAuthReturnPath("/bookmarklet", "ja")).toBe("/ja/bookmarklet");
        expect(getAuthReturnPath("/ko/music?q=notes#records", "en")).toBe(
            "/en/music?q=notes#records"
        );
    });
});
