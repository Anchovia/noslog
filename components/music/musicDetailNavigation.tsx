import { cn } from "@/lib/utils";
import { detailTabs, difficultyStyles } from "./musicDetailConfig";
import type { DetailTab, Difficulty, MusicInfo } from "./musicDetailTypes";
import { useTranslations } from "@/components/i18n/localeProvider";

interface MusicDetailNavigationProps {
    music: MusicInfo;
    difficulty: Difficulty;
    activeTab: DetailTab;
    isLoading?: boolean;
    onNavigate?: (
        difficulty: Difficulty,
        tab: DetailTab,
        page?: number
    ) => void;
}

export default function MusicDetailNavigation({
    music,
    difficulty,
    activeTab,
    isLoading = false,
    onNavigate,
}: MusicDetailNavigationProps) {
    const t = useTranslations();
    const difficultyLevels: Record<Difficulty, number | null> = {
        Normal: music.normal,
        Hard: music.hard,
        Expert: music.expert,
        Real: music.real,
    };

    return (
        <>
            <nav className="grid grid-cols-4 gap-2">
                {(Object.keys(difficultyLevels) as Difficulty[]).map((item) => {
                    const level = difficultyLevels[item];
                    const isAvailable = level !== null;
                    const isActive = difficulty === item;

                    if (!isAvailable) {
                        return (
                            <div
                                key={item}
                                className="bg-surface rounded-card flex h-14 flex-col items-center justify-center gap-1 opacity-40"
                            >
                                <span
                                    className={cn(
                                        "text-xs font-bold",
                                        difficultyStyles[item]
                                    )}
                                >
                                    {item}
                                </span>
                                <span className="text-text-secondary text-xs">
                                    Lv -
                                </span>
                            </div>
                        );
                    }

                    return (
                        <button
                            type="button"
                            key={item}
                            onClick={() => onNavigate?.(item, activeTab, 1)}
                            disabled={isLoading || !onNavigate}
                            className={cn(
                                "bg-surface rounded-card flex h-14 cursor-pointer flex-col items-center justify-center gap-1 border disabled:cursor-wait",
                                isActive
                                    ? "border-text-primary"
                                    : "border-transparent"
                            )}
                        >
                            <span
                                className={cn(
                                    "text-xs font-bold",
                                    difficultyStyles[item]
                                )}
                            >
                                {item}
                            </span>
                            <span
                                className={cn(
                                    "text-xs",
                                    isActive
                                        ? "text-text-primary"
                                        : "text-text-secondary"
                                )}
                            >
                                Lv {level}
                            </span>
                        </button>
                    );
                })}
            </nav>

            <nav className="flex gap-1 overflow-x-auto">
                {detailTabs.map((tab) => (
                    <button
                        type="button"
                        key={tab.value}
                        onClick={() => onNavigate?.(difficulty, tab.value, 1)}
                        disabled={isLoading || !onNavigate}
                        className={cn(
                            "rounded-card flex h-9 shrink-0 cursor-pointer items-center px-3 text-sm font-semibold transition-colors disabled:cursor-wait",
                            activeTab === tab.value
                                ? "bg-text-primary text-bg"
                                : "bg-surface text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                        )}
                    >
                        {t(tab.labelKey)}
                    </button>
                ))}
            </nav>
        </>
    );
}
