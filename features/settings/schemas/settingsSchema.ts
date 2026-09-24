import type { MessageKey } from "@/lib/i18n/messages";
import { z } from "zod";
import { createOnboardingSchema } from "@/features/profile/schemas/profileSettingsSchema";
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
    return createOnboardingSchema(t).extend({
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
});
// 칸 아래 설명 한 줄이 붙는 공개 설정 — 설정 화면 · 가입 화면 공용
export const PRIVACY_HELP: Partial<
    Record<keyof z.infer<typeof settingsPrivacySchema>, MessageKey>
> = {
    showPlayActivity: "settings.activityCoupling",
    showPlayScores: "settings.scoresCoupling",
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
