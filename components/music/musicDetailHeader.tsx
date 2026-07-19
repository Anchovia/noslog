import { cn } from "@/lib/utils";
import {
    MUSIC_CATEGORY_BADGE_STYLES,
    normalizeMusicCategory,
} from "@/lib/musicCategories";
import { difficultyStyles } from "./musicDetailConfig";
import type { Difficulty, MusicInfo } from "./musicDetailTypes";
import MusicJacket from "./musicJacket";

interface MusicDetailHeaderProps {
    music: MusicInfo;
    difficulty: Difficulty;
    levelConstant: number | null;
}

export default function MusicDetailHeader({
    music,
    difficulty,
    levelConstant,
}: MusicDetailHeaderProps) {
    const category = normalizeMusicCategory(music.category_short);

    return (
        <section className="flex min-w-0 items-center gap-3">
            <MusicJacket
                index={music.index}
                background={music.background}
                title={music.title}
                className="rounded-card size-24 shrink-0"
            />

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span
                    className={cn(
                        "w-fit rounded px-2 py-1 text-xs font-bold",
                        category
                            ? MUSIC_CATEGORY_BADGE_STYLES[category]
                            : "bg-surface-muted text-text-secondary"
                    )}
                >
                    {music.category_short}
                </span>
                <h1 className="text-title truncate">{music.title}</h1>
                <p className="text-text-secondary truncate text-sm">
                    {music.artist || "아티스트 미상"}
                </p>
            </div>

            <div className="shrink-0 text-right">
                <p className="text-caption text-text-disabled">레벨 상수</p>
                <strong
                    className={cn(
                        "text-xl font-black tabular-nums",
                        difficultyStyles[difficulty]
                    )}
                >
                    {levelConstant?.toFixed(1) ?? "-"}
                </strong>
            </div>
        </section>
    );
}
