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
    sort?: "name" | "level";
    order?: "asc" | "desc";
    view?: "list" | "grid";
}

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
    sort: "name" | "level";
    order: "asc" | "desc";
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
    const sort = searchParams.sort === "level" ? "level" : "name";

    return {
        q: searchParams.q?.trim() ?? "",
        categories: searchParams.categories
            ? searchParams.categories.split(",").filter(Boolean)
            : [],
        difficulties: selectedDifficulties.map((difficulty) => {
            const config = difficultyConfig[difficulty];
            return {
                difficulty: config.label,
                min: parseNumber(
                    searchParams[`${difficulty}Min`],
                    config.defaultMin
                ),
                max: parseNumber(
                    searchParams[`${difficulty}Max`],
                    config.defaultMax
                ),
            };
        }),
        sort,
        order:
            searchParams.order === "asc" || searchParams.order === "desc"
                ? searchParams.order
                : sort === "level"
                  ? "desc"
                  : "asc",
    };
}
