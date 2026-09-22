import { z } from "zod";
import { TIER_GOALS, TIER_MODE_GOALS, TIER_MODES } from "@/lib/tiers";

// 모드별 서열표 수의 합 — Basic 3 + Recital 1
const TIER_SCOPE_COUNT = TIER_MODES.reduce(
    (sum, mode) => sum + TIER_MODE_GOALS[mode].length,
    0
);

export const PATTERN_AXES = [
    "stairs",
    "repetition",
    "polyrhythm",
    "offset",
    "chords",
] as const;
const ratingSchema = z.number().int().min(0).max(4).nullable();
const patternRatingsSchema = z.object({
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

const goalVoteScopeSchema = z.object({
    chartId: z.number().int().positive(),
    mode: z.enum(TIER_MODES),
    goal: z.enum(TIER_GOALS),
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
    sort: z.enum(["helpful", "newest"]).default("newest"),
    offset: z.coerce.number().int().min(0).default(0),
});
// 의견 신고 또는 답글 신고(2026-09-22) — 둘 중 하나만
export const opinionReportSchema = z
    .object({
        evaluationId: z.number().int().positive().optional(),
        replyId: z.number().int().positive().optional(),
        reason: z.enum(["spam", "abuse", "sensitive", "other"]),
        explanation: z.string().trim().max(500).optional(),
    })
    .refine(
        (value) =>
            (value.evaluationId === undefined) !==
            (value.replyId === undefined),
        { message: "report_target" }
    );
// 답글 본문 — 의견과 같은 120자(2026-09-22)
export const OPINION_REPLY_MAX_LENGTH = 120;
export const communityTranslateInputSchema = z.object({
    kind: z.enum(["opinion", "reply"]),
    id: z.number().int().positive(),
    locale: z.enum(["ko", "ja", "en"]),
});
export const opinionReplyQuerySchema = z.object({
    chartId: z.coerce.number().int().positive(),
    evaluationId: z.coerce.number().int().positive(),
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
    // 답글(2026-09-22 R1) — 새로 쓰기는 replyId 없이, 고치기는 replyId 와 함께
    z.object({
        action: z.literal("reply-save"),
        chartId: z.number().int().positive(),
        evaluationId: z.number().int().positive(),
        replyId: z.number().int().positive().optional(),
        body: z.string().trim().min(1).max(OPINION_REPLY_MAX_LENGTH),
    }),
    z.object({
        action: z.literal("reply-delete"),
        chartId: z.number().int().positive(),
        replyId: z.number().int().positive(),
    }),
    z.object({
        action: z.literal("reply-like"),
        chartId: z.number().int().positive(),
        replyId: z.number().int().positive(),
        selected: z.boolean(),
    }),
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
const voteDistributionSchema = z.array(
    z.object({ value: z.number(), count: z.number().int().positive() })
);
// 글 언어(글자 종류로 판별)와 저장된 번역 — 번역 버튼은 보는 사람 언어와 다른 글에만(2026-09-22 T1)
const textLanguageSchema = z.enum(["ko", "ja", "en"]).nullable();
const storedTranslationsSchema = z.object({
    ko: z.string().optional(),
    ja: z.string().optional(),
    en: z.string().optional(),
});
const opinionSchema = z.object({
    id: z.number().int(),
    // null = 작성자가 지운 의견인데 답글이 남아 있는 자리(2026-09-22)
    opinion: z.string().nullable(),
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
    replyCount: z.number().int().min(0),
    language: textLanguageSchema,
    translations: storedTranslationsSchema,
});
const opinionReplySchema = z.object({
    id: z.number().int(),
    body: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    edited: z.boolean(),
    user: z.object({
        id: z.number().int(),
        username: z.string().nullable(),
        avatar: z.string().nullable(),
    }),
    likeCount: z.number().int().min(0),
    viewerLiked: z.boolean(),
    own: z.boolean(),
    canReact: z.boolean(),
    language: textLanguageSchema,
    translations: storedTranslationsSchema,
});
export const opinionReplyListSchema = z.object({
    items: z.array(opinionReplySchema),
    canReply: z.boolean(),
    translationEnabled: z.boolean(),
});
export const opinionPageSchema = z.object({
    items: z.array(opinionSchema),
    total: z.number().int(),
    // 번역 전용 키가 설정돼 있는지 — 없으면 번역 버튼을 두지 않는다
    translationEnabled: z.boolean(),
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
        .length(TIER_SCOPE_COUNT),
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

export type PatternRatings = z.infer<typeof patternRatingsSchema>;
export type PatternSummary = z.infer<typeof patternSummarySchema>;
export type GoalVoteInput = z.infer<typeof goalVoteInputSchema>;
export type CommunityMutation = z.infer<typeof communityMutationSchema>;
export type CommunityData = z.infer<typeof communityDataSchema>;
export type OpinionQuery = z.infer<typeof opinionQuerySchema>;
export type OpinionPage = z.infer<typeof opinionPageSchema>;
export type OpinionReply = z.infer<typeof opinionReplySchema>;
export type OpinionReplyQuery = z.infer<typeof opinionReplyQuerySchema>;
export type OpinionReplyList = z.infer<typeof opinionReplyListSchema>;

export const EMPTY_PATTERN_RATINGS: PatternRatings = {
    stairs: null,
    repetition: null,
    polyrhythm: null,
    offset: null,
    chords: null,
};
