import z from "zod";

export const musicResultSchema = z.object({
    index: z.string(),
    title: z.string(),
    localizedTitle: z.string().nullable(),
    artist: z.string().nullable(),
    category_short: z.string(),
    background: z.string().nullable(),
    normal: z.number(),
    hard: z.number(),
    expert: z.number(),
    real: z.number().nullable(),
});

export type MusicResult = z.infer<typeof musicResultSchema>;
