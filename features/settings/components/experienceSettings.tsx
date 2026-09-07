"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "@/components/i18n/localeProvider";
import RadioGroup from "@/components/ui/radioGroup";
import { StatusMessage } from "@/components/ui/statusMessage";
import { changeLocale } from "@/app/(nevigation)/settings/actions";
import { localizePath } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/routing";
import { themeSwitchingEnabled } from "@/lib/themePolicy";

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
    return (
        <div className="nl-settings__experience" aria-busy={pending}>
            <RadioGroup
                label={t("header.language")}
                value={locale}
                onValueChange={handleLocale}
                disabled={pending}
                options={[
                    { value: "ko", label: <span lang="ko">한국어</span> },
                    { value: "ja", label: <span lang="ja">日本語</span> },
                    { value: "en", label: <span lang="en">English</span> },
                ]}
            />
            {error ? (
                <StatusMessage severity="danger" role="alert" title={error} />
            ) : null}
            <RadioGroup
                label={t("settings.themeLabel")}
                description={t("settings.themeDevice")}
                disabled={!themeSwitchingEnabled}
                value={theme}
                onValueChange={handleTheme}
                options={(["system", "dark", "light"] as const).map(
                    (value) => ({ value, label: t(`settings.theme.${value}`) })
                )}
            />
        </div>
    );
}
