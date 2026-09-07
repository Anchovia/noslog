"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/components/i18n/localeProvider";
import { Checkbox } from "@/components/ui/checkbox";
import Button from "@/components/ui/Button";
import { savePrivacy } from "@/app/(nevigation)/settings/actions";
import {
    settingsPrivacySchema,
    settingsFormData,
} from "@/features/settings/schemas/settingsSchema";
import type { SettingsPrivacyValues } from "@/features/settings/schemas/settingsSchema";
import UnsavedChangesGuard from "./unsavedChangesGuard";

export default function PrivacySettings({
    initialValues,
    submitAction = savePrivacy,
}: {
    initialValues: SettingsPrivacyValues;
    submitAction?: typeof savePrivacy;
}) {
    const t = useTranslations();
    const [saved, setSaved] = useState("");
    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<SettingsPrivacyValues>({
        resolver: zodResolver(settingsPrivacySchema),
        defaultValues: initialValues,
    });
    async function submit(values: SettingsPrivacyValues) {
        clearErrors("root");
        setSaved("");
        if (!navigator.onLine) {
            setError("root.server", {
                message: `${t("settings.offline")} ${t("settings.offlineRetained")}`,
            });
            return;
        }
        try {
            const result = await submitAction(settingsFormData(values));
            if (!result.success) {
                setError("root.server", { message: result.message });
                return;
            }
            reset(result.values);
            setSaved(result.message);
        } catch {
            setError("root.server", { message: t("settings.saveError") });
        }
    }
    return (
        <form
            className="nl-settings__form"
            onSubmit={handleSubmit(submit)}
            noValidate
            aria-busy={isSubmitting}
        >
            <p className="nl-body-secondary nl-muted">
                {t("settings.publicWhenOn")}
            </p>
            <div className="nl-settings__privacy-controls">
                {(
                    Object.keys(
                        settingsPrivacySchema.shape
                    ) as (keyof SettingsPrivacyValues)[]
                ).map((key) => (
                    <div key={key}>
                        <Checkbox
                            label={t(`settings.${key}`)}
                            disabled={isSubmitting}
                            aria-describedby={
                                key === "showPlayActivity"
                                    ? "settings-activity-help"
                                    : undefined
                            }
                            {...register(key)}
                        />
                        {key === "showPlayActivity" ? (
                            <p
                                id="settings-activity-help"
                                className="nl-metadata nl-muted nl-settings__control-help"
                            >
                                {t("settings.activityCoupling")}
                            </p>
                        ) : null}
                    </div>
                ))}
            </div>
            <div className="nl-settings__save">
                {isDirty ? (
                    <p className="nl-body-secondary nl-muted">
                        {t("settings.unsaved")}
                    </p>
                ) : null}
                {errors.root?.server ? (
                    <p
                        role="alert"
                        className="nl-body-secondary nl-field__error"
                    >
                        {errors.root.server.message}
                    </p>
                ) : null}
                <p
                    role="status"
                    className={saved ? "nl-body-secondary" : "sr-only"}
                >
                    {saved}
                </p>
                <Button
                    appearance="foundation"
                    size="sm"
                    type="submit"
                    disabled={!isDirty || isSubmitting}
                >
                    {t(isSubmitting ? "settings.saving" : "settings.save")}
                </Button>
            </div>
            <UnsavedChangesGuard dirty={isDirty} busy={isSubmitting} />
        </form>
    );
}
