import { z } from "zod";

import type { createTranslator } from "@/lib/i18n/messages";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/routing";

type Translator = ReturnType<typeof createTranslator>;

export const PROFILE_COUNTRIES = [
    { value: "ko-KR", label: "대한민국", code: "KR" },
    { value: "ja-JP", label: "일본", code: "JP" },
    { value: "global", label: "기타", code: "GLO" },
] as const;

export const PROFILE_LANGUAGES = [
    { value: "ko", label: "한국어" },
    { value: "ja", label: "日本語" },
    { value: "en", label: "English" },
] as const;

export const profileCountrySchema = z.enum(["ko-KR", "ja-JP", "global"]);

export const profileLocaleSchema = z.enum(SUPPORTED_LOCALES);

export const ONBOARDING_PRIVACY_KEYS = [
    "showNostalgiaName",
    "showDiscordIdentity",
    "showPreferredArcade",
    "showPlayCount",
    "showPlayActivity",
    "showPlayScores",
] as const;
// 가입 때 처음 상태 — 다른 공개 설정은 꺼진 채, 플레이 점수만 켜진 채 시작(2026-09-18 사용자 결정: 기본 공개 · 가입 때 고를 수 있게)
export const ONBOARDING_PRIVACY_DEFAULTS: Record<
    (typeof ONBOARDING_PRIVACY_KEYS)[number],
    boolean
> = {
    showNostalgiaName: false,
    showDiscordIdentity: false,
    showPreferredArcade: false,
    showPlayCount: false,
    showPlayActivity: false,
    showPlayScores: true,
};

export function createOnboardingSchema(t: Translator) {
    return z.object({
        username: z
            .string()
            .refine(
                (value) => !/[\u0000-\u001f\u007f]/.test(value),
                t("onboarding.nicknameHelp")
            )
            .trim()
            .min(1, t("onboarding.error.nicknameRequired"))
            .max(20, t("onboarding.error.nicknameMax"))
            .regex(/^[\p{L}\p{M}\p{N} ._-]*$/u, t("onboarding.nicknameHelp")),
        country: z.enum(profileCountrySchema.options, {
            error: t("onboarding.error.countryRequired"),
        }),
        // 가입 직후 공개 설정. 설정 화면과 같은 6개 — 처음 상태는 ONBOARDING_PRIVACY_DEFAULTS
        ...(Object.fromEntries(
            ONBOARDING_PRIVACY_KEYS.map((key) => [
                key,
                z.boolean().default(ONBOARDING_PRIVACY_DEFAULTS[key]),
            ])
        ) as Record<
            (typeof ONBOARDING_PRIVACY_KEYS)[number],
            z.ZodDefault<z.ZodBoolean>
        >),
    });
}

export type OnboardingSchema = ReturnType<typeof createOnboardingSchema>;
export type OnboardingFormValues = z.input<OnboardingSchema>;
export type OnboardingValues = z.output<OnboardingSchema>;

export function onboardingInputFromFormData(formData: FormData) {
    return {
        username: String(formData.get("username") ?? ""),
        country: String(formData.get("country") ?? ""),
        // 보내지 않은 칸은 처음 상태로(예전 화면 · 새 칸이 없는 요청)
        ...Object.fromEntries(
            ONBOARDING_PRIVACY_KEYS.map((key) => {
                const value = formData.get(key);
                return [
                    key,
                    value === null
                        ? ONBOARDING_PRIVACY_DEFAULTS[key]
                        : value === "true",
                ];
            })
        ),
    };
}

export function createOnboardingFormData(
    values: OnboardingValues,
    locale: Locale
) {
    const formData = new FormData();
    formData.set("username", values.username);
    formData.set("country", values.country);
    for (const key of ONBOARDING_PRIVACY_KEYS)
        formData.set(key, String(values[key]));
    formData.set("locale", locale);

    return formData;
}

export function createProfileSettingsSchema(t: Translator) {
    const discordUsernameSchema = z
        .string()
        .trim()
        .transform((value) => value.replace(/^@+/, ""))
        .refine(
            (value) => value === "" || /^[a-zA-Z0-9._]+$/.test(value),
            t("settings.validation.discordTagCharacters")
        )
        .refine(
            (value) => value.length <= 32,
            t("settings.validation.discordTagMax")
        );

    return z.object({
        avatar: z.union([z.url(), z.literal("")], {
            error: t("settings.validation.avatarUrl"),
        }),
        username: z
            .string()
            .trim()
            .min(1, t("settings.validation.nicknameRequired"))
            .max(20, t("settings.validation.nicknameMax"))
            .transform((value) => value.toUpperCase()),
        country: z.enum(profileCountrySchema.options, {
            error: t("settings.validation.countryRequired"),
        }),
        locale: z.enum(profileLocaleSchema.options, {
            error: t("settings.validation.localeRequired"),
        }),
        showLocalizedMusicTitle: z.boolean(),
        discordName: z
            .string()
            .trim()
            .max(32, t("settings.validation.discordNameMax")),
        discordUsername: discordUsernameSchema,
        preferredArcadeId: z.union([z.literal(""), z.string().regex(/^\d+$/)], {
            error: t("settings.validation.arcadeRequired"),
        }),
        hideNostalgiaName: z.boolean(),
        hideDiscordName: z.boolean(),
        hidePlayCount: z.boolean(),
    });
}

export type ProfileSettingsSchema = ReturnType<
    typeof createProfileSettingsSchema
>;
export type ProfileSettingsFormValues = z.input<ProfileSettingsSchema>;
export type ProfileSettingsValues = z.output<ProfileSettingsSchema>;

export function profileSettingsInputFromFormData(formData: FormData) {
    return {
        avatar: String(formData.get("avatar") ?? ""),
        username: String(formData.get("username") ?? ""),
        country: String(formData.get("country") ?? ""),
        locale: String(formData.get("locale") ?? ""),
        showLocalizedMusicTitle:
            formData.get("showLocalizedMusicTitle") === "true",
        discordName: String(formData.get("discordName") ?? ""),
        discordUsername: String(formData.get("discordUsername") ?? ""),
        preferredArcadeId: String(formData.get("preferredArcadeId") ?? ""),
        hideNostalgiaName: formData.get("hideNostalgiaName") === "true",
        hideDiscordName: formData.get("hideDiscordName") === "true",
        hidePlayCount: formData.get("hidePlayCount") === "true",
    };
}

export function createProfileSettingsFormData(values: ProfileSettingsValues) {
    const formData = new FormData();
    formData.set("avatar", values.avatar);
    formData.set("username", values.username);
    formData.set("country", values.country);
    formData.set("locale", values.locale);
    formData.set(
        "showLocalizedMusicTitle",
        String(values.showLocalizedMusicTitle)
    );
    formData.set("discordName", values.discordName);
    formData.set("discordUsername", values.discordUsername);
    formData.set("preferredArcadeId", values.preferredArcadeId);
    formData.set("hideNostalgiaName", String(values.hideNostalgiaName));
    formData.set("hideDiscordName", String(values.hideDiscordName));
    formData.set("hidePlayCount", String(values.hidePlayCount));

    return formData;
}
