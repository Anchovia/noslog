import { z } from "zod";
import { nameLabelSchema } from "@/features/contributions/schemas/contributionLabelSchema";

export const GLOBAL_RANKING_PAGE_SIZE = 25;
const globalRankingQuerySchema = z.object({
    mode: z.enum(["basic", "recital"]).catch("basic"),
    metric: z.enum(["grade", "rating"]).catch("grade"),
    region: z.enum(["all", "kr", "jp", "global"]).catch("all"),
    page: z.coerce
        .number()
        .int()
        .positive()
        .max(Number.MAX_SAFE_INTEGER)
        .catch(1),
});
export type GlobalRankingQuery = z.infer<typeof globalRankingQuerySchema>;

export function parseGlobalRankingQuery(
    params: Pick<URLSearchParams, "get">
): GlobalRankingQuery {
    return globalRankingQuerySchema.parse({
        mode: params.get("mode"),
        metric: params.get("metric"),
        region: params.get("region"),
        page: params.get("page"),
    });
}

export function serializeGlobalRankingQuery(query: GlobalRankingQuery) {
    const params = new URLSearchParams({ mode: query.mode });
    if (query.metric === "rating") params.set("metric", query.metric);
    params.set("region", query.region);
    params.set("page", String(query.page));
    return params;
}

const globalRankingRowSchema = z.object({
    id: z.number().int().positive(),
    rank: z.number().int().positive(),
    username: z.string().nullable(),
    avatar: z.string().nullable(),
    country: z.string(),
    exam: z.number().int().nullable(),
    grade: z.number().int().nonnegative(),
    value: z.number().int().nonnegative(),
    rating: z.number().int().nonnegative().optional(),
    filledSlots: z.number().int().nonnegative().optional(),
    // 이름 옆 기여 라벨(운영자 · 기여 Lv.3 이상, 2026-09-24) — 페이지에 보이는 줄만 채운다
    label: nameLabelSchema.nullable().optional(),
});
export type GlobalRankingRow = z.infer<typeof globalRankingRowSchema>;

export const globalRankingPayloadSchema = z.object({
    query: globalRankingQuerySchema,
    page: z.number().int().positive(),
    totalCount: z.number().int().nonnegative(),
    status: z.enum(["available", "unavailable"]),
    rows: globalRankingRowSchema.array().max(GLOBAL_RANKING_PAGE_SIZE),
    currentUser: globalRankingRowSchema
        .extend({ page: z.number().int().positive() })
        .nullable(),
    viewerId: z.number().int().positive().nullable(),
});
export type GlobalRankingPayload = z.infer<typeof globalRankingPayloadSchema>;
