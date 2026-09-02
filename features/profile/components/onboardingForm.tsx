"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { completeOnboarding } from "@/app/(auth)/onboarding/actions";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import {
    createOnboardingFormData,
    createOnboardingSchema,
    PROFILE_COUNTRIES,
    type OnboardingFormValues,
    type OnboardingValues,
} from "@/features/profile/schemas/profileSettingsSchema";
import { applyFormFieldErrors } from "@/lib/forms/errors";
import type { MessageKey } from "@/lib/i18n/messages";

function FieldError({ message }: { message?: string }) {
    return message ? (
        <p className="text-danger mt-1.5 text-xs">{message}</p>
    ) : null;
}

// 최초 로그인에 필요한 공개 프로필 정보를 한 번에 설정함
export default function OnboardingForm() {
    const locale = useLocale();
    const t = useTranslations();
    const onboardingSchema = useMemo(() => createOnboardingSchema(t), [t]);
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<OnboardingFormValues, unknown, OnboardingValues>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            username: "",
            country: undefined,
        },
    });
    const countryLabelKeys: Record<
        (typeof PROFILE_COUNTRIES)[number]["value"],
        MessageKey
    > = {
        "ko-KR": "onboarding.country.kr",
        "ja-JP": "onboarding.country.jp",
        global: "onboarding.country.global",
    };

    async function handleOnboardingSubmit(values: OnboardingValues) {
        clearErrors("root");
        const result = await completeOnboarding(
            createOnboardingFormData(values, locale)
        );

        applyFormFieldErrors(setError, result.fieldErrors);
        setError("root.server", {
            type: "server",
            message: result.message,
        });
    }

    const submit = handleSubmit(handleOnboardingSubmit);

    return (
        <form
            onSubmit={submit}
            noValidate
            className="mt-8 flex w-full flex-col gap-5"
        >
            <label className="text-text-secondary text-xs font-semibold">
                {t("onboarding.nickname")}
                <input
                    type="text"
                    autoComplete="nickname"
                    maxLength={20}
                    autoFocus
                    placeholder={t("onboarding.nicknamePlaceholder")}
                    aria-invalid={Boolean(errors.username)}
                    className="border-border bg-surface text-input placeholder:text-text-disabled focus:border-focus focus:ring-focus/20 rounded-card mt-1.5 h-11 w-full border px-3 transition outline-none focus:ring-2"
                    {...register("username")}
                />
                <FieldError message={errors.username?.message} />
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
                                value={country.value}
                                className="sr-only"
                                {...register("country")}
                            />
                            <span className="text-sm">{country.code}</span>
                            <span className="mt-0.5 text-[11px] font-normal">
                                {t(countryLabelKeys[country.value])}
                            </span>
                        </label>
                    ))}
                </div>
                <FieldError message={errors.country?.message} />
            </fieldset>

            {errors.root?.server?.message ? (
                <p className="border-danger/40 bg-danger/10 text-danger rounded-card border px-3 py-2 text-sm">
                    {errors.root.server.message}
                </p>
            ) : null}

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-text-primary text-bg hover:bg-text-primary/90 focus-visible:ring-focus/40 rounded-card flex h-12 cursor-pointer items-center justify-center text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isSubmitting ? t("onboarding.setting") : t("onboarding.start")}
            </button>
        </form>
    );
}
