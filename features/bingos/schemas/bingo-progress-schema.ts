import { z } from "zod";
export const bingoResetSchema = z.object({
    bingoId: z.number().int().positive(),
});

export const bingoProgressSchema = z.object({
    bingoCellId: z.number().refine(Number.isInteger).min(1),
    isCompleted: z.boolean(),
});
