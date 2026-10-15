import type {
    MusicRecordFilter,
    MusicSearchParams,
} from "@/features/music/search/music-query";
import type { MusicCategory } from "@/lib/music-categories";

export type { MusicCategory } from "@/lib/music-categories";

export const MUSIC_DIFFICULTIES = [
    {
        label: "Normal",
        value: "normal",
        max: 12,
        fallbackRange: [1, 12],
        minParam: "normalMin",
        maxParam: "normalMax",
    },
    {
        label: "Hard",
        value: "hard",
        max: 12,
        fallbackRange: [1, 12],
        minParam: "hardMin",
        maxParam: "hardMax",
    },
    {
        label: "Expert",
        value: "expert",
        max: 12,
        fallbackRange: [8, 12],
        minParam: "expertMin",
        maxParam: "expertMax",
    },
    {
        label: "Real",
        value: "real",
        max: 3,
        fallbackRange: [1, 3],
        minParam: "realMin",
        maxParam: "realMax",
    },
] as const;

type MusicDifficulty = (typeof MUSIC_DIFFICULTIES)[number]["value"];
export type MusicDifficultyState = Record<MusicDifficulty, boolean>;
export type MusicDifficultyRanges = Record<MusicDifficulty, [number, number]>;

export interface BuildMusicSearchParamsInput {
    categories: MusicCategory[];
    difficulties: MusicDifficultyState;
    ranges: MusicDifficultyRanges;
    searchValue: string;
    currentParams: MusicSearchParams;
    recordFilters: MusicRecordFilter[];
}
