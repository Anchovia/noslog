import { describe, expect, it } from "vitest";

import { createBookmarkletHref } from "@/lib/bookmarklet";

describe("bookmarklet sync overlay", () => {
    it("renders the close button on its own row", () => {
        const href = decodeURIComponent(
            createBookmarkletHref("https://noslog.example", "token")
        );

        expect(href).toContain(
            'Object.assign(close.style,{display:"block",marginTop:"12px"'
        );
        expect(href).not.toContain('marginLeft:"8px"');
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
