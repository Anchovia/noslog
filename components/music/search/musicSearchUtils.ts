import type { MusicSearchParams } from "@/app/(nevigation)/music/query";
import { normalizeMusicCategories } from "@/lib/musicCategories";

import {
    MUSIC_DIFFICULTIES,
    type BuildMusicSearchParamsInput,
    type MusicCategory,
    type MusicDifficultyRanges,
    type MusicDifficultyState,
} from "./musicSearchTypes";

export function parseMusicCategories(value?: string): MusicCategory[] {
    return normalizeMusicCategories(value);
}

export function parseMusicFilterEnabled(
    value: string | undefined,
    fallback = false
) {
    if (value === undefined) return fallback;
    return value === "true";
}

export function parseMusicRange(
    min: string | undefined,
    max: string | undefined,
    fallback: readonly [number, number]
): [number, number] {
    const parsedMin = Number(min);
    const parsedMax = Number(max);

    return [
        Number.isFinite(parsedMin) ? parsedMin : fallback[0],
        Number.isFinite(parsedMax) ? parsedMax : fallback[1],
    ];
}

export function hasExplicitMusicDifficulty(searchParams: MusicSearchParams) {
    return MUSIC_DIFFICULTIES.some(
        (difficulty) => searchParams[difficulty.value] !== undefined
    );
}

export function getInitialMusicDifficultyState(
    searchParams: MusicSearchParams
): MusicDifficultyState {
    const hasDifficulty = hasExplicitMusicDifficulty(searchParams);

    return {
        normal: parseMusicFilterEnabled(searchParams.normal),
        hard: parseMusicFilterEnabled(searchParams.hard),
        expert: parseMusicFilterEnabled(searchParams.expert, !hasDifficulty),
        real: parseMusicFilterEnabled(searchParams.real),
    };
}

export function getInitialMusicDifficultyRanges(
    searchParams: MusicSearchParams
): MusicDifficultyRanges {
    return {
        normal: parseMusicRange(
            searchParams.normalMin,
            searchParams.normalMax,
            [1, 12]
        ),
        hard: parseMusicRange(
            searchParams.hardMin,
            searchParams.hardMax,
            [1, 12]
        ),
        expert: parseMusicRange(
            searchParams.expertMin,
            searchParams.expertMax,
            [8, 12]
        ),
        real: parseMusicRange(
            searchParams.realMin,
            searchParams.realMax,
            [1, 3]
        ),
    };
}

export function buildMusicSearchParams({
    categories,
    difficulties,
    ranges,
    searchValue,
    currentParams,
}: BuildMusicSearchParamsInput) {
    const params = new URLSearchParams();

    if (searchValue) params.set("q", searchValue);
    if (categories.length > 0) {
        params.set("categories", categories.join(","));
    }

    for (const difficulty of MUSIC_DIFFICULTIES) {
        const isSelected = difficulties[difficulty.value];
        params.set(difficulty.value, String(isSelected));
        if (!isSelected) continue;

        const range = ranges[difficulty.value];
        params.set(difficulty.minParam, String(range[0]));
        params.set(difficulty.maxParam, String(range[1]));
    }

    if (currentParams.sort) params.set("sort", currentParams.sort);
    if (currentParams.order) params.set("order", currentParams.order);
    if (currentParams.view) params.set("view", currentParams.view);

    return params;
}
