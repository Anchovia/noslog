import z from "zod";

import {
    MUSIC_CATEGORY_VALUES,
    normalizeMusicCategories,
} from "@/lib/musicCategories";
import { musicResultSchema } from "@/features/music/schemas/musicResultSchema";

export const discoveryDifficulties = [
    "Normal",
    "Hard",
    "Expert",
    "Real",
] as const;
export const discoveryLevelBounds = {
    Normal: 8,
    Hard: 11,
    Expert: 12,
    Real: 3,
} as const;
export const discoveryRecordFilters = [
    "unplayed",
    "s",
    "fc",
    "pianist",
] as const;
export const discoverySorts = [
    "relevance",
    "published",
    "name",
    "level",
    "recent",
] as const;

export const discoveryQuerySchema = z
    .object({
        scope: z.enum(["music", "chart"]),
        q: z.string().trim().max(100),
        categories: z.array(z.enum(MUSIC_CATEGORY_VALUES)).max(6),
        difficulties: z
            .array(
                z.object({
                    difficulty: z.enum(discoveryDifficulties),
                    min: z.number().int().min(1).max(12),
                    max: z.number().int().min(1).max(12),
                })
            )
            .max(4),
        sort: z.enum(discoverySorts).optional(),
        order: z.enum(["asc", "desc"]).optional(),
        sortDifficulty: z.enum(discoveryDifficulties).optional(),
        view: z.enum(["list", "grid"]),
        records: z.array(z.enum(discoveryRecordFilters)).max(4),
        missMin: z.number().int().nonnegative().max(99999).optional(),
        missMax: z.number().int().nonnegative().max(99999).optional(),
    })
    .superRefine((query, context) => {
        for (const range of query.difficulties) {
            if (
                range.min > range.max ||
                range.max > discoveryLevelBounds[range.difficulty]
            )
                context.addIssue({
                    code: "custom",
                    path: ["difficulties"],
                    message: "Invalid level range.",
                });
        }
        if (
            query.missMin !== undefined &&
            query.missMax !== undefined &&
            query.missMin > query.missMax
        )
            context.addIssue({
                code: "custom",
                path: ["missMax"],
                message: "Invalid MISS range.",
            });
        if (query.sort === "level" && !query.sortDifficulty)
            context.addIssue({
                code: "custom",
                path: ["sortDifficulty"],
                message: "Select a difficulty.",
            });
        if (
            query.records.includes("unplayed") &&
            (query.records.length > 1 ||
                query.missMin !== undefined ||
                query.missMax !== undefined ||
                query.sort === "recent")
        )
            context.addIssue({
                code: "custom",
                path: ["records"],
                message: "Conflicting record filters.",
            });
    });

export type DiscoveryQuery = z.infer<typeof discoveryQuerySchema>;
export type DiscoverySort = NonNullable<DiscoveryQuery["sort"]>;

export function getDiscoverySort(query: DiscoveryQuery): DiscoverySort {
    if (
        query.sort &&
        !(query.sort === "relevance" && !query.q) &&
        !(query.sort === "published" && query.scope === "music")
    )
        return query.sort;
    return query.q
        ? "relevance"
        : query.scope === "chart"
          ? "published"
          : "name";
}

export function getDiscoveryOrder(query: DiscoveryQuery) {
    return query.order ?? (getDiscoverySort(query) === "name" ? "asc" : "desc");
}

export function parseDiscoverySearchParams(
    params: Record<string, string | string[] | undefined>
): DiscoveryQuery {
    const value = (key: string) =>
        typeof params[key] === "string" ? (params[key] as string) : undefined;
    const number = (key: string) => {
        const text = value(key);
        return text && /^\d+$/.test(text)
            ? Math.min(99999, Number(text))
            : undefined;
    };
    const records = (value("records") ?? "")
        .split(",")
        .filter((record): record is DiscoveryQuery["records"][number] =>
            discoveryRecordFilters.includes(
                record as DiscoveryQuery["records"][number]
            )
        );
    const unplayed = records.includes("unplayed");
    const requestedSort = value("sort");
    const target = discoveryDifficulties.find(
        (difficulty) =>
            difficulty.toLowerCase() === value("sortDifficulty")?.toLowerCase()
    );
    const sort = discoverySorts.find(
        (sort) =>
            sort === requestedSort &&
            (sort !== "level" || target) &&
            (sort !== "recent" || !unplayed)
    );
    const firstMiss = unplayed ? undefined : number("missMin");
    const lastMiss = unplayed ? undefined : number("missMax");
    return discoveryQuerySchema.parse({
        scope: value("scope") === "chart" ? "chart" : "music",
        q: (value("q") ?? "").trim().slice(0, 100),
        categories: normalizeMusicCategories(value("categories")),
        difficulties: discoveryDifficulties
            .filter((difficulty) => value(difficulty.toLowerCase()) === "true")
            .map((difficulty) => {
                const key = difficulty.toLowerCase();
                const bound = discoveryLevelBounds[difficulty];
                const min = Math.max(
                    1,
                    Math.min(bound, number(`${key}Min`) ?? 1)
                );
                const max = Math.max(
                    1,
                    Math.min(bound, number(`${key}Max`) ?? bound)
                );
                return {
                    difficulty,
                    min: Math.min(min, max),
                    max: Math.max(min, max),
                };
            }),
        sort,
        sortDifficulty: target,
        order:
            value("order") === "asc" || value("order") === "desc"
                ? value("order")
                : undefined,
        view: value("view") === "grid" ? "grid" : "list",
        records: unplayed ? ["unplayed"] : [...new Set(records)],
        missMin:
            firstMiss !== undefined && lastMiss !== undefined
                ? Math.min(firstMiss, lastMiss)
                : firstMiss,
        missMax:
            firstMiss !== undefined && lastMiss !== undefined
                ? Math.max(firstMiss, lastMiss)
                : lastMiss,
    });
}

export function discoverySearchParams(query: DiscoveryQuery) {
    const params = new URLSearchParams();
    if (query.scope === "chart") params.set("scope", query.scope);
    if (query.q) params.set("q", query.q);
    if (query.categories.length)
        params.set("categories", query.categories.join(","));
    for (const range of query.difficulties) {
        const key = range.difficulty.toLowerCase();
        params.set(key, "true");
        params.set(`${key}Min`, String(range.min));
        params.set(`${key}Max`, String(range.max));
    }
    for (const key of [
        "sort",
        "order",
        "sortDifficulty",
        "missMin",
        "missMax",
    ] as const) {
        if (query[key] !== undefined) params.set(key, String(query[key]));
    }
    if (query.view === "grid") params.set("view", "grid");
    if (query.records.length) params.set("records", query.records.join(","));
    return params;
}

export function discoveryFilterCount(query: DiscoveryQuery) {
    return (
        query.categories.length +
        query.difficulties.length +
        query.records.length +
        Number(query.missMin !== undefined || query.missMax !== undefined)
    );
}

export const discoveryResultSchema = musicResultSchema.extend({
    targets: z.array(
        z.object({
            difficulty: z.enum(discoveryDifficulties),
            level: z.number(),
        })
    ),
});
export const discoveryPageSchema = z.object({
    items: z.array(discoveryResultSchema),
    total: z.number().int().nonnegative(),
    chartTotal: z.number().int().nonnegative(),
    nextOffset: z.number().int().nullable(),
});
export type DiscoveryResult = z.infer<typeof discoveryResultSchema>;
export type DiscoveryPage = z.infer<typeof discoveryPageSchema>;
