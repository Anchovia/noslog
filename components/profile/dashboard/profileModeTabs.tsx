import { cn } from "@/lib/utils";

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
    return (
        <nav
            className="bg-surface rounded-card grid grid-cols-2 p-1"
            aria-label="프로필 모드"
        >
            {(["basic", "recital"] as const).map((item) => (
                <button
                    key={item}
                    type="button"
                    onClick={() => onChange(item)}
                    className={cn(
                        "h-9 rounded-md text-sm font-semibold transition-colors",
                        mode === item
                            ? "bg-text-primary text-bg"
                            : "text-text-secondary"
                    )}
                >
                    {item === "basic" ? "Basic" : "Recital"}
                </button>
            ))}
        </nav>
    );
}
