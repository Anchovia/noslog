"use client";

import type { MusicSearchParams } from "@/app/(nevigation)/music/query";
import { searchSchema, searchType } from "@/app/(nevigation)/music/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Slider from "@radix-ui/react-slider";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

const categories = [
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

const difficulties = [
    {
        label: "Normal",
        value: "normal",
        max: 12,
        fallbackRange: [1, 12],
        colorClassName: "border-normal bg-normal/15 text-normal",
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
        rangeClassName: "bg-real",
        minParam: "realMin",
        maxParam: "realMax",
    },
] as const;

type Category = (typeof categories)[number]["value"];
type Difficulty = (typeof difficulties)[number]["value"];
type DifficultyState = Record<Difficulty, boolean>;
type DifficultyRanges = Record<Difficulty, [number, number]>;

interface MusicSearchProps {
    searchParams: MusicSearchParams;
}

function parseCategories(value?: string): Category[] {
    if (!value) {
        return [];
    }

    return value
        .split(",")
        .filter((category): category is Category =>
            categories.some((item) => item.value === category)
        );
}

function parseEnabled(value: string | undefined, fallback = false) {
    if (value === undefined) {
        return fallback;
    }

    return value === "true";
}

function hasExplicitDifficulty(searchParams: MusicSearchParams) {
    return ["normal", "hard", "expert", "real"].some(
        (difficulty) =>
            searchParams[difficulty as keyof MusicSearchParams] !== undefined
    );
}

function parseRange(
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

export default function MusicSearch({ searchParams }: MusicSearchProps) {
    const router = useRouter();
    const hasDifficulty = hasExplicitDifficulty(searchParams);
    const rangeUpdateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>(
        () => parseCategories(searchParams.categories)
    );
    const [selectedDifficulties, setSelectedDifficulties] =
        useState<DifficultyState>(() => ({
            normal: parseEnabled(searchParams.normal),
            hard: parseEnabled(searchParams.hard),
            expert: parseEnabled(searchParams.expert, !hasDifficulty),
            real: parseEnabled(searchParams.real),
        }));
    const [difficultyRanges, setDifficultyRanges] = useState<DifficultyRanges>(
        () => ({
            normal: parseRange(
                searchParams.normalMin,
                searchParams.normalMax,
                [1, 12]
            ),
            hard: parseRange(
                searchParams.hardMin,
                searchParams.hardMax,
                [1, 12]
            ),
            expert: parseRange(
                searchParams.expertMin,
                searchParams.expertMax,
                [8, 12]
            ),
            real: parseRange(
                searchParams.realMin,
                searchParams.realMax,
                [1, 3]
            ),
        })
    );

    const { register, handleSubmit, getValues } = useForm<searchType>({
        resolver: zodResolver(searchSchema),
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

    const navigateWithFilters = (
        categories: Category[],
        difficultyState: DifficultyState,
        ranges: DifficultyRanges,
        searchValue = getValues("search")?.trim() ?? ""
    ) => {
        const params = new URLSearchParams();

        if (searchValue !== "") {
            params.set("q", searchValue);
        }

        if (categories.length > 0) {
            params.set("categories", categories.join(","));
        }

        difficulties.forEach((difficulty) => {
            const isSelected = difficultyState[difficulty.value];

            params.set(difficulty.value, String(isSelected));

            if (!isSelected) {
                return;
            }

            const range = ranges[difficulty.value];

            params.set(difficulty.minParam, String(range[0]));
            params.set(difficulty.maxParam, String(range[1]));
        });

        if (searchParams.sort) {
            params.set("sort", searchParams.sort);
        }

        if (searchParams.order) {
            params.set("order", searchParams.order);
        }

        if (searchParams.view) {
            params.set("view", searchParams.view);
        }

        router.replace(`/music?${params.toString()}`, { scroll: false });
    };

    const handleCategoryToggle = (category: Category) => {
        const nextCategories = selectedCategories.includes(category)
            ? selectedCategories.filter((item) => item !== category)
            : [...selectedCategories, category];

        setSelectedCategories(nextCategories);
        navigateWithFilters(
            nextCategories,
            selectedDifficulties,
            difficultyRanges
        );
    };

    const handleDifficultyToggle = (difficulty: Difficulty) => {
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
    };

    const handleRangeChange = (
        difficulty: Difficulty,
        value: number[],
        fallbackMax: number
    ) => {
        const nextRanges = {
            ...difficultyRanges,
            [difficulty]: [value[0] ?? 1, value[1] ?? fallbackMax],
        } as DifficultyRanges;

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
    };

    const handleRangeCommit = (
        difficulty: Difficulty,
        value: number[],
        fallbackMax: number
    ) => {
        if (rangeUpdateTimer.current) {
            clearTimeout(rangeUpdateTimer.current);
            rangeUpdateTimer.current = null;
        }

        const nextRanges = {
            ...difficultyRanges,
            [difficulty]: [value[0] ?? 1, value[1] ?? fallbackMax] as [
                number,
                number,
            ],
        };

        setDifficultyRanges(nextRanges);
        navigateWithFilters(
            selectedCategories,
            selectedDifficulties,
            nextRanges
        );
    };

    const onSubmit = handleSubmit((data: searchType) => {
        const search = data.search?.trim() ?? "";

        navigateWithFilters(
            selectedCategories,
            selectedDifficulties,
            difficultyRanges,
            search
        );
    });

    return (
        <section>
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <div className="flex gap-2">
                    <div className="border-border bg-surface rounded-card flex h-9.5 flex-1 items-center gap-2 border px-3">
                        <span className="border-text-disabled size-4 rounded-full border-2" />
                        <input
                            placeholder="곡 제목 · 아티스트 검색"
                            className="text-input placeholder:text-text-disabled h-full min-w-0 flex-1 bg-transparent outline-none"
                            {...register("search")}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                        className="bg-surface-muted text-section rounded-card flex h-9.5 items-center px-3"
                    >
                        필터
                    </button>
                </div>

                {isFilterOpen && (
                    <article className="border-text-disabled/70 bg-bg rounded-card flex flex-col gap-4 border border-dashed p-3">
                        <div className="flex flex-col gap-2">
                            <span className="text-caption font-semibold">
                                카테고리
                            </span>

                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.value}
                                        type="button"
                                        onClick={() =>
                                            handleCategoryToggle(category.value)
                                        }
                                        className={cn(
                                            "rounded-full border px-3 py-1 text-xs leading-normal transition-colors",
                                            selectedCategories.includes(
                                                category.value
                                            )
                                                ? category.className
                                                : "border-border bg-surface-muted text-text-secondary"
                                        )}
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <span className="text-caption font-semibold">
                                난이도
                            </span>

                            <div className="flex flex-wrap gap-2">
                                {difficulties.map((difficulty) => (
                                    <button
                                        key={difficulty.value}
                                        type="button"
                                        onClick={() =>
                                            handleDifficultyToggle(
                                                difficulty.value
                                            )
                                        }
                                        className={cn(
                                            "rounded-full border px-3 py-1 text-xs leading-normal transition-colors",
                                            selectedDifficulties[
                                                difficulty.value
                                            ]
                                                ? difficulty.colorClassName
                                                : "border-border bg-surface-muted text-text-secondary"
                                        )}
                                    >
                                        {difficulty.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {difficulties.map((difficulty) => {
                            if (!selectedDifficulties[difficulty.value]) {
                                return null;
                            }

                            const range = difficultyRanges[difficulty.value];

                            return (
                                <div
                                    key={difficulty.value}
                                    className="flex flex-col gap-3"
                                >
                                    <p className="text-xs font-bold">
                                        <span
                                            className={cn(
                                                difficulty.value === "normal" &&
                                                    "text-normal",
                                                difficulty.value === "hard" &&
                                                    "text-hard",
                                                difficulty.value === "expert" &&
                                                    "text-expert",
                                                difficulty.value === "real" &&
                                                    "text-real"
                                            )}
                                        >
                                            {difficulty.label}
                                        </span>
                                        <span className="text-text-secondary">
                                            {" "}
                                            레벨{" "}
                                        </span>
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
                                        onValueChange={(value) =>
                                            handleRangeChange(
                                                difficulty.value,
                                                value,
                                                difficulty.max
                                            )
                                        }
                                        onValueCommit={(value) =>
                                            handleRangeCommit(
                                                difficulty.value,
                                                value,
                                                difficulty.max
                                            )
                                        }
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
                                        <Slider.Thumb className="bg-text-primary block size-4 rounded-full outline-none" />
                                        <Slider.Thumb className="bg-text-primary block size-4 rounded-full outline-none" />
                                    </Slider.Root>

                                    <div className="text-text-disabled flex items-center justify-between text-[10px]">
                                        <span>1</span>
                                        <span>{difficulty.max}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </article>
                )}
            </form>
        </section>
    );
}
