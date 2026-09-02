"use client";

import { useActionState } from "react";

import {
    type OnboardingActionState,
    completeOnboarding,
} from "@/app/(auth)/onboarding/actions";
import { PROFILE_COUNTRIES } from "@/features/profile/schemas/profileSettingsSchema";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import type { MessageKey } from "@/lib/i18n/messages";

const initialState: OnboardingActionState | null = null;

function FieldError({ messages }: { messages?: string[] }) {
    return messages?.[0] ? (
        <p className="text-danger mt-1.5 text-xs">{messages[0]}</p>
    ) : null;
}

// 최초 로그인에 필요한 공개 프로필 정보를 한 번에 설정함
export default function OnboardingForm() {
    const locale = useLocale();
    const t = useTranslations();
    const [state, action, isPending] = useActionState(
        completeOnboarding,
        initialState
    );
    const countryLabelKeys: Record<string, MessageKey> = {
        "ko-KR": "onboarding.country.kr",
        "ja-JP": "onboarding.country.jp",
        global: "onboarding.country.global",
    };

    return (
        <form action={action} className="mt-8 flex w-full flex-col gap-5">
            <input type="hidden" name="locale" value={locale} />
            <label className="text-text-secondary text-xs font-semibold">
                {t("onboarding.nickname")}
                <input
                    name="username"
                    type="text"
                    autoComplete="nickname"
                    maxLength={20}
                    required
                    autoFocus
                    placeholder={t("onboarding.nicknamePlaceholder")}
                    aria-invalid={Boolean(state?.fieldErrors?.username)}
                    className="border-border bg-surface text-input placeholder:text-text-disabled focus:border-focus focus:ring-focus/20 rounded-card mt-1.5 h-11 w-full border px-3 transition outline-none focus:ring-2"
                />
                <FieldError messages={state?.fieldErrors?.username} />
            </label>

            <fieldset>
                <legend className="text-text-secondary text-xs font-semibold">
                    {t("onboarding.country")}
                </legend>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                    {PROFILE_COUNTRIES.map((country) => (
                        <label
                            key={country.value}
                            className="has-checked:border-interactive has-checked:bg-interactive has-checked:text-on-interactive border-border bg-surface text-text-secondary hover:bg-surface-muted rounded-card flex min-h-14 cursor-pointer flex-col items-center justify-center border font-semibold transition-colors"
                        >
                            <input
                                type="radio"
                                name="country"
                                value={country.value}
                                required
                                className="sr-only"
                            />
                            <span className="text-sm">{country.code}</span>
                            <span className="mt-0.5 text-[11px] font-normal">
                                {t(countryLabelKeys[country.value])}
                            </span>
                        </label>
                    ))}
                </div>
                <FieldError messages={state?.fieldErrors?.country} />
            </fieldset>

            {state?.message ? (
                <p className="border-danger/40 bg-danger/10 text-danger rounded-card border px-3 py-2 text-sm">
                    {state.message}
                </p>
            ) : null}

            <button
                type="submit"
                disabled={isPending}
                className="bg-text-primary text-bg hover:bg-text-primary/90 focus-visible:ring-focus/40 rounded-card flex h-12 cursor-pointer items-center justify-center text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isPending ? t("onboarding.setting") : t("onboarding.start")}
            </button>
        </form>
    );
}
