import { describe, expect, it } from "vitest";

import {
    createProfileSettingsFormData,
    createProfileSettingsSchema,
    profileSettingsInputFromFormData,
    type ProfileSettingsFormValues,
} from "@/features/profile/schemas/profileSettingsSchema";
import { createTranslator, getMessages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/routing";

const validSettings: ProfileSettingsFormValues = {
    avatar: "",
    username: "carol",
    country: "ko-KR",
    locale: "ko",
    showLocalizedMusicTitle: true,
    discordName: "Carol",
    discordUsername: "@carol_01",
    preferredArcadeId: "",
    hideNostalgiaName: false,
    hideDiscordName: false,
    hidePlayCount: false,
};

function schemaFor(locale: Locale) {
    return createProfileSettingsSchema(createTranslator(getMessages(locale)));
}

describe("프로필 설정 스키마", () => {
    it.each([
        ["ko", "닉네임을 입력해주세요."],
        ["ja", "ニックネームを入力してください。"],
        ["en", "Enter a nickname."],
    ] as const)("%s 오류 문구를 해당 언어로 반환한다", (locale, message) => {
        const result = schemaFor(locale).safeParse({
            ...validSettings,
            locale,
            username: " ",
        });

        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.error.flatten().fieldErrors.username).toEqual([message]);
    });

    it("닉네임과 Discord 태그를 저장 형식으로 정규화한다", () => {
        const result = schemaFor("ko").parse(validSettings);

        expect(result.username).toBe("CAROL");
        expect(result.discordUsername).toBe("carol_01");
    });

    it.each([
        ["username", "a".repeat(21)],
        ["discordName", "a".repeat(33)],
        ["discordUsername", "invalid tag"],
        ["preferredArcadeId", "arcade"],
    ] as const)("%s 경계 밖 입력을 거부한다", (field, value) => {
        expect(
            schemaFor("en").safeParse({
                ...validSettings,
                [field]: value,
            }).success
        ).toBe(false);
    });

    it("폼 값과 FormData 변환을 한곳에서 왕복한다", () => {
        const parsed = schemaFor("ko").parse(validSettings);
        const formData = createProfileSettingsFormData(parsed);

        expect(profileSettingsInputFromFormData(formData)).toEqual({
            ...parsed,
            showLocalizedMusicTitle: true,
            hideNostalgiaName: false,
            hideDiscordName: false,
            hidePlayCount: false,
        });
    });
});
