import { describe, expect, it } from "vitest";

import { isSafariUserAgent } from "@/lib/browserSupport";

describe("isSafariUserAgent", () => {
    it("macOS Safari를 감지한다", () => {
        expect(
            isSafariUserAgent(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15"
            )
        ).toBe(true);
    });

    it("iOS Safari를 감지한다", () => {
        expect(
            isSafariUserAgent(
                "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1"
            )
        ).toBe(true);
    });

    it.each([
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/138.0.0.0 Mobile/15E148 Safari/604.1",
    ])("Chrome과 Edge는 Safari로 감지하지 않는다", (userAgent) => {
        expect(isSafariUserAgent(userAgent)).toBe(false);
    });
});
