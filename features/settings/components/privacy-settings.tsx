"use client";

import { useRef, useState } from "react";

import { savePrivacy } from "@/app/(site)/settings/actions";
import { useTranslations } from "@/components/i18n/locale-provider";
import Button from "@/components/ui/button";
import ModalDialog from "@/components/ui/modal-dialog";
import { StatusMessage } from "@/components/ui/status-message";
import { Switch } from "@/components/ui/switch";
import type { SettingsPrivacyValues } from "@/features/settings/schemas/settings-schema";
import {
    PRIVACY_HELP,
    settingsFormData,
    settingsPrivacySchema,
} from "@/features/settings/schemas/settings-schema";

// 번역 허용을 켤 때 창에 알리는 국외 이전 항목(「개인정보 보호법」 제17조 · 제28조의8). emphasis = 시행령 제17조 제3항의 중요한 내용
const TRANSLATION_CONSENT_ROWS = [
    { row: "recipient", emphasis: true },
    { row: "contact", emphasis: false },
    { row: "country", emphasis: false },
    { row: "timing", emphasis: false },
    { row: "items", emphasis: false },
    { row: "purpose", emphasis: true },
    { row: "retention", emphasis: true },
] as const;

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
    // 실패한 한 번을 「다시 시도」 로 그대로 다시 보낸다
    const [failed, setFailed] = useState<{
        key: keyof SettingsPrivacyValues;
        next: boolean;
    } | null>(null);
    const busy = useRef(false);
    const [consentOpen, setConsentOpen] = useState(false);
    const translationSwitch = useRef<HTMLButtonElement>(null);
    // 번역 허용은 켤 때만 동의 창을 거친다. 끌 때와 다른 공개 설정은 바로 저장한다
    function request(key: keyof SettingsPrivacyValues, next: boolean) {
        if (key === "allowTranslation" && next) {
            if (!busy.current) setConsentOpen(true);
            return;
        }
        void toggle(key, next);
    }
    async function toggle(key: keyof SettingsPrivacyValues, next: boolean) {
        if (busy.current) return;
        setSaved("");
        setError("");
        setFailed(null);
        if (!navigator.onLine) {
            setError(t("settings.offline"));
            setFailed({ key, next });
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
                setFailed({ key, next });
            }
        } catch {
            setValues(previous);
            setError(t("settings.privacySaveError"));
            setFailed({ key, next });
        }
        busy.current = false;
        setSaving(false);
    }
    return (
        <div
            className="nl-settings__form nl-stack nl-stack--24"
            aria-busy={saving}
        >
            <div className="nl-settings__rows">
                {(
                    Object.keys(
                        settingsPrivacySchema.shape
                    ) as (keyof SettingsPrivacyValues)[]
                ).map((key) => (
                    <div
                        key={key}
                        className="nl-settings__row nl-focus-inset nl-forced-press"
                    >
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
                            ref={
                                key === "allowTranslation"
                                    ? translationSwitch
                                    : undefined
                            }
                            id={`settings-${key}`}
                            name={key}
                            checked={values[key]}
                            onCheckedChange={(next) => request(key, next)}
                            aria-describedby={
                                PRIVACY_HELP[key]
                                    ? `settings-${key}-help`
                                    : undefined
                            }
                        />
                    </div>
                ))}
            </div>
            {/* 저장 상태는 이 한 곳 — 저장 중 · 저장됨 · 실패 + 다시 시도 */}
            {error ? (
                <StatusMessage
                    tone="quiet"
                    severity="danger"
                    role="alert"
                    title={error}
                    action={
                        failed ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    void toggle(failed.key, failed.next)
                                }
                            >
                                {t("common.retry")}
                            </Button>
                        ) : null
                    }
                />
            ) : (
                <p
                    role="status"
                    className={
                        saving || saved ? "nl-control nl-muted" : "sr-only"
                    }
                >
                    {saving ? t("settings.saving") : saved}
                </p>
            )}
            <ModalDialog
                open={consentOpen}
                onOpenChange={setConsentOpen}
                title={t("settings.allowTranslation")}
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    translationSwitch.current?.focus();
                }}
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => setConsentOpen(false)}
                        >
                            {t("settings.cancel")}
                        </Button>
                        <Button
                            onClick={() => {
                                setConsentOpen(false);
                                void toggle("allowTranslation", true);
                            }}
                        >
                            {t("settings.translationConsent.agree")}
                        </Button>
                    </>
                }
            >
                <dl className="nl-info-rows">
                    {TRANSLATION_CONSENT_ROWS.map(({ row, emphasis }) => (
                        <div key={row}>
                            <dt className="nl-emphasis-label">
                                {t(`settings.translationConsent.${row}`)}
                            </dt>
                            <dd
                                className={
                                    emphasis
                                        ? "nl-emphasis-label"
                                        : "nl-control"
                                }
                            >
                                {t(`settings.translationConsent.${row}Value`)}
                            </dd>
                        </div>
                    ))}
                </dl>
                <p className="nl-control nl-muted">
                    {t("settings.translationConsent.refuse")}
                </p>
            </ModalDialog>
        </div>
    );
}
