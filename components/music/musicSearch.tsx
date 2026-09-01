"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import MusicFilterPanel from "@/components/music/search/musicFilterPanel";
import MusicSearchBar from "@/components/music/search/musicSearchBar";
import {
    MUSIC_DIFFICULTIES,
    type MusicCategory,
    type MusicDifficulty,
    type MusicDifficultyRanges,
    type MusicDifficultyState,
    type MusicSearchProps,
} from "@/components/music/search/musicSearchTypes";
import {
    buildMusicSearchParams,
    getInitialMusicDifficultyRanges,
    getInitialMusicDifficultyState,
    parseMusicCategories,
} from "@/components/music/search/musicSearchUtils";
import {
    MUSIC_RECORD_FILTERS,
    type MusicRecordFilter,
} from "@/app/(nevigation)/music/query";
import { useLocalizedHref } from "@/components/i18n/localeProvider";
import {
    musicSearchSchema,
    type MusicSearchFormValues,
} from "@/features/music/schemas/musicSearchSchema";

export type { MusicSearchProps } from "@/components/music/search/musicSearchTypes";

// 악곡 검색 폼과 즉시 적용 필터 상태를 하위 영역에 연결함
export default function MusicSearch({
    searchParams,
    isLoggedIn,
}: MusicSearchProps) {
    const router = useRouter();
    const localizedHref = useLocalizedHref();
    const rangeUpdateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<
        MusicCategory[]
    >(() => parseMusicCategories(searchParams.categories));
    const [selectedDifficulties, setSelectedDifficulties] =
        useState<MusicDifficultyState>(() =>
            getInitialMusicDifficultyState(searchParams)
        );
    const [difficultyRanges, setDifficultyRanges] =
        useState<MusicDifficultyRanges>(() =>
            getInitialMusicDifficultyRanges(searchParams)
        );
    const [recordFilters, setRecordFilters] = useState<MusicRecordFilter[]>(
        () =>
            isLoggedIn
                ? (searchParams.records ?? "")
                      .split(",")
                      .filter((value): value is MusicRecordFilter =>
                          MUSIC_RECORD_FILTERS.includes(
                              value as MusicRecordFilter
                          )
                      )
                : []
    );
    const { register, handleSubmit, getValues } =
        useForm<MusicSearchFormValues>({
            resolver: zodResolver(musicSearchSchema),
            defaultValues: {
                search: searchParams.q ?? "",
            },
        });

    useEffect(() => {
        return () => {
            if (rangeUpdateTimer.current) {
                clearTimeout(rangeUpdateTimer.current);
            }
        };
    }, []);

    function navigateWithFilters(
        categories: MusicCategory[],
        difficulties: MusicDifficultyState,
        ranges: MusicDifficultyRanges,
        searchValue = getValues("search")?.trim() ?? ""
    ) {
        const params = buildMusicSearchParams({
            categories,
            difficulties,
            ranges,
            searchValue,
            currentParams: searchParams,
            recordFilters,
        });

        router.replace(localizedHref(`/music?${params.toString()}`), {
            scroll: false,
        });
    }

    function handleRecordToggle(filter: MusicRecordFilter) {
        const nextFilters = recordFilters.includes(filter)
            ? recordFilters.filter((item) => item !== filter)
            : [...recordFilters, filter];
        setRecordFilters(nextFilters);

        const params = buildMusicSearchParams({
            categories: selectedCategories,
            difficulties: selectedDifficulties,
            ranges: difficultyRanges,
            searchValue: getValues("search")?.trim() ?? "",
            currentParams: searchParams,
            recordFilters: nextFilters,
        });
        router.replace(localizedHref(`/music?${params.toString()}`), {
            scroll: false,
        });
    }

    function handleCategoryToggle(category: MusicCategory) {
        const nextCategories = selectedCategories.includes(category)
            ? selectedCategories.filter((item) => item !== category)
            : [...selectedCategories, category];

        setSelectedCategories(nextCategories);
        navigateWithFilters(
            nextCategories,
            selectedDifficulties,
            difficultyRanges
        );
    }

    function handleDifficultyToggle(difficulty: MusicDifficulty) {
        const nextDifficulties = {
            ...selectedDifficulties,
            [difficulty]: !selectedDifficulties[difficulty],
        };

        setSelectedDifficulties(nextDifficulties);
        navigateWithFilters(
            selectedCategories,
            nextDifficulties,
            difficultyRanges
        );
    }

    function getNextRanges(
        difficulty: MusicDifficulty,
        value: number[]
    ): MusicDifficultyRanges {
        const config = MUSIC_DIFFICULTIES.find(
            (item) => item.value === difficulty
        );
        const fallbackMax = config?.max ?? 12;

        return {
            ...difficultyRanges,
            [difficulty]: [value[0] ?? 1, value[1] ?? fallbackMax],
        };
    }

    function handleRangeChange(difficulty: MusicDifficulty, value: number[]) {
        const nextRanges = getNextRanges(difficulty, value);
        setDifficultyRanges(nextRanges);

        if (rangeUpdateTimer.current) {
            clearTimeout(rangeUpdateTimer.current);
        }

        rangeUpdateTimer.current = setTimeout(() => {
            navigateWithFilters(
                selectedCategories,
                selectedDifficulties,
                nextRanges
            );
        }, 200);
    }

    function handleRangeCommit(difficulty: MusicDifficulty, value: number[]) {
        if (rangeUpdateTimer.current) {
            clearTimeout(rangeUpdateTimer.current);
            rangeUpdateTimer.current = null;
        }

        const nextRanges = getNextRanges(difficulty, value);
        setDifficultyRanges(nextRanges);
        navigateWithFilters(
            selectedCategories,
            selectedDifficulties,
            nextRanges
        );
    }

    const onSubmit = handleSubmit((data) => {
        navigateWithFilters(
            selectedCategories,
            selectedDifficulties,
            difficultyRanges,
            data.search?.trim() ?? ""
        );
    });

    return (
        <section>
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <MusicSearchBar
                    registration={register("search")}
                    filterOpen={isFilterOpen}
                    onToggleFilter={() =>
                        setIsFilterOpen((current) => !current)
                    }
                />
                {isFilterOpen ? (
                    <MusicFilterPanel
                        categories={selectedCategories}
                        difficulties={selectedDifficulties}
                        ranges={difficultyRanges}
                        onCategoryToggle={handleCategoryToggle}
                        onDifficultyToggle={handleDifficultyToggle}
                        onRangeChange={handleRangeChange}
                        onRangeCommit={handleRangeCommit}
                        recordFilters={recordFilters}
                        isLoggedIn={isLoggedIn}
                        onRecordToggle={handleRecordToggle}
                    />
                ) : null}
            </form>
        </section>
    );
}
