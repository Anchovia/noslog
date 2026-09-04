import { z } from "zod";

export const bingoProgressSchema = z.object({
    bingoCellId: z.number().refine(Number.isInteger).min(1),
    isCompleted: z.boolean(),
});
