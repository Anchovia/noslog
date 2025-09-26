import z from "zod";

export const searchSchema = z.object({
    search: z.string().nullable(),
});

export type searchType = z.infer<typeof searchSchema>;
