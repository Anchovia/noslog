import { z } from "zod";

import {
    TIER_DIFFICULTIES,
    TIER_GOALS,
    TIER_MODES,
    TIER_BAND_VALUES,
    isTierLevelFilter,
} from "@/lib/tiers";

export const tierBrowserQuerySchema = z.object({
    mode: z.enum(TIER_MODES).catch("basic"),
    goal: z.enum(TIER_GOALS).catch("s"),
    difficulties: z.array(z.enum(TIER_DIFFICULTIES)).default([]),
    levels: z.array(z.string().refine(isTierLevelFilter)).default([]),
    bands: z
        .array(z.number().refine((value) => TIER_BAND_VALUES.includes(value)))
        .default([]),
    detailed: z.boolean().default(false),
});
export type TierBrowserQuery = z.infer<typeof tierBrowserQuerySchema>;

export function parseTierBrowserQuery(
    params: URLSearchParams
): TierBrowserQuery {
    const split = (name: string) => [
        ...new Set((params.get(name) ?? "").split(",").filter(Boolean)),
    ];
    return tierBrowserQuerySchema.parse({
        mode: params.get("mode"),
        goal: params.get("goal"),
        difficulties: TIER_DIFFICULTIES.filter((value) =>
            split("difficulty").includes(value)
        ),
        levels: split("level").filter(isTierLevelFilter),
        bands: split("bands")
            .map(Number)
            .filter((value) => TIER_BAND_VALUES.includes(value)),
        detailed: params.get("view") === "detailed",
    });
}

export function serializeTierBrowserQuery(query: TierBrowserQuery) {
    const params = new URLSearchParams({ mode: query.mode, goal: query.goal });
    if (query.difficulties.length)
        params.set("difficulty", query.difficulties.join(","));
    if (query.levels.length) params.set("level", query.levels.join(","));
    if (query.bands.length)
        params.set(
            "bands",
            query.bands.map((value) => value.toFixed(1)).join(",")
        );
    if (query.detailed) params.set("view", "detailed");
    return params;
}

export const tierBrowserBandSummarySchema = z.object({
    id: z.number().int(),
    value: z.number(),
    position: z.number().int(),
    totalCount: z.number().int().nonnegative(),
    achievedCount: z.number().int().nonnegative().nullable(),
});
export const tierBrowserOverviewSchema = z.object({
    list: z
        .object({
            id: z.number().int(),
            slug: z.string(),
            description: z.string().nullable(),
            updatedAt: z.string(),
            bands: z.array(tierBrowserBandSummarySchema),
        })
        .nullable(),
    theoreticalMax: z.number().positive().nullable(),
    viewerId: z.number().int().nullable(),
    showLocalizedTitle: z.boolean(),
});
export const tierBrowserEntrySchema = z.object({
    id: z.number().int(),
    chartId: z.number().int(),
    position: z.number().int(),
    chart: z.object({
        difficulty: z.string(),
        level: z.number(),
        music: z.object({
            index: z.string(),
            title: z.string(),
            localizedTitle: z.string().nullable(),
            background: z.string().nullable(),
        }),
    }),
    record: z
        .object({
            score: z.number(),
            rank: z.string(),
            fc_type: z.number(),
            grade: z.number().nullable(),
            rating: z.number().nullable(),
        })
        .nullable(),
});
export const tierBrowserBandSchema = z.object({
    id: z.number().int(),
    value: z.number(),
    position: z.number().int(),
    entries: z.array(tierBrowserEntrySchema),
});
export type TierBrowserOverview = z.infer<typeof tierBrowserOverviewSchema>;
export type TierBrowserBand = z.infer<typeof tierBrowserBandSchema>;
export type TierBrowserEntry = z.infer<typeof tierBrowserEntrySchema>;
export type TierBrowserBandSummary = z.infer<
    typeof tierBrowserBandSummarySchema
>;
