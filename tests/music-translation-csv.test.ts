import { describe, expect, it } from "vitest";

import { parseMusicTranslationCsv } from "@/lib/musicTranslations/csv";
import { serializeMusicTranslationCsv } from "@/lib/musicTranslations/export";

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

describe("serializeMusicTranslationCsv", () => {
    it("원제와 읽기 제목을 포함한 UTF-8 CSV를 만든다", () => {
        const csv = serializeMusicTranslationCsv([
            {
                index: "music-1",
                originalTitle: '제목, "부제"',
                titleKana: "ヨミ",
                locale: "en",
                title: "English title",
                status: "approved",
            },
        ]);

        expect(csv.startsWith("\uFEFF")).toBe(true);
        expect(csv).toContain(
            "index,original_title,title_kana,locale,title,status"
        );
        expect(csv).toContain('"제목, ""부제"""');
        expect(csv).toContain('"English title","approved"');
    });

    it("스프레드시트 수식으로 해석될 수 있는 값을 무력화한다", () => {
        const csv = serializeMusicTranslationCsv([
            {
                index: "music-2",
                originalTitle: "=IMPORTXML()",
                titleKana: "",
                locale: "ko",
                title: "+SUM(1,2)",
                status: "draft",
            },
        ]);

        expect(csv).toContain('"\'=IMPORTXML()"');
        expect(csv).toContain('"\'+SUM(1,2)"');
    });
});
