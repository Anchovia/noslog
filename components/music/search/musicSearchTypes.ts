import type {
    MusicRecordFilter,
    MusicSearchParams,
} from "@/app/(nevigation)/music/query";
import type { MusicCategory } from "@/lib/musicCategories";

export type { MusicCategory } from "@/lib/musicCategories";

export const MUSIC_CATEGORIES = [
    {
        label: "pops",
        value: "pops",
        className: "border-genre-pops bg-genre-pops/15 text-genre-pops",
    },
    {
        label: "anime",
        value: "anime",
        className: "border-genre-anime bg-genre-anime/15 text-genre-anime",
    },
    {
        label: "BM",
        value: "BM",
        className: "border-genre-bm bg-genre-bm/15 text-genre-bm",
    },
    {
        label: "Org",
        value: "Org",
        className:
            "border-genre-original bg-genre-original/15 text-genre-original",
    },
    {
        label: "Var",
        value: "Var",
        className:
            "border-genre-variety bg-genre-variety/15 text-genre-variety",
    },
    {
        label: "Cl/Jz",
        value: "Cl/Jz",
        className:
            "border-genre-classic-jazz bg-genre-classic-jazz/15 text-genre-classic-jazz",
    },
] as const;

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

export type MusicDifficulty = (typeof MUSIC_DIFFICULTIES)[number]["value"];
export type MusicDifficultyConfig = (typeof MUSIC_DIFFICULTIES)[number];
export type MusicDifficultyState = Record<MusicDifficulty, boolean>;
export type MusicDifficultyRanges = Record<MusicDifficulty, [number, number]>;

export interface MusicSearchProps {
    searchParams: MusicSearchParams;
    isLoggedIn: boolean;
}

export interface BuildMusicSearchParamsInput {
    categories: MusicCategory[];
    difficulties: MusicDifficultyState;
    ranges: MusicDifficultyRanges;
    searchValue: string;
    currentParams: MusicSearchParams;
    recordFilters: MusicRecordFilter[];
}
