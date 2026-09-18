import { describe, expect, it } from "vitest";
import { applyMarkdownTool } from "@/components/ui/markdownEditor";

describe("마크다운 입력 서식 버튼", () => {
    it("wraps the selection in bold and keeps the text selected", () => {
        expect(applyMarkdownTool("abc def", 4, 7, "bold")).toEqual({
            value: "abc **def**",
            start: 6,
            end: 9,
        });
    });
    it("prefixes every selected line for headings and lists", () => {
        expect(applyMarkdownTool("one\ntwo", 1, 6, "list").value).toBe(
            "- one\n- two"
        );
        expect(applyMarkdownTool("intro\ntitle", 8, 8, "heading").value).toBe(
            "intro\n## title"
        );
        expect(applyMarkdownTool("a", 0, 1, "ordered").value).toBe("1. a");
    });
    it("turns the selection into link text and selects the address", () => {
        const result = applyMarkdownTool("see docs", 4, 8, "link");
        expect(result.value).toBe("see [docs](https://)");
        expect(result.value.slice(result.start, result.end)).toBe("https://");
    });
});
