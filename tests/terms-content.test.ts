import { describe, expect, it } from "vitest";

import { getTermsCopy } from "@/features/terms/content/terms-content";

describe("이용약관 내용", () => {
    it("세 언어의 조 구성과 시행일이 같다", () => {
        const [ko, ja, en] = (["ko", "ja", "en"] as const).map(getTermsCopy);
        const ids = ko.sections.map((section) => section.id);
        expect(ja.sections.map((section) => section.id)).toEqual(ids);
        expect(en.sections.map((section) => section.id)).toEqual(ids);
        expect(ko.dates).toContain("2026년 12월 1일");
        expect(ja.dates).toContain("2026年12月1日");
        expect(en.dates).toContain("December 1, 2026");
    });

    it("변호사 검토 전에는 「법률 검토 대기」 를 세 언어 모두 남긴다", () => {
        for (const locale of ["ko", "ja", "en"] as const) {
            const blocks = getTermsCopy(locale).sections.flatMap(
                (section) => section.blocks
            );
            expect(blocks.some((block) => block.kind === "warning")).toBe(true);
        }
    });
});
