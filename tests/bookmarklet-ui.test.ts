import { describe, expect, it } from "vitest";

import { createBookmarkletHref } from "@/lib/bookmarklet";

describe("bookmarklet sync overlay", () => {
    it("uses the bounded overlay and adaptive equal actions without exposing URL text", () => {
        const href = decodeURIComponent(
            createBookmarkletHref("https://noslog.example", "token")
        );

        expect(href).toContain('width:"334px"');
        expect(href).toContain('maxWidth:"calc(100vw - 32px)"');
        expect(href).toContain('flex:"1 1 0"');
        expect(href).toContain('actions.style.flexDirection="column"');
        expect(href).not.toContain("address.textContent=url");
        expect(href).toContain("resizeObserver.disconnect()");
    });

    it("uses the selected locale in the overlay, API, and result URL", () => {
        const href = decodeURIComponent(
            createBookmarkletHref(
                "https://noslog.example",
                "token",
                undefined,
                "ja"
            )
        );

        expect(href).toContain("NosLog データ同期");
        expect(href).toContain(
            "https://noslog.example/api/receivePlayerData?locale=ja"
        );
        expect(href).toContain("https://noslog.example/ja/bookmarklet");
        expect(href).not.toContain("NosLog 데이터 동기화");
    });
});
