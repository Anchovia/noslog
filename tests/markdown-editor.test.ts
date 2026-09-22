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
    // 2026-09-23 T-c — 기울임 · 취소선 · 코드 · 인용 · 작은 소제목 · 구분선 · 표
    it("wraps the selection for italic, strikethrough and inline code", () => {
        expect(applyMarkdownTool("abc", 0, 3, "italic").value).toBe("*abc*");
        expect(applyMarkdownTool("abc", 0, 3, "strike").value).toBe("~~abc~~");
        const code = applyMarkdownTool("abc", 0, 3, "code");
        expect(code.value).toBe("`abc`");
        expect(code.value.slice(code.start, code.end)).toBe("abc");
    });
    it("prefixes selected lines for quotes and the smaller heading", () => {
        expect(applyMarkdownTool("one\ntwo", 0, 7, "quote").value).toBe(
            "> one\n> two"
        );
        expect(applyMarkdownTool("title", 0, 0, "subheading").value).toBe(
            "### title"
        );
    });
    it("puts rules and tables in their own block", () => {
        expect(applyMarkdownTool("intro", 5, 5, "rule").value).toBe(
            "intro\n\n---\n"
        );
        const table = applyMarkdownTool("intro", 5, 5, "table", "| A |\n| - |");
        expect(table.value).toBe("intro\n\n| A |\n| - |\n");
        expect(table.value.slice(table.start, table.end)).toBe("| A |\n| - |");
    });
});
