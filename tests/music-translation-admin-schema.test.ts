import { describe, expect, it } from "vitest";

import {
    createMusicTranslationFormData,
    musicTranslationApproveInputFromFormData,
    musicTranslationApproveSchema,
    musicTranslationCsvTextSchema,
    musicTranslationFormSchema,
    musicTranslationInputFromFormData,
    normalizeMusicTranslationLocale,
    normalizeMusicTranslationStatus,
} from "@/features/music/schemas/musicTranslationAdminSchema";

describe("관리자 악곡 번역 스키마", () => {
    it("지원하는 번역 언어와 검수 상태만 유지한다", () => {
        expect(normalizeMusicTranslationLocale("ko")).toBe("ko");
        expect(normalizeMusicTranslationLocale("ja")).toBeUndefined();
        expect(normalizeMusicTranslationStatus("approved")).toBe("approved");
        expect(normalizeMusicTranslationStatus("published")).toBeUndefined();
    });

    it("번역 제목과 식별자를 다듬어 저장 형식으로 만든다", () => {
        expect(
            musicTranslationFormSchema.parse({
                musicIndex: "  music-1  ",
                locale: "ko",
                title: "  번역 제목  ",
                status: "draft",
            })
        ).toEqual({
            musicIndex: "music-1",
            locale: "ko",
            title: "번역 제목",
            status: "draft",
        });
    });

    it("빈 제목은 삭제 요청으로 허용하고 300자를 넘는 제목은 거부한다", () => {
        expect(
            musicTranslationFormSchema.safeParse({
                musicIndex: "music-1",
                locale: "en",
                title: "",
                status: "draft",
            }).success
        ).toBe(true);

        const result = musicTranslationFormSchema.safeParse({
            musicIndex: "music-1",
            locale: "en",
            title: "a".repeat(301),
            status: "approved",
        });
        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.flatten().fieldErrors).toMatchObject({
            title: ["번역 제목은 300자 이하로 입력해주세요."],
        });
    });

    it("단건 저장과 승인 FormData를 동일한 스키마로 다시 검증한다", () => {
        const values = musicTranslationFormSchema.parse({
            musicIndex: "music-1",
            locale: "en",
            title: "English title",
            status: "approved",
        });
        const saveFormData = createMusicTranslationFormData(values);
        const approveFormData = new FormData();
        approveFormData.set("musicIndex", "music-1");
        approveFormData.set("locale", "en");

        expect(
            musicTranslationFormSchema.parse(
                musicTranslationInputFromFormData(saveFormData)
            )
        ).toEqual(values);
        expect(
            musicTranslationApproveSchema.parse(
                musicTranslationApproveInputFromFormData(approveFormData)
            )
        ).toEqual({
            musicIndex: "music-1",
            locale: "en",
        });
    });

    it("비어 있는 CSV 입력을 거부한다", () => {
        const result = musicTranslationCsvTextSchema.safeParse({ csv: " " });

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.flatten().fieldErrors).toEqual({
            csv: ["CSV 내용을 입력해주세요."],
        });
    });
});
