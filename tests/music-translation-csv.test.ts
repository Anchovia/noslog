import { describe, expect, it } from "vitest";

import { parseMusicTranslationCsv } from "@/lib/musicTranslations/csv";

describe("parseMusicTranslationCsv", () => {
    it("index 기준 번역 행과 따옴표 안의 쉼표를 읽는다", () => {
        const result = parseMusicTranslationCsv(
            [
                "index,locale,title,status",
                'music-1,ko,"제목, 부제",draft',
                "music-1,en,English title,approved",
            ].join("\n")
        );

        expect(result.errors).toEqual([]);
        expect(result.rows).toEqual([
            {
                line: 2,
                index: "music-1",
                locale: "ko",
                title: "제목, 부제",
                status: "draft",
            },
            {
                line: 3,
                index: "music-1",
                locale: "en",
                title: "English title",
                status: "approved",
            },
        ]);
    });

    it("지원하지 않는 언어와 중복 행을 거부한다", () => {
        const result = parseMusicTranslationCsv(
            [
                "index,locale,title,status",
                "music-1,ja,日本語,approved",
                "music-1,ja,重複,approved",
            ].join("\n")
        );

        expect(result.errors).toContain(
            "2행: locale은 ko 또는 en이어야 합니다."
        );
        expect(result.errors).toContain(
            "3행: 같은 index와 locale이 중복되었습니다."
        );
    });

    it("필수 헤더와 검수 상태를 확인한다", () => {
        expect(
            parseMusicTranslationCsv("index,locale,title\nmusic-1,ko,제목")
                .errors
        ).toContain("필수 헤더가 없습니다: status");
        expect(
            parseMusicTranslationCsv(
                "index,locale,title,status\nmusic-1,ko,제목,published"
            ).errors
        ).toContain("2행: status는 draft 또는 approved여야 합니다.");
    });
});
