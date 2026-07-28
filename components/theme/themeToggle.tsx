"use client";

import { Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

import { Switch } from "@/components/ui/Switch";
import { useTranslations } from "@/components/i18n/localeProvider";

type Theme = "dark" | "light";

const THEME_STORAGE_KEY = "noslog-theme";
const THEME_CHANGE_EVENT = "noslog-theme-change";

function readTheme(): Theme {
    return document.documentElement.dataset.theme === "light"
        ? "light"
        : "dark";
}

function applyTheme(theme: Theme) {
    document.documentElement.dataset.theme = theme;
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        // 저장소를 사용할 수 없어도 현재 탭의 테마 전환은 유지함
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

function subscribe(onStoreChange: () => void) {
    const handleThemeChange = () => onStoreChange();
    const handleStorage = (event: StorageEvent) => {
        if (event.key !== THEME_STORAGE_KEY) return;

        document.documentElement.dataset.theme =
            event.newValue === "light" ? "light" : "dark";
        onStoreChange();
    };

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    window.addEventListener("storage", handleStorage);
    return () => {
        window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
        window.removeEventListener("storage", handleStorage);
    };
}

function useTheme() {
    const theme = useSyncExternalStore(subscribe, readTheme, () => "dark");

    return {
        theme,
        setTheme: applyTheme,
    };
}

export function ThemeSetting() {
    const t = useTranslations();
    const { theme, setTheme } = useTheme();
    const isLight = theme === "light";

    return (
        <section className="bg-surface rounded-card flex flex-col gap-4 p-4">
            <div>
                <h2 className="text-section">{t("settings.appearance")}</h2>
                <p className="text-caption mt-1">
                    {t("settings.appearanceDescription")}
                </p>
            </div>
            <label className="border-border bg-bg rounded-card flex cursor-pointer items-center justify-between gap-4 border p-3">
                <span className="flex min-w-0 items-center gap-3">
                    <span className="bg-surface-muted text-text-secondary flex size-9 shrink-0 items-center justify-center rounded-full">
                        <Sun className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0">
                        <span className="text-body block text-sm font-semibold">
                            {t("settings.lightTheme")}
                        </span>
                        <span className="text-caption mt-0.5 block">
                            {t("settings.lightThemeDescription")}
                        </span>
                    </span>
                </span>
                <Switch
                    checked={isLight}
                    onCheckedChange={(checked) =>
                        setTheme(checked ? "light" : "dark")
                    }
                    aria-label={t("settings.lightTheme")}
                />
            </label>
        </section>
    );
}
