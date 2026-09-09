import { normalizeMusicCategories } from "@/lib/musicCategories";

/** URL search state shared by the music route and its client controls. */
export interface MusicSearchParams {
    q?: string;
    categories?: string;
    normal?: string;
    hard?: string;
    expert?: string;
    real?: string;
    normalMin?: string;
    normalMax?: string;
    hardMin?: string;
    hardMax?: string;
    expertMin?: string;
    expertMax?: string;
    realMin?: string;
    realMax?: string;
    sort?: MusicSort;
    order?: "asc" | "desc";
    view?: "list" | "grid";
    records?: string;
}

export const MUSIC_RECORD_FILTERS = [
    "clear",
    "s",
    "fc",
    "pianist",
    "unplayed",
    "recent",
    "miss-near",
    "sjust-low",
    "standard-low",
    "tenuto-low",
    "glissando-low",
    "trill-low",
    "fast",
    "slow",
] as const;
export type MusicRecordFilter = (typeof MUSIC_RECORD_FILTERS)[number];
export const MUSIC_SORTS = ["name", "level", "recent", "weakness"] as const;
export type MusicSort = (typeof MUSIC_SORTS)[number];

export type DifficultyKey = "normal" | "hard" | "expert" | "real";

export interface MusicDifficultyFilter {
    difficulty: "Normal" | "Hard" | "Expert" | "Real";
    min: number;
    max: number;
}

export interface NormalizedMusicQuery {
    q: string;
    categories: string[];
    difficulties: MusicDifficultyFilter[];
    sort: MusicSort;
    order: "asc" | "desc";
    recordFilters: MusicRecordFilter[];
}

const difficulties: DifficultyKey[] = ["normal", "hard", "expert", "real"];
const difficultyConfig: Record<
    DifficultyKey,
    {
        label: MusicDifficultyFilter["difficulty"];
        defaultMin: number;
        defaultMax: number;
    }
> = {
    normal: { label: "Normal", defaultMin: 1, defaultMax: 12 },
    hard: { label: "Hard", defaultMin: 1, defaultMax: 12 },
    expert: { label: "Expert", defaultMin: 8, defaultMax: 12 },
    real: { label: "Real", defaultMin: 1, defaultMax: 3 },
};

function parseEnabled(value: string | undefined, fallback = false) {
    return value === undefined ? fallback : value === "true";
}

function parseNumber(value: string | undefined, fallback: number) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function clampLevel(value: number, max: number) {
    return Math.min(max, Math.max(1, value));
}

export function normalizeMusicQuery(
    searchParams: MusicSearchParams
): NormalizedMusicQuery {
    const hasExplicitDifficulty = difficulties.some(
        (difficulty) => searchParams[difficulty] !== undefined
    );
    const selectedDifficulties = difficulties.filter((difficulty) =>
        parseEnabled(
            searchParams[difficulty],
            !hasExplicitDifficulty && difficulty === "expert"
        )
    );
    const sort = MUSIC_SORTS.includes(searchParams.sort as MusicSort)
        ? (searchParams.sort as MusicSort)
        : "name";

    return {
        q: searchParams.q?.trim().slice(0, 100) ?? "",
        categories: normalizeMusicCategories(searchParams.categories),
        difficulties: selectedDifficulties.map((difficulty) => {
            const config = difficultyConfig[difficulty];
            const first = clampLevel(
                parseNumber(
                    searchParams[`${difficulty}Min`],
                    config.defaultMin
                ),
                config.defaultMax
            );
            const second = clampLevel(
                parseNumber(
                    searchParams[`${difficulty}Max`],
                    config.defaultMax
                ),
                config.defaultMax
            );

            return {
                difficulty: config.label,
                min: Math.min(first, second),
                max: Math.max(first, second),
            };
        }),
        sort,
        order:
            searchParams.order === "asc" || searchParams.order === "desc"
                ? searchParams.order
                : sort === "name"
                  ? "asc"
                  : "desc",
        recordFilters: (searchParams.records ?? "")
            .split(",")
            .filter((value): value is MusicRecordFilter =>
                MUSIC_RECORD_FILTERS.includes(value as MusicRecordFilter)
            ),
    };
}
