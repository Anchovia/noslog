import type {
    MusicRecordFilter,
    MusicSearchParams,
} from "@/features/music/search/musicQuery";
import type { MusicCategory } from "@/lib/musicCategories";

export type { MusicCategory } from "@/lib/musicCategories";

export const MUSIC_DIFFICULTIES = [
    {
        label: "Normal",
        value: "normal",
        max: 12,
        fallbackRange: [1, 12],
        colorClassName: "border-normal bg-normal/15 text-normal",
        textClassName: "text-normal",
        rangeClassName: "bg-normal",
        minParam: "normalMin",
        maxParam: "normalMax",
    },
    {
        label: "Hard",
        value: "hard",
        max: 12,
        fallbackRange: [1, 12],
        colorClassName: "border-hard bg-hard/15 text-hard",
        textClassName: "text-hard",
        rangeClassName: "bg-hard",
        minParam: "hardMin",
        maxParam: "hardMax",
    },
    {
        label: "Expert",
        value: "expert",
        max: 12,
        fallbackRange: [8, 12],
        colorClassName: "border-expert bg-expert/15 text-expert",
        textClassName: "text-expert",
        rangeClassName: "bg-expert",
        minParam: "expertMin",
        maxParam: "expertMax",
    },
    {
        label: "Real",
        value: "real",
        max: 3,
        fallbackRange: [1, 3],
        colorClassName: "border-real bg-real/15 text-real",
        textClassName: "text-real",
        rangeClassName: "bg-real",
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
