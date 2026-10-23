import { describe, expect, it } from "vitest";
import { getAuthReturnPath } from "@/lib/auth-return-path";

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
        "/oauth/authorize?client_id=musecat",
    ])("keeps unsafe destination %s on NosLog", (value) => {
        expect(getAuthReturnPath(value, "ja")).toBe("/ja");
    });
    it("preserves an internal destination and query in the selected locale", () => {
        expect(getAuthReturnPath("/bookmarklet", "ja")).toBe("/ja/bookmarklet");
        expect(getAuthReturnPath("/ko/music?q=notes#records", "en")).toBe(
            "/en/music?q=notes#records"
        );
        // 파트너 동의 화면(뮤즈캣 연동 B) — 로그인 뒤 동의 대기 요청으로 돌아온다
        expect(getAuthReturnPath("/authorize", "ko")).toBe("/ko/authorize");
        // 오락실(지금 주소 /gamecenter) — 로그인 · 뮤즈캣 연결 뒤 보던 오락실로 돌아온다
        expect(getAuthReturnPath("/ko/gamecenter/13", "ko")).toBe(
            "/ko/gamecenter/13"
        );
    });
});
