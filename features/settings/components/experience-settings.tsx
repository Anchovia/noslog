"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { changeLocale } from "@/app/(site)/settings/actions";
import { useLocale, useTranslations } from "@/components/i18n/locale-provider";
import CompactSelect from "@/components/ui/compact-select";
import { StatusMessage } from "@/components/ui/status-message";
import type { Locale } from "@/lib/i18n/routing";
import { localizePath } from "@/lib/i18n/routing";
import { themeSwitchingEnabled } from "@/lib/theme-policy";

type ThemePreference = "system" | "dark" | "light";

export default function ExperienceSettings() {
    const t = useTranslations();
    const locale = useLocale();
    const params = useSearchParams();
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [theme, setTheme] = useState<ThemePreference>(
        themeSwitchingEnabled ? "system" : "dark"
    );
    useEffect(() => {
        if (!themeSwitchingEnabled) {
            document.documentElement.dataset.theme = "dark";
            return;
        }
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const apply = () => {
            let value: ThemePreference = "system";
            try {
                const stored = localStorage.getItem("noslog-theme");
                if (stored === "dark" || stored === "light") value = stored;
            } catch {
                /* Device storage is optional. */
            }
            setTheme(value);
            document.documentElement.dataset.theme =
                value === "system" ? (media.matches ? "dark" : "light") : value;
        };
        apply();
        media.addEventListener("change", apply);
        window.addEventListener("storage", apply);
        window.addEventListener("noslog-theme-change", apply);
        return () => {
            media.removeEventListener("change", apply);
            window.removeEventListener("storage", apply);
            window.removeEventListener("noslog-theme-change", apply);
        };
    }, []);
    const handleLocale = (value: Locale) =>
        startTransition(async () => {
            setError("");
            try {
                const result = await changeLocale(value);
                if (!result.success) {
                    setError(result.message);
                    return;
                }
                // Locale lives in the root layout; a full navigation refreshes both
                // its provider and <html lang> after the preference is committed.
                // eslint-disable-next-line @next/next/no-location-assign-relative-destination
                window.location.assign(
                    `${localizePath("/settings", value)}?${params}`
                );
            } catch {
                setError(t("settings.preferenceFailed"));
            }
        });
    const handleTheme = (value: ThemePreference) => {
        if (!themeSwitchingEnabled) return;
        setTheme(value);
        document.documentElement.dataset.theme =
            value === "system"
                ? window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light"
                : value;
        try {
            localStorage.setItem("noslog-theme", value);
        } catch {
            /* Apply in this tab even without storage. */
        }
        window.dispatchEvent(new Event("noslog-theme-change"));
    };
    // 줄 목록(2026-10-01 B1) — 라벨 왼쪽 · 드롭다운 오른쪽. 언어는 고르는 즉시 바뀐다
    return (
        <div className="nl-settings__form" aria-busy={pending}>
            <div className="nl-settings__rows">
                <div className="nl-settings__row">
                    <label htmlFor="settings-language" className="nl-control">
                        {t("header.language")}
                    </label>
                    <CompactSelect
                        id="settings-language"
                        outlined
                        label={t("header.language")}
                        value={locale}
                        onValueChange={handleLocale}
                        disabled={pending}
                        options={[
                            { value: "ko", label: "한국어" },
                            { value: "ja", label: "日本語" },
                            { value: "en", label: "English" },
                        ]}
                    />
                </div>
                <div className="nl-settings__row">
                    <div className="nl-settings__row-copy">
                        <label htmlFor="settings-theme" className="nl-control">
                            {t("settings.themeLabel")}
                        </label>
                        <p className="nl-metadata nl-muted">
                            {t("settings.themeDevice")}
                        </p>
                    </div>
                    <CompactSelect
                        id="settings-theme"
                        outlined
                        label={t("settings.themeLabel")}
                        disabled={!themeSwitchingEnabled}
                        value={theme}
                        onValueChange={handleTheme}
                        options={(["system", "dark", "light"] as const).map(
                            (value) => ({
                                value,
                                label: t(`settings.theme.${value}`),
                            })
                        )}
                    />
                </div>
            </div>
            {error ? (
                <StatusMessage severity="danger" role="alert" title={error} />
            ) : null}
        </div>
    );
}
