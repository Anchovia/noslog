"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { completeOnboarding } from "@/app/(auth)/onboarding/actions";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import Button from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, Input, fieldDescription } from "@/components/ui/formField";
import {
    createOnboardingFormData,
    createOnboardingSchema,
    ONBOARDING_PRIVACY_KEYS,
    PROFILE_COUNTRIES,
} from "@/features/profile/schemas/profileSettingsSchema";
import type {
    OnboardingFormValues,
    OnboardingValues,
} from "@/features/profile/schemas/profileSettingsSchema";
import { applyFormFieldErrors } from "@/lib/forms/errors";
import type { MessageKey } from "@/lib/i18n/messages";

export default function OnboardingForm({
    submitAction = completeOnboarding,
}: {
    submitAction?: typeof completeOnboarding;
}) {
    const locale = useLocale();
    const t = useTranslations();
    const schema = useMemo(() => createOnboardingSchema(t), [t]);
    const {
        register,
        handleSubmit,
        setError,
        setFocus,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<OnboardingFormValues, unknown, OnboardingValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            username: "",
            country: undefined,
            ...Object.fromEntries(
                ONBOARDING_PRIVACY_KEYS.map((key) => [key, false])
            ),
        },
    });
    const labels: Record<
        (typeof PROFILE_COUNTRIES)[number]["value"],
        MessageKey
    > = {
        "ko-KR": "onboarding.country.kr",
        "ja-JP": "onboarding.country.jp",
        global: "onboarding.country.global",
    };
    async function submit(values: OnboardingValues) {
        clearErrors("root");
        try {
            const result = await submitAction(
                createOnboardingFormData(values, locale)
            );
            applyFormFieldErrors(setError, result.fieldErrors);
            if (result.fieldErrors?.username) {
                setFocus("username");
                return;
            }
            if (result.fieldErrors?.country) {
                setFocus("country");
                return;
            }
            setError("root.server", {
                type: "server",
                message: result.message,
            });
        } catch {
            setError("root.server", {
                type: "server",
                message: t("onboarding.error.generic"),
            });
        }
    }
    return (
        <form
            className="nl-auth-form"
            onSubmit={handleSubmit(submit)}
            noValidate
            aria-busy={isSubmitting}
        >
            <div>
                <FormField
                    id="onboarding-nickname"
                    label={t("onboarding.nickname")}
                    help={t("onboarding.nicknameHelp")}
                    error={errors.username?.message}
                >
                    <Input
                        id="onboarding-nickname"
                        autoComplete="nickname"
                        maxLength={20}
                        placeholder={t("onboarding.nicknamePlaceholder")}
                        aria-invalid={Boolean(errors.username)}
                        aria-describedby={fieldDescription(
                            "onboarding-nickname",
                            { help: true, error: Boolean(errors.username) }
                        )}
                        readOnly={isSubmitting}
                        {...register("username")}
                    />
                </FormField>
                <p className="nl-body-secondary nl-muted nl-auth-field-description">
                    {t("onboarding.nicknameDescription")}
                </p>
            </div>
            <fieldset className="nl-radio-group" disabled={isSubmitting}>
                <legend className="nl-control">
                    {t("onboarding.country")}
                </legend>
                <p
                    id="onboarding-region-help"
                    className="nl-body-secondary nl-muted"
                >
                    {t("onboarding.regionDescription")}
                </p>
                <div>
                    {PROFILE_COUNTRIES.map((country) => (
                        <label
                            key={country.value}
                            className="nl-radio-group__option nl-control"
                        >
                            <input
                                type="radio"
                                value={country.value}
                                aria-describedby={`onboarding-region-help${errors.country ? " onboarding-region-error" : ""}`}
                                {...register("country")}
                            />
                            <span>{t(labels[country.value])}</span>
                        </label>
                    ))}
                </div>
                {errors.country ? (
                    <p
                        id="onboarding-region-error"
                        className="nl-field__help nl-field__error"
                        role="alert"
                    >
                        {errors.country.message}
                    </p>
                ) : null}
            </fieldset>
            <fieldset className="nl-radio-group" disabled={isSubmitting}>
                <legend className="nl-control">{t("settings.privacy")}</legend>
                <p
                    id="onboarding-privacy-help"
                    className="nl-body-secondary nl-muted"
                >
                    {t("onboarding.privacyDescription")}
                </p>
                {/* 줄 간격은 바로 위 지역 라디오와 같게(간격 0 · 행 높이만) — 2026-09-12 사용자 결정 */}
                <div className="nl-auth-privacy">
                    {ONBOARDING_PRIVACY_KEYS.map((key) => (
                        <div key={key}>
                            <Checkbox
                                label={t(`settings.${key}`)}
                                aria-describedby={
                                    key === "showPlayActivity"
                                        ? "onboarding-privacy-help onboarding-activity-help"
                                        : "onboarding-privacy-help"
                                }
                                {...register(key)}
                            />
                            {key === "showPlayActivity" ? (
                                <p
                                    id="onboarding-activity-help"
                                    className="nl-metadata nl-muted nl-settings__control-help"
                                >
                                    {t("settings.activityCoupling")}
                                </p>
                            ) : null}
                        </div>
                    ))}
                </div>
            </fieldset>
            {errors.root?.server ? (
                <p className="nl-body-secondary nl-field__error" role="alert">
                    {errors.root.server.message}
                </p>
            ) : null}
            <Button
                appearance="foundation"
                size="sm"
                type="submit"
                disabled={isSubmitting}
                className="nl-auth-submit"
            >
                {t(isSubmitting ? "onboarding.setting" : "onboarding.start")}
            </Button>
            <span className="sr-only" role="status">
                {isSubmitting ? t("onboarding.setting") : ""}
            </span>
        </form>
    );
}
