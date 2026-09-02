import { describe, expect, it } from "vitest";

import {
    createOnboardingFormData,
    createOnboardingSchema,
    onboardingInputFromFormData,
} from "@/features/profile/schemas/profileSettingsSchema";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/routing";

function schemaFor(locale: Locale) {
    return createOnboardingSchema(createTranslator(getMessages(locale)));
}

describe("온보딩 스키마", () => {
    it.each([
        ["ko", "닉네임을 입력해주세요."],
        ["ja", "ニックネームを入力してください。"],
        ["en", "Enter a nickname."],
    ] as const)("%s 오류 문구를 해당 언어로 반환한다", (locale, message) => {
        const result = schemaFor(locale).safeParse({
            username: " ",
            country: "ko-KR",
        });

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.flatten().fieldErrors.username).toEqual([message]);
    });

    it("닉네임을 저장 형식으로 정규화한다", () => {
        expect(
            schemaFor("ko").parse({ username: " carol ", country: "ko-KR" })
        ).toEqual({ username: "CAROL", country: "ko-KR" });
    });

    it.each([
        ["", "ko-KR"],
        ["a".repeat(21), "ko-KR"],
        ["carol", "unknown"],
    ])("경계 밖 입력을 거부한다", (username, country) => {
        expect(schemaFor("en").safeParse({ username, country }).success).toBe(
            false
        );
    });

    it("폼 값과 FormData 변환을 한곳에서 왕복한다", () => {
        const parsed = schemaFor("ko").parse({
            username: "carol",
            country: "global",
        });
        const formData = createOnboardingFormData(parsed, "ja");

        expect(onboardingInputFromFormData(formData)).toEqual(parsed);
        expect(formData.get("locale")).toBe("ja");
    });
});
