import MusicCategoryFilter from "./musicCategoryFilter";
import MusicDifficultyFilter from "./musicDifficultyFilter";
import MusicDifficultyRange from "./musicDifficultyRange";
import {
    MUSIC_DIFFICULTIES,
    type MusicCategory,
    type MusicDifficulty,
    type MusicDifficultyRanges,
    type MusicDifficultyState,
} from "./musicSearchTypes";

interface MusicFilterPanelProps {
    categories: MusicCategory[];
    difficulties: MusicDifficultyState;
    ranges: MusicDifficultyRanges;
    onCategoryToggle: (category: MusicCategory) => void;
    onDifficultyToggle: (difficulty: MusicDifficulty) => void;
    onRangeChange: (difficulty: MusicDifficulty, value: number[]) => void;
    onRangeCommit: (difficulty: MusicDifficulty, value: number[]) => void;
}

// 카테고리, 난이도와 레벨 범위 필터를 조립함
export default function MusicFilterPanel({
    categories,
    difficulties,
    ranges,
    onCategoryToggle,
    onDifficultyToggle,
    onRangeChange,
    onRangeCommit,
}: MusicFilterPanelProps) {
    return (
        <article className="border-text-disabled/70 bg-bg rounded-card flex flex-col gap-4 border border-dashed p-3">
            <MusicCategoryFilter
                selected={categories}
                onToggle={onCategoryToggle}
            />
            <MusicDifficultyFilter
                selected={difficulties}
                onToggle={onDifficultyToggle}
            />
            {MUSIC_DIFFICULTIES.map((difficulty) =>
                difficulties[difficulty.value] ? (
                    <MusicDifficultyRange
                        key={difficulty.value}
                        difficulty={difficulty}
                        range={ranges[difficulty.value]}
                        onChange={onRangeChange}
                        onCommit={onRangeCommit}
                    />
                ) : null
            )}
        </article>
    );
}
