import { cn } from "@/lib/utils";
import Link from "next/link";
import { detailTabs, difficultyStyles } from "./musicDetailConfig";
import type { DetailTab, Difficulty, MusicInfo } from "./musicDetailTypes";

interface MusicDetailNavigationProps {
    music: MusicInfo;
    difficulty: Difficulty;
    activeTab: DetailTab;
}

export default function MusicDetailNavigation({
    music,
    difficulty,
    activeTab,
}: MusicDetailNavigationProps) {
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
                        <Link
                            key={item}
                            href={`/music/${music.index}/${item.toLowerCase()}?tab=${activeTab}`}
                            className={cn(
                                "bg-surface rounded-card flex h-14 flex-col items-center justify-center gap-1 border",
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
                        </Link>
                    );
                })}
            </nav>

            <nav className="flex gap-1 overflow-x-auto">
                {detailTabs.map((tab) => (
                    <Link
                        key={tab.value}
                        href={`/music/${music.index}/${difficulty.toLowerCase()}?tab=${tab.value}`}
                        className={cn(
                            "rounded-card flex h-9 shrink-0 items-center px-3 text-sm font-semibold transition-colors",
                            activeTab === tab.value
                                ? "bg-text-primary text-bg"
                                : "bg-surface text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                        )}
                    >
                        {tab.label}
                    </Link>
                ))}
            </nav>
        </>
    );
}
