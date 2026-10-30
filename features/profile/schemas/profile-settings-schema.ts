import { z } from "zod";

import type { createTranslator } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/routing";

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
        // 만 14세 미만은 법정대리인 동의가 필요해 받지 않는다(개인정보 보호법 제22조의2) — 확인만 받고 저장하지 않는다
        ageConfirmed: z
            .boolean()
            .refine((value) => value, t("onboarding.error.ageRequired")),
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

type OnboardingSchema = ReturnType<typeof createOnboardingSchema>;
export type OnboardingFormValues = z.input<OnboardingSchema>;
export type OnboardingValues = z.output<OnboardingSchema>;

export function onboardingInputFromFormData(formData: FormData) {
    return {
        username: String(formData.get("username") ?? ""),
        country: String(formData.get("country") ?? ""),
        ageConfirmed: formData.get("ageConfirmed") === "true",
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
    formData.set("ageConfirmed", String(values.ageConfirmed));
    for (const key of ONBOARDING_PRIVACY_KEYS)
        formData.set(key, String(values[key]));
    formData.set("locale", locale);

    return formData;
}
