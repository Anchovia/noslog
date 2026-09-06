import { z } from "zod";

export const PATTERN_AXES = [
    "stairs",
    "repetition",
    "polyrhythm",
    "offset",
    "chords",
] as const;
export const patternAxisSchema = z.enum(PATTERN_AXES);
const ratingSchema = z.number().int().min(0).max(4).nullable();
export const patternRatingsSchema = z.object({
    stairs: ratingSchema,
    repetition: ratingSchema,
    polyrhythm: ratingSchema,
    offset: ratingSchema,
    chords: ratingSchema,
});
export const communityEvaluationInputSchema = patternRatingsSchema
    .extend({
        chartId: z.number().int().positive(),
        opinion: z.string().trim().max(120),
    })
    .refine(
        (value) =>
            value.opinion.length > 0 ||
            PATTERN_AXES.some((axis) => value[axis] !== null),
        { path: ["opinion"], message: "evaluation_empty" }
    );

export const goalVoteScopeSchema = z.object({
    chartId: z.number().int().positive(),
    mode: z.enum(["basic", "recital"]),
    goal: z.enum(["s", "fc", "pianist"]),
});
export const goalVoteInputSchema = goalVoteScopeSchema.extend({
    value: z
        .number()
        .min(1)
        .max(14.5)
        .refine(
            (value) => Math.abs(value * 10 - Math.round(value * 10)) < 1e-8,
            "vote_increment"
        ),
});
export const opinionQuerySchema = z.object({
    chartId: z.coerce.number().int().positive(),
    sort: z.enum(["helpful", "newest"]).default("helpful"),
    offset: z.coerce.number().int().min(0).default(0),
});
export const opinionReportSchema = z.object({
    evaluationId: z.number().int().positive(),
    reason: z.enum(["spam", "abuse", "sensitive", "other"]),
    explanation: z.string().trim().max(500).optional(),
});
export const communityMutationSchema = z.discriminatedUnion("action", [
    z.object({
        action: z.literal("save-evaluation"),
        input: communityEvaluationInputSchema,
    }),
    z.object({
        action: z.literal("delete-evaluation"),
        chartId: z.number().int().positive(),
    }),
    z.object({
        action: z.literal("delete-opinion"),
        chartId: z.number().int().positive(),
    }),
    z.object({ action: z.literal("save-vote"), input: goalVoteInputSchema }),
    z.object({ action: z.literal("delete-vote"), input: goalVoteScopeSchema }),
    z.object({
        action: z.literal("helpful"),
        evaluationId: z.number().int().positive(),
        selected: z.boolean(),
    }),
    z.object({ action: z.literal("report"), input: opinionReportSchema }),
]);

const aggregateSchema = z.object({
    count: z.number().int().min(0),
    average: z.number().min(0).max(4).nullable(),
});
export const patternSummarySchema = z.object({
    stairs: aggregateSchema,
    repetition: aggregateSchema,
    polyrhythm: aggregateSchema,
    offset: aggregateSchema,
    chords: aggregateSchema,
});
export const patternDataSchema = z.object({ pattern: patternSummarySchema });
export const voteDistributionSchema = z.array(
    z.object({ value: z.number(), count: z.number().int().positive() })
);
export const opinionSchema = z.object({
    id: z.number().int(),
    opinion: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    edited: z.boolean(),
    user: z.object({
        id: z.number().int(),
        username: z.string().nullable(),
        avatar: z.string().nullable(),
    }),
    helpfulCount: z.number().int(),
    viewerHelpful: z.boolean(),
    own: z.boolean(),
    canReact: z.boolean(),
});
export const opinionPageSchema = z.object({
    items: z.array(opinionSchema),
    total: z.number().int(),
    nextOffset: z.number().int().nullable(),
});
export const communityDataSchema = z.object({
    pattern: patternSummarySchema,
    canEvaluate: z.boolean(),
    currentEvaluation: patternRatingsSchema
        .extend({ opinion: z.string(), excluded: z.boolean() })
        .nullable(),
    scopes: z
        .array(
            z.object({
                mode: goalVoteScopeSchema.shape.mode,
                goal: goalVoteScopeSchema.shape.goal,
                placement: z.enum(["published", "not-listed", "not-published"]),
                officialValue: z.number().nullable(),
                count: z.number().int(),
                average: z.number().nullable(),
                distribution: voteDistributionSchema,
                eligible: z.boolean(),
                ownVote: z.number().nullable(),
            })
        )
        .length(6),
    history: z.array(
        z.object({
            id: z.number().int(),
            mode: goalVoteScopeSchema.shape.mode,
            goal: goalVoteScopeSchema.shape.goal,
            previousValue: z.number().nullable(),
            value: z.number().nullable(),
            effectiveAt: z.string(),
        })
    ),
    opinions: opinionPageSchema,
});

export type PatternAxis = z.infer<typeof patternAxisSchema>;
export type PatternRatings = z.infer<typeof patternRatingsSchema>;
export type PatternSummary = z.infer<typeof patternSummarySchema>;
export type CommunityEvaluationInput = z.infer<
    typeof communityEvaluationInputSchema
>;
export type GoalVoteInput = z.infer<typeof goalVoteInputSchema>;
export type CommunityMutation = z.infer<typeof communityMutationSchema>;
export type CommunityData = z.infer<typeof communityDataSchema>;
export type OpinionQuery = z.infer<typeof opinionQuerySchema>;
export type OpinionPage = z.infer<typeof opinionPageSchema>;

export const EMPTY_PATTERN_RATINGS: PatternRatings = {
    stairs: null,
    repetition: null,
    polyrhythm: null,
    offset: null,
    chords: null,
};
