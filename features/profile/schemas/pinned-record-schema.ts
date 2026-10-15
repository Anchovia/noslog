import { z } from "zod";

/** 프로필 고정 기록(2026-09-26 S2) — 3칸까지 · 한 줄 소감 80자까지 */
export const PINNED_RECORD_LIMIT = 3;
export const PINNED_COMMENT_MAX = 80;

const pinnedRecordSchema = z.object({
    chartId: z.number().int().positive().max(2147483647),
    comment: z
        .string()
        .transform((value) => value.replace(/\s+/g, " ").trim())
        .pipe(z.string().max(PINNED_COMMENT_MAX))
        .nullable()
        .transform((value) => value || null),
});
export type PinnedRecordInput = z.output<typeof pinnedRecordSchema>;

/** 설정 폼 값 — 고른 순서대로 JSON 배열(빈 문자열 = 고르지 않음 · 자동). 같은 채보는 한 번만 */
export const pinnedRecordsValueSchema = z
    .string()
    .transform((value, context) => {
        if (!value) return [];
        try {
            return JSON.parse(value) as unknown;
        } catch {
            context.addIssue({ code: "custom", message: "invalid" });
            return z.NEVER;
        }
    })
    .pipe(
        z
            .array(pinnedRecordSchema)
            .max(PINNED_RECORD_LIMIT)
            .refine(
                (items) =>
                    new Set(items.map((item) => item.chartId)).size ===
                    items.length
            )
    );

/** 설정 창에서 고를 수 있는 기록 — 점수가 있는 채보 */
export const pinnableRecordSchema = z.object({
    chartId: z.number().int(),
    musicIndex: z.string(),
    title: z.string(),
    background: z.string().nullable(),
    difficulty: z.string(),
    level: z.number(),
    score: z.number(),
});
export type PinnableRecord = z.infer<typeof pinnableRecordSchema>;
