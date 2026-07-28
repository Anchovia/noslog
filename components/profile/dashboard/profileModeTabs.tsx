import { cn } from "@/lib/utils";
import { useTranslations } from "@/components/i18n/localeProvider";

import type { ProfileMode } from "./profileTypes";

interface ProfileModeTabsProps {
    mode: ProfileMode;
    onChange: (mode: ProfileMode) => void;
}

// Basic과 Recital 프로필 전환을 한곳에서 관리함
export default function ProfileModeTabs({
    mode,
    onChange,
}: ProfileModeTabsProps) {
    const t = useTranslations();

    return (
        <nav
            className="bg-surface rounded-card grid grid-cols-2 p-1"
            aria-label={t("profile.modeAria")}
        >
            {(["basic", "recital"] as const).map((item) => (
                <button
                    key={item}
                    type="button"
                    onClick={() => onChange(item)}
                    className={cn(
                        "focus-visible:ring-focus/40 h-9 cursor-pointer rounded-md text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none",
                        mode === item
                            ? "bg-text-primary text-bg hover:bg-text-primary/90"
                            : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                    )}
                >
                    {item === "basic" ? "Basic" : "Recital"}
                </button>
            ))}
        </nav>
    );
}
