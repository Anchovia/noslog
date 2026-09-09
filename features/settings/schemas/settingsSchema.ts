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
});
export type SettingsPrivacyValues = z.infer<typeof settingsPrivacySchema>;

export function settingsProfileInput(formData: FormData) {
    return {
        username: formData.get("username"),
        country: formData.get("country"),
        avatar: formData.get("avatar"),
        preferredArcadeId: formData.get("preferredArcadeId"),
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
