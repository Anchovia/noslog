import { describe, expect, it } from "vitest";

import {
    createOnboardingFormData,
    createOnboardingSchema,
    onboardingInputFromFormData,
} from "@/features/profile/schemas/profile-settings-schema";
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

    it("닉네임의 바깥 공백만 정리하고 입력한 대소문자를 보존한다", () => {
        expect(
            schemaFor("ko").parse({
                username: " carol ",
                country: "ko-KR",
                ageConfirmed: true,
                termsAccepted: true,
            })
        ).toEqual({
            username: "carol",
            country: "ko-KR",
            ageConfirmed: true,
            termsAccepted: true,
            showNostalgiaName: false,
            showDiscordIdentity: false,
            showPreferredArcade: false,
            showPlayCount: false,
            showPlayActivity: false,
            showPlayScores: true,
        });
    });

    it.each([
        ["", "ko-KR"],
        ["a".repeat(21), "ko-KR"],
        ["carol", "unknown"],
        ["\tcarol", "ko-KR"],
        ["carol\n", "ja-JP"],
        ["ca\u0000rol", "global"],
    ])("경계 밖 입력을 거부한다", (username, country) => {
        expect(
            schemaFor("en").safeParse({
                username,
                country,
                ageConfirmed: true,
                termsAccepted: true,
            }).success
        ).toBe(false);
    });

    it("만 14세 이상 확인이 없으면 가입을 받지 않는다", () => {
        for (const ageConfirmed of [false, undefined]) {
            const result = schemaFor("ko").safeParse({
                username: "carol",
                country: "ko-KR",
                ageConfirmed,
                termsAccepted: true,
            });
            expect(result.success).toBe(false);
        }
        expect(
            schemaFor("ko")
                .safeParse({
                    username: "carol",
                    country: "ko-KR",
                    ageConfirmed: false,
                    termsAccepted: true,
                })
                .error?.flatten().fieldErrors.ageConfirmed
        ).toEqual(["만 14세 이상만 가입할 수 있습니다."]);
    });

    it("이용약관 동의가 없으면 가입을 받지 않는다", () => {
        const result = schemaFor("ko").safeParse({
            username: "carol",
            country: "ko-KR",
            ageConfirmed: true,
            termsAccepted: false,
        });
        expect(result.error?.flatten().fieldErrors.termsAccepted).toEqual([
            "이용약관에 동의해야 가입할 수 있습니다.",
        ]);
    });

    it("폼 값과 FormData 변환을 한곳에서 왕복한다", () => {
        const parsed = schemaFor("ko").parse({
            username: "carol",
            country: "global",
            ageConfirmed: true,
            termsAccepted: true,
        });
        const formData = createOnboardingFormData(parsed, "ja");

        expect(onboardingInputFromFormData(formData)).toEqual(parsed);
        expect(formData.get("locale")).toBe("ja");
    });
});
