import { describe, expect, it } from "vitest";

import { markdownExcerpt } from "@/lib/metadata/excerpt";

describe("markdownExcerpt", () => {
    it("keeps only the text of the first paragraph", () => {
        expect(
            markdownExcerpt(
                "![배너](https://x.test/a.png)\n\n## 바뀐 점\n\n**서열표**가 [새 화면](https://noslog.app)으로 바뀌었습니다.\n\n둘째 문단"
            )
        ).toBe("서열표가 새 화면으로 바뀌었습니다.");
        expect(
            markdownExcerpt(
                "**서열표**가 [새 화면](https://noslog.app)으로 바뀌었습니다.\n줄바꿈도 이어 붙입니다.\n\n둘째 문단"
            )
        ).toBe("서열표가 새 화면으로 바뀌었습니다. 줄바꿈도 이어 붙입니다.");
    });
    it("skips code blocks, tables and rules", () => {
        expect(
            markdownExcerpt(
                "```js\nconst a = 1;\n```\n\n| a | b |\n|---|---|\n\n---\n\n본문"
            )
        ).toBe("본문");
    });
    it("cuts long text at a word boundary with an ellipsis", () => {
        const text = "가나다 라마바 사아자 ".repeat(20);
        const result = markdownExcerpt(text, 30)!;
        expect(result.length).toBeLessThanOrEqual(30);
        expect(result.endsWith("…")).toBe(true);
        expect(result).not.toMatch(/\s…$/);
    });
    it("leaves no angle brackets behind, even from nested tags", () => {
        const result = markdownExcerpt(
            "<scr<script>ipt>alert(1)</script> 안내 <b>굵게</b> a < b"
        )!;
        expect(result).not.toMatch(/[<>]/);
        expect(result).toContain("안내 굵게");
    });
    it("returns null when nothing readable is left", () => {
        expect(markdownExcerpt("![](a.png)\n\n```\nx\n```")).toBeNull();
    });
});
