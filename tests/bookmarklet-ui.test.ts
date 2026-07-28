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
});
