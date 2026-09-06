import { z } from "zod";

export const chartRankingRowSchema = z.object({
    position: z.number().int().positive(),
    rank: z.string(),
    score: z.number().int().positive(),
    fc_type: z.number().int(),
    user_id: z.number().int().positive(),
    user: z.object({
        id: z.number().int().positive(),
        username: z.string().nullable(),
        avatar: z.string().nullable(),
    }),
});

export type ChartRankingRow = z.infer<typeof chartRankingRowSchema>;
