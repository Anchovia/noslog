import type { Prisma } from "@/lib/generated/prisma";

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

type DifficultyKey = "normal" | "hard" | "expert" | "real";

interface SortableMusic {
    index: string;
    title: string;
    normal: number;
    hard: number;
    expert: number;
    real: number | null;
}

function parseEnabled(value: string | undefined, fallback = false) {
    if (value === undefined) {
        return fallback;
    }

    return value === "true";
}

function parseNumber(value: string | undefined, fallback: number) {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : fallback;
}

function getSelectedDifficulties(
    searchParams: MusicSearchParams
): DifficultyKey[] {
    const difficulties: DifficultyKey[] = ["normal", "hard", "expert", "real"];
    const hasExplicitSelection = difficulties.some(
        (difficulty) => searchParams[difficulty] !== undefined
    );

    if (!hasExplicitSelection) {
        return ["expert"];
    }

    return difficulties.filter((difficulty) =>
        parseEnabled(searchParams[difficulty])
    );
}

function getRepresentativeLevel(
    music: SortableMusic,
    difficulties: DifficultyKey[]
) {
    const levels = difficulties
        .map((difficulty) => music[difficulty])
        .filter((level): level is number => level !== null);

    return levels.length > 0 ? Math.max(...levels) : -1;
}

// 필터된 전체 악곡을 동일한 기준으로 정렬함
export function sortMusics<T extends SortableMusic>(
    musics: T[],
    searchParams: MusicSearchParams
) {
    const sortMode = searchParams.sort === "level" ? "level" : "name";
    const sortOrder =
        searchParams.order === "asc" || searchParams.order === "desc"
            ? searchParams.order
            : sortMode === "level"
              ? "desc"
              : "asc";
    const direction = sortOrder === "asc" ? 1 : -1;
    const selectedDifficulties = getSelectedDifficulties(searchParams);

    return [...musics].sort((a, b) => {
        if (sortMode === "level") {
            const levelDifference =
                getRepresentativeLevel(a, selectedDifficulties) -
                getRepresentativeLevel(b, selectedDifficulties);

            if (levelDifference !== 0) {
                return levelDifference * direction;
            }
        }

        const titleDifference = a.title.localeCompare(b.title, "ja", {
            numeric: true,
            sensitivity: "base",
        });

        if (titleDifference !== 0) {
            return titleDifference * (sortMode === "name" ? direction : 1);
        }

        return a.index.localeCompare(b.index, "en", { numeric: true });
    });
}

export function buildMusicWhere({
    q,
    categories,
    normal,
    hard,
    expert,
    real,
    normalMin,
    normalMax,
    hardMin,
    hardMax,
    expertMin,
    expertMax,
    realMin,
    realMax,
}: MusicSearchParams): Prisma.MusicWhereInput {
    const selectedCategories = categories
        ? categories.split(",").filter(Boolean)
        : [];

    const difficultyFilters: Prisma.MusicWhereInput[] = [];
    const selectedDifficulties = getSelectedDifficulties({
        normal,
        hard,
        expert,
        real,
    });

    if (selectedDifficulties.includes("normal")) {
        difficultyFilters.push({
            normal: {
                gte: parseNumber(normalMin, 1),
                lte: parseNumber(normalMax, 12),
            },
        });
    }

    if (selectedDifficulties.includes("hard")) {
        difficultyFilters.push({
            hard: {
                gte: parseNumber(hardMin, 1),
                lte: parseNumber(hardMax, 12),
            },
        });
    }

    if (selectedDifficulties.includes("expert")) {
        difficultyFilters.push({
            expert: {
                gte: parseNumber(expertMin, 8),
                lte: parseNumber(expertMax, 12),
            },
        });
    }

    if (selectedDifficulties.includes("real")) {
        difficultyFilters.push({
            real: {
                not: null,
                gte: parseNumber(realMin, 1),
                lte: parseNumber(realMax, 3),
            },
        });
    }

    return {
        AND: [
            q
                ? {
                      OR: [
                          { title: { contains: q } },
                          { artist: { contains: q } },
                      ],
                  }
                : {},
            selectedCategories.length > 0
                ? { category_short: { in: selectedCategories } }
                : {},
            difficultyFilters.length > 0 ? { OR: difficultyFilters } : {},
        ],
    };
}
