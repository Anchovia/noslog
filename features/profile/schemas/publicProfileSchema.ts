import { z } from "zod";

export const profileIdSchema = z.coerce
    .number()
    .int()
    .positive()
    .max(2147483647);

export const profileModeSchema = z.enum(["basic", "recital"]);
export const profileMetricSchema = z.enum(["grade", "rating"]);
export const PROFILE_BATCH_SIZE = 5;
export const profileListQuerySchema = z.object({
    kind: z.enum(["best", "recent"]).default("best"),
    mode: profileModeSchema.default("basic"),
    metric: profileMetricSchema.default("grade"),
    offset: z.coerce.number().int().min(0).max(100000).default(0),
});
export const profilePlaySchema = z.object({
    id: z.number().int(),
    musicIndex: z.string(),
    title: z.string(),
    background: z.string().nullable(),
    difficulty: z.string(),
    level: z.number(),
    score: z.number(),
    rank: z.string(),
    fullCombo: z.boolean(),
    contribution: z.number().nullable(),
    playedAt: z.string().nullable(),
});
export const profileListPayloadSchema = z.object({
    query: profileListQuerySchema,
    status: z.enum(["available", "unavailable", "hidden"]),
    items: z.array(profilePlaySchema),
    hasMore: z.boolean(),
});
export type ProfileListQuery = z.infer<typeof profileListQuerySchema>;
export type ProfileListPayload = z.infer<typeof profileListPayloadSchema>;
export type ProfilePlay = z.infer<typeof profilePlaySchema>;
export type ProfileMode = z.infer<typeof profileModeSchema>;
export type ProfileMetric = z.infer<typeof profileMetricSchema>;

export const profileProgressQuerySchema = z.object({
    mode: profileModeSchema.default("basic"),
    metric: profileMetricSchema.default("grade"),
    range: z.enum(["30", "90", "year", "all"]).default("90"),
});
export const profileProgressPayloadSchema = z.object({
    query: profileProgressQuerySchema,
    status: z.enum(["available", "unavailable"]),
    points: z.array(
        z.object({ date: z.string().datetime(), value: z.number().finite() })
    ),
    current: z.number().finite().nullable(),
});
export type ProfileProgressQuery = z.infer<typeof profileProgressQuerySchema>;
export type ProfileProgressPayload = z.infer<
    typeof profileProgressPayloadSchema
>;
