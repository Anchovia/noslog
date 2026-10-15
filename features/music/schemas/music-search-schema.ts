import z from "zod";

export const musicSearchSchema = z.object({
    search: z.string(),
});

export type MusicSearchFormValues = z.input<typeof musicSearchSchema>;
