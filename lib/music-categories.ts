export const MUSIC_CATEGORY_VALUES = [
    "pops",
    "anime",
    "BM",
    "Org",
    "Var",
    "Cl/Jz",
] as const;

export type MusicCategory = (typeof MUSIC_CATEGORY_VALUES)[number];

// DB와 URL의 카테고리 표기를 공식 필터 값으로 통일함
export function normalizeMusicCategory(value: string) {
    const normalizedValue = value.trim().toLocaleLowerCase("en-US");

    return (
        MUSIC_CATEGORY_VALUES.find(
            (category) =>
                category.toLocaleLowerCase("en-US") === normalizedValue
        ) ?? null
    );
}

export function normalizeMusicCategories(value?: string): MusicCategory[] {
    if (!value) return [];

    return Array.from(
        new Set(
            value
                .split(",")
                .map(normalizeMusicCategory)
                .filter((category): category is MusicCategory =>
                    Boolean(category)
                )
        )
    );
}
