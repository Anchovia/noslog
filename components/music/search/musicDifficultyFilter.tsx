import { cn } from "@/lib/utils";

import {
    MUSIC_DIFFICULTIES,
    type MusicDifficulty,
    type MusicDifficultyState,
} from "./musicSearchTypes";

interface MusicDifficultyFilterProps {
    selected: MusicDifficultyState;
    onToggle: (difficulty: MusicDifficulty) => void;
}

// 악곡 난이도 선택 버튼을 한곳에서 관리함
export default function MusicDifficultyFilter({
    selected,
    onToggle,
}: MusicDifficultyFilterProps) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-caption font-semibold">난이도</span>
            <div className="flex flex-wrap gap-2">
                {MUSIC_DIFFICULTIES.map((difficulty) => (
                    <button
                        key={difficulty.value}
                        type="button"
                        onClick={() => onToggle(difficulty.value)}
                        className={cn(
                            "rounded-full border px-3 py-1 text-xs leading-normal transition-colors",
                            selected[difficulty.value]
                                ? difficulty.colorClassName
                                : "border-border bg-surface-muted text-text-secondary"
                        )}
                    >
                        {difficulty.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
