import * as Slider from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

import type {
    MusicDifficulty,
    MusicDifficultyConfig,
} from "./musicSearchTypes";

interface MusicDifficultyRangeProps {
    difficulty: MusicDifficultyConfig;
    range: [number, number];
    onChange: (difficulty: MusicDifficulty, value: number[]) => void;
    onCommit: (difficulty: MusicDifficulty, value: number[]) => void;
}

// 난이도별 최소·최대 레벨 슬라이더를 한곳에서 관리함
export default function MusicDifficultyRange({
    difficulty,
    range,
    onChange,
    onCommit,
}: MusicDifficultyRangeProps) {
    return (
        <div className="flex flex-col gap-3">
            <p className="text-xs font-bold">
                <span className={difficulty.textClassName}>
                    {difficulty.label}
                </span>
                <span className="text-text-secondary"> 레벨 </span>
                <span className="text-text-primary">
                    {range[0]} - {range[1]}
                </span>
            </p>

            <Slider.Root
                value={range}
                min={1}
                max={difficulty.max}
                step={1}
                minStepsBetweenThumbs={0}
                onValueChange={(value) => onChange(difficulty.value, value)}
                onValueCommit={(value) => onCommit(difficulty.value, value)}
                className="relative flex h-5 w-full touch-none items-center"
            >
                <Slider.Track className="bg-border relative h-1 grow rounded-full">
                    <Slider.Range
                        className={cn(
                            "absolute h-full rounded-full",
                            difficulty.rangeClassName
                        )}
                    />
                </Slider.Track>
                <Slider.Thumb
                    className="bg-interactive block size-4 rounded-full outline-none"
                    aria-label={`${difficulty.label} 최소 레벨`}
                />
                <Slider.Thumb
                    className="bg-interactive block size-4 rounded-full outline-none"
                    aria-label={`${difficulty.label} 최대 레벨`}
                />
            </Slider.Root>

            <div className="text-caption text-text-disabled flex items-center justify-between">
                <span>1</span>
                <span>{difficulty.max}</span>
            </div>
        </div>
    );
}
