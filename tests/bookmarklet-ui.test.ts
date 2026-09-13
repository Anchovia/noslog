import { describe, expect, it } from "vitest";

import {
    createBookmarkletHref,
    createBookmarkletScript,
} from "@/lib/bookmarklet";

describe("bookmarklet sync overlay", () => {
    it("uses the bounded overlay and adaptive equal actions without exposing URL text", () => {
        const script = createBookmarkletScript("https://noslog.example");

        expect(script).toContain('width:"334px"');
        expect(script).toContain('maxWidth:"calc(100vw - 32px)"');
        expect(script).toContain('flex:"1 1 0"');
        expect(script).toContain('actions.style.flexDirection="column"');
        expect(script).not.toContain("address.textContent=url");
        expect(script).toContain("resizeObserver.disconnect()");
    });

    it("uses the selected locale in the overlay, API, and result URL", () => {
        const script = createBookmarkletScript("https://noslog.example", "ja");

        expect(script).toContain("NosLog データ同期");
        expect(script).toContain(
            "https://noslog.example/api/receivePlayerData?locale=ja"
        );
        expect(script).toContain("https://noslog.example/ja/bookmarklet");
        expect(script).not.toContain("NosLog 데이터 동기화");
    });

    it("collects only the jackets the admin sync response lists", () => {
        const script = createBookmarkletScript("https://noslog.example");

        expect(script).toContain("result.missingJackets");
        expect(script).toContain(
            '"https://p.eagate.573.jp/game/nostalgia/op3/img/jacket.html?c="+encodeURIComponent(index),{credentials:"include"}'
        );
        expect(script).toContain('"https://noslog.example/api/receiveJacket"');
        expect(script).toContain("body:JSON.stringify({token,index,data:");
        // 동기화 결과만 보여 주고 자켓 수집은 알리지 않는다
        expect(script).not.toContain("자켓");
        expect(() => new Function(script)).not.toThrow();
    });

    it("reads the sync token from its loader instead of embedding it", () => {
        const script = createBookmarkletScript("https://noslog.example");

        expect(script).toContain("document.currentScript");
        expect(script).toContain("loader.dataset.token");
        expect(script).toContain(
            "body:JSON.stringify({token,playerData,recentData,totalData})"
        );
    });
});

describe("bookmarklet loader", () => {
    const token = "eyJ1c2VySWQiOjEyMzQsInZlcnNpb24iOjB9.signature-value";

    it("stays far below the 5,000 characters mobile Chrome keeps", () => {
        for (const locale of ["ko", "ja", "en"] as const) {
            const href = createBookmarkletHref(
                "https://noslog.example",
                token,
                undefined,
                locale
            );
            expect(href.startsWith("javascript:")).toBe(true);
            expect(href.length).toBeLessThan(1_000);
        }
    });

    it("loads the localized script and passes the token outside its URL", () => {
        const loader = decodeURIComponent(
            createBookmarkletHref(
                "https://noslog.example",
                token,
                undefined,
                "ja"
            )
        );

        expect(loader).toContain(
            's.src="https://noslog.example/api/bookmarklet?locale=ja"'
        );
        expect(loader).toContain(`s.dataset.token="${token}"`);
        expect(loader).toContain("NosLogの同期コードを読み込めませんでした。");
        expect(loader).not.toContain("noslog-sync-overlay");
        expect(loader).not.toContain("receivePlayerData");
    });
});
