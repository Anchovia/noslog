import z from "zod";

import { musicResultSchema } from "@/features/music/schemas/musicResultSchema";

export const searchScopeSchema = z.enum(["music", "chart"]);
export type SearchScope = z.infer<typeof searchScopeSchema>;

export const searchPreviewQuerySchema = z.object({
    q: z.string().trim().min(1).max(100),
    scope: searchScopeSchema.default("music"),
    locale: z.enum(["ko", "ja", "en"]).default("ko"),
});

export const searchPreviewSchema = z.object({
    total: z.number().int().nonnegative(),
    items: z.array(
        musicResultSchema.extend({
            difficulty: z.string().nullable(),
            level: z.number().nullable(),
        })
    ),
});

export type SearchPreviewQuery = z.infer<typeof searchPreviewQuerySchema>;
export type SearchPreview = z.infer<typeof searchPreviewSchema>;
