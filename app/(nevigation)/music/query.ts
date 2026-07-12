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

    if (parseEnabled(normal)) {
        difficultyFilters.push({
            normal: {
                gte: parseNumber(normalMin, 1),
                lte: parseNumber(normalMax, 12),
            },
        });
    }

    if (parseEnabled(hard)) {
        difficultyFilters.push({
            hard: {
                gte: parseNumber(hardMin, 1),
                lte: parseNumber(hardMax, 12),
            },
        });
    }

    if (parseEnabled(expert, true)) {
        difficultyFilters.push({
            expert: {
                gte: parseNumber(expertMin, 8),
                lte: parseNumber(expertMax, 12),
            },
        });
    }

    if (parseEnabled(real)) {
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
