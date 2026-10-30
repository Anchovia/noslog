import { z } from "zod";

import { pinnedRecordsValueSchema } from "@/features/profile/schemas/pinned-record-schema";
import { createOnboardingSchema } from "@/features/profile/schemas/profile-settings-schema";
import type { MessageKey } from "@/lib/i18n/messages";
import type { createTranslator } from "@/lib/i18n/messages";

export const settingsCategorySchema = z.enum([
    "experience",
    "profile",
    "privacy",
    "connections",
    "account",
]);
export type SettingsCategory = z.infer<typeof settingsCategorySchema>;

export function createSettingsProfileSchema(
    t: ReturnType<typeof createTranslator>
) {
    // 나이 확인은 가입 때 한 번만 받는다
    return createOnboardingSchema(t)
        .omit({ ageConfirmed: true })
        .extend({
            avatar: z.union([z.url(), z.literal("")], {
                error: t("settings.validation.avatarUrl"),
            }),
            preferredArcadeId: z.union(
                [
                    z.literal(""),
                    z
                        .string()
                        .regex(/^[1-9]\d*$/)
                        .refine((value) => Number.isSafeInteger(Number(value))),
                ],
                { error: t("settings.validation.arcadeRequired") }
            ),
            // 프로필 머리에 걸 업적 키(쉼표로 이음, 최대 3 · 빈 값 = 자동). 폼에 없으면 바꾸지 않는다(2026-09-25 D1)
            achievementShowcase: z
                .string()
                .regex(/^(?:[a-z0-9-]{1,64}(?:,[a-z0-9-]{1,64}){0,2})?$/, {
                    error: t("achievement.pin.failed"),
                })
                .optional(),
            // 프로필 고정 기록(2026-09-26 S2) — 고른 순서대로 JSON(채보 · 한 줄 소감), 빈 값 = 자동. 폼에 없으면 바꾸지 않는다
            pinnedRecords: z
                .string()
                .max(2000)
                .refine(
                    (value) =>
                        pinnedRecordsValueSchema.safeParse(value).success,
                    { error: t("profile.pinned.failed") }
                )
                .optional(),
        });
}
export type SettingsProfileFormValues = z.input<
    ReturnType<typeof createSettingsProfileSchema>
>;
export type SettingsProfileValues = z.output<
    ReturnType<typeof createSettingsProfileSchema>
>;

export const settingsPrivacySchema = z.object({
    showNostalgiaName: z.boolean(),
    showDiscordIdentity: z.boolean(),
    showPreferredArcade: z.boolean(),
    showPlayCount: z.boolean(),
    showPlayActivity: z.boolean(),
    showPlayScores: z.boolean(),
    // 공개 설정이 아니라 동의 — 켠 사람의 의견 · 답글만 Gemini 로 번역한다(개인정보 처리방침 「생성형 AI 번역」)
    allowTranslation: z.boolean(),
});
// 칸 아래 설명 한 줄이 붙는 공개 설정 — 설정 화면 · 가입 화면 공용
export const PRIVACY_HELP: Partial<
    Record<keyof z.infer<typeof settingsPrivacySchema>, MessageKey>
> = {
    showPlayActivity: "settings.activityCoupling",
    showPlayScores: "settings.scoresCoupling",
    allowTranslation: "settings.allowTranslationHelp",
};
export type SettingsPrivacyValues = z.infer<typeof settingsPrivacySchema>;

export function settingsProfileInput(formData: FormData) {
    return {
        username: formData.get("username"),
        country: formData.get("country"),
        avatar: formData.get("avatar"),
        preferredArcadeId: formData.get("preferredArcadeId"),
        achievementShowcase: formData.has("achievementShowcase")
            ? formData.get("achievementShowcase")
            : undefined,
        pinnedRecords: formData.has("pinnedRecords")
            ? formData.get("pinnedRecords")
            : undefined,
    };
}

export function settingsPrivacyInput(formData: FormData) {
    return Object.fromEntries(
        Object.keys(settingsPrivacySchema.shape).map((key) => {
            const value = formData.get(key);
            return [
                key,
                value === "true" ? true : value === "false" ? false : undefined,
            ];
        })
    );
}

export function settingsFormData(values: Record<string, string | boolean>) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(values))
        formData.set(key, String(value));
    return formData;
}
