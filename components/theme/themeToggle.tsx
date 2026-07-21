"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

import { Switch } from "@/components/ui/Switch";

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
    window.dispatchEvent(
        new CustomEvent(THEME_CHANGE_EVENT, { detail: theme })
    );
}

function subscribe(onStoreChange: () => void) {
    const handleThemeChange = () => onStoreChange();
    const handleStorage = (event: StorageEvent) => {
        if (event.key === THEME_STORAGE_KEY) onStoreChange();
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

export function ThemeIconToggle() {
    const { theme, setTheme } = useTheme();
    const isLight = theme === "light";
    const label = isLight ? "다크 테마로 변경" : "화이트 테마로 변경";

    return (
        <button
            type="button"
            onClick={() => setTheme(isLight ? "dark" : "light")}
            className="text-text-secondary hover:bg-surface-muted hover:text-text-primary focus-visible:ring-text-secondary/30 flex size-7 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
            aria-label={label}
            title={label}
        >
            {isLight ? (
                <Moon className="size-3.5" aria-hidden />
            ) : (
                <Sun className="size-3.5" aria-hidden />
            )}
        </button>
    );
}

export function ThemeSetting() {
    const { theme, setTheme } = useTheme();
    const isLight = theme === "light";

    return (
        <section className="bg-surface rounded-card flex flex-col gap-4 p-4">
            <div>
                <h2 className="text-section">화면 설정</h2>
                <p className="text-caption mt-1">
                    이 브라우저에서 사용할 화면 테마를 선택합니다.
                </p>
            </div>
            <label className="border-border bg-bg rounded-card flex cursor-pointer items-center justify-between gap-4 border p-3">
                <span className="flex min-w-0 items-center gap-3">
                    <span className="bg-surface-muted text-text-secondary flex size-9 shrink-0 items-center justify-center rounded-full">
                        <Sun className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0">
                        <span className="text-body block text-sm font-semibold">
                            화이트 테마
                        </span>
                        <span className="text-caption mt-0.5 block">
                            밝은 배경과 어두운 텍스트를 사용합니다.
                        </span>
                    </span>
                </span>
                <Switch
                    checked={isLight}
                    onCheckedChange={(checked) =>
                        setTheme(checked ? "light" : "dark")
                    }
                    aria-label="화이트 테마"
                />
            </label>
        </section>
    );
}
