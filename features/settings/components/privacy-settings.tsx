"use client";

import { useRef, useState } from "react";

import { savePrivacy } from "@/app/(site)/settings/actions";
import { useTranslations } from "@/components/i18n/locale-provider";
import { Switch } from "@/components/ui/switch";
import type { SettingsPrivacyValues } from "@/features/settings/schemas/settings-schema";
import {
    PRIVACY_HELP,
    settingsFormData,
    settingsPrivacySchema,
} from "@/features/settings/schemas/settings-schema";

/**
 * 공개 설정(2026-10-01 A1) — 치지직 · Discord · YouTube 식 스위치 줄, 누르면 바로 저장. 저장 버튼 없음.
 * 한 번에 하나씩 저장하고, 실패하면 스위치를 되돌리고 알린다
 */
export default function PrivacySettings({
    initialValues,
    submitAction = savePrivacy,
}: {
    initialValues: SettingsPrivacyValues;
    submitAction?: typeof savePrivacy;
}) {
    const t = useTranslations();
    const [values, setValues] = useState(initialValues);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState("");
    const [error, setError] = useState("");
    const busy = useRef(false);
    async function toggle(key: keyof SettingsPrivacyValues, next: boolean) {
        if (busy.current) return;
        setSaved("");
        setError("");
        if (!navigator.onLine) {
            setError(t("settings.offline"));
            return;
        }
        busy.current = true;
        setSaving(true);
        const previous = values;
        const updated = { ...values, [key]: next };
        setValues(updated);
        try {
            const result = await submitAction(settingsFormData(updated));
            if (result.success) {
                setValues(result.values);
                setSaved(result.message);
            } else {
                setValues(previous);
                setError(result.message);
            }
        } catch {
            setValues(previous);
            setError(t("settings.saveError"));
        }
        busy.current = false;
        setSaving(false);
    }
    return (
        <div className="nl-settings__form" aria-busy={saving}>
            <div className="nl-settings__rows">
                {(
                    Object.keys(
                        settingsPrivacySchema.shape
                    ) as (keyof SettingsPrivacyValues)[]
                ).map((key) => (
                    <div key={key} className="nl-settings__row">
                        <div className="nl-settings__row-copy">
                            <label
                                htmlFor={`settings-${key}`}
                                className="nl-control"
                            >
                                {t(`settings.${key}`)}
                            </label>
                            {PRIVACY_HELP[key] ? (
                                <p
                                    id={`settings-${key}-help`}
                                    className="nl-metadata nl-muted"
                                >
                                    {t(PRIVACY_HELP[key])}
                                </p>
                            ) : null}
                        </div>
                        <Switch
                            id={`settings-${key}`}
                            name={key}
                            checked={values[key]}
                            onCheckedChange={(next) => void toggle(key, next)}
                            aria-describedby={
                                PRIVACY_HELP[key]
                                    ? `settings-${key}-help`
                                    : undefined
                            }
                        />
                    </div>
                ))}
            </div>
            {error ? (
                <p role="alert" className="nl-body-secondary nl-field__error">
                    {error}
                </p>
            ) : null}
            <p
                role="status"
                className={saved ? "nl-body-secondary" : "sr-only"}
            >
                {saved}
            </p>
        </div>
    );
}
