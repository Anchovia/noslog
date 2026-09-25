import { z } from "zod";

export const profileIdSchema = z.coerce
    .number()
    .int()
    .positive()
    .max(2147483647);

const profileModeSchema = z.enum(["basic", "recital"]);
const profileMetricSchema = z.enum(["grade", "rating"]);
export const PROFILE_BATCH_SIZE = 5;
/** 「활동」 탭의 최근 플레이는 20판씩(기록 탭과 같은 수) */
export const PROFILE_ACTIVITY_BATCH_SIZE = 20;
export const profileListQuerySchema = z.object({
    kind: z.enum(["best", "recent"]).default("best"),
    mode: profileModeSchema.default("basic"),
    metric: profileMetricSchema.default("grade"),
    offset: z.coerce.number().int().min(0).max(100000).default(0),
    limit: z.coerce
        .number()
        .pipe(
            z.union([
                z.literal(PROFILE_BATCH_SIZE),
                z.literal(PROFILE_ACTIVITY_BATCH_SIZE),
            ])
        )
        .default(PROFILE_BATCH_SIZE),
});
const profilePlaySchema = z.object({
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
    /** 그 채보에서의 순위 — 점수를 공개한 플레이어 사이(곡 상세 순위표와 같은 RANK). 최근 플레이는 없음 */
    chartRank: z.number().int().positive().nullable().default(null),
    /** 베스트 50 안의 순번(Grd 기여 순) — 거르거나 다른 순으로 봐도 그대로. 베스트가 아니면 없음 */
    position: z.number().int().positive().nullable().default(null),
    /** 최근 플레이 — 그 판이 그때까지의 최고 점수를 넘었는지(첫 플레이 포함, 2026-09-26) */
    newBest: z.boolean().default(false),
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

/** 「기록」 탭(2026-09-25 2단계) — 베스트 50 · 모든 기록, 정렬, 20개씩(검색 · 필터 없음 — 2026-09-26) */
export const PROFILE_RECORDS_PAGE_SIZE = 20;
export const PROFILE_RECORD_SORTS = [
    "value",
    "score",
    "recent",
    "title",
] as const;
export const profileRecordsQuerySchema = z.object({
    view: z.enum(["best", "all"]).default("best"),
    mode: profileModeSchema.default("basic"),
    sort: z.enum(PROFILE_RECORD_SORTS).default("value"),
    offset: z.coerce.number().int().min(0).max(100000).default(0),
});
export const profileRecordsPayloadSchema = z.object({
    query: profileRecordsQuerySchema,
    items: z.array(profilePlaySchema),
    total: z.number().int().min(0),
    hasMore: z.boolean(),
});
export type ProfileRecordsQuery = z.infer<typeof profileRecordsQuerySchema>;
export type ProfileRecordsPayload = z.infer<typeof profileRecordsPayloadSchema>;
